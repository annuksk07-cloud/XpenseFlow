import { useState, useEffect, useMemo, useCallback } from 'react';
import { db } from '../../firebaseConfig';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, orderBy, setDoc } from 'firebase/firestore';
import { Transaction, Settings, Stats, ToastMessage, TransactionType, CURRENCIES, CurrencyCode, Subscription } from '../../types';
import { useAuth } from '../../AuthContext';

declare const window: any;

const generateUUID = () => crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => (Math.random() * 16 | 0).toString(16));

const sanitizeError = (err: any): string => {
  if (err === null || err === undefined) return 'Unknown error';
  if (typeof err === 'string') return err;
  const possibleMessage = err.message || err.code || err.reason;
  if (typeof possibleMessage === 'string') return possibleMessage;
  return String(err);
};

const sanitizeFirestoreData = (data: any): any => {
  if (!data || typeof data !== 'object') return data;
  const sanitized: any = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const val = data[key];
      if (val === null || typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
        sanitized[key] = val;
      } else if (val instanceof Date) {
        sanitized[key] = val.toISOString();
      } else if (typeof val === 'object' && val.toDate && typeof val.toDate === 'function') {
        sanitized[key] = val.toDate().toISOString();
      } else if (Array.isArray(val)) {
        sanitized[key] = val.map(item => (typeof item === 'object' ? sanitizeFirestoreData(item) : item));
      } else if (typeof val === 'object') {
        sanitized[key] = sanitizeFirestoreData(val);
      } else {
        sanitized[key] = String(val);
      }
    }
  }
  return sanitized;
};

export const useTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [settings, setSettings] = useState<Settings>({
    budgetLimit: 2000,
    savingsGoal: 5000,
    baseCurrency: 'USD',
    isPrivacyMode: false,
    showOriginalCurrency: false,
    customRates: {},
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const addToast = useCallback((message: any, type: ToastMessage['type'] = 'info') => {
    const id = generateUUID();
    const safeMessage = sanitizeError(message);
    setToasts(prev => [...prev, { id, message: safeMessage, type }]);
  }, []);
  
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    if (!user?.uid) {
      setTransactions([]);
      setSubscriptions([]);
      setIsDataLoaded(true);
      return;
    }
    
    const uid = String(user.uid);
    const transactionsPath = collection(db, 'users', uid, 'transactions');
    const subscriptionsPath = collection(db, 'users', uid, 'subscriptions');
    const settingsDocRef = doc(db, 'users', uid, 'settings', 'config');

    const transactionsQuery = query(transactionsPath, orderBy('date', 'desc'));
    const subscriptionsQuery = query(subscriptionsPath, orderBy('nextDueDate', 'asc'));

    const unsubscribeTransactions = onSnapshot(transactionsQuery, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...sanitizeFirestoreData(doc.data()) 
      } as Transaction));
      setTransactions(fetched);
      setIsDataLoaded(true);
    }, (error) => {
      addToast(`Sync Error: ${sanitizeError(error)}`, 'error');
      setIsDataLoaded(true);
    });

    const unsubscribeSubscriptions = onSnapshot(subscriptionsQuery, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...sanitizeFirestoreData(doc.data()) 
      } as Subscription));
      setSubscriptions(fetched);
    }, (error) => {
      addToast(`Subscription Error: ${sanitizeError(error)}`, 'error');
    });

    const unsubscribeSettings = onSnapshot(settingsDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const rawData = docSnap.data();
        setSettings(prev => ({ ...prev, ...sanitizeFirestoreData(rawData) }));
      }
    }, (error) => {
      addToast(`Settings Error: ${sanitizeError(error)}`, 'error');
    });

    return () => {
      unsubscribeTransactions();
      unsubscribeSubscriptions();
      unsubscribeSettings();
    };
  }, [user?.uid, addToast]);

  const getEffectiveRate = useCallback((code: CurrencyCode) => {
    return settings.customRates?.[code] ?? CURRENCIES[code].rate;
  }, [settings.customRates]);

  const convertCurrency = useCallback((amount: number, from: CurrencyCode, to: CurrencyCode) => {
    if (from === to) return amount;
    const fromRate = getEffectiveRate(from);
    const toRate = getEffectiveRate(to);
    return (amount / fromRate) * toRate;
  }, [getEffectiveRate]);

  const addTransaction = async (data: Omit<Transaction, 'id' | 'amount' | 'date'>) => {
    if (!user?.uid) return;
    const baseAmount = convertCurrency(data.originalAmount, data.currency, settings.baseCurrency);
    const newTransaction = { ...data, amount: baseAmount, date: new Date().toISOString() };
    try {
      await addDoc(collection(db, 'users', String(user.uid), 'transactions'), newTransaction);
      addToast('Transaction recorded!', 'success');
    } catch (error: any) {
      addToast(`Record error: ${sanitizeError(error)}`, 'error');
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user?.uid) return;
    try {
      await deleteDoc(doc(db, 'users', String(user.uid), 'transactions', id));
      addToast('Transaction removed.', 'info');
    } catch(error: any) {
      addToast(`Delete failed: ${sanitizeError(error)}`, 'error');
    }
  };
  
  const addSubscription = async (data: Omit<Subscription, 'id'>) => {
    if (!user?.uid) return;
    try {
      await addDoc(collection(db, 'users', String(user.uid), 'subscriptions'), data);
      addToast('Subscription added!', 'success');
    } catch (error: any) {
       addToast(`Add error: ${sanitizeError(error)}`, 'error');
    }
  };
  
  const deleteSubscription = async (id: string) => {
    if (!user?.uid) return;
     try {
      await deleteDoc(doc(db, 'users', String(user.uid), 'subscriptions', id));
      addToast('Subscription removed.', 'info');
    } catch(error: any) {
      addToast(`Delete error: ${sanitizeError(error)}`, 'error');
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    if (!user?.uid) return;
    try {
      const merged = { ...settings, ...newSettings };
      await setDoc(doc(db, 'users', String(user.uid), 'settings', 'config'), merged);
    } catch (error: any) {
      addToast(`Settings error: ${sanitizeError(error)}`, 'error');
    }
  };

  const stats: Stats = useMemo(() => {
    return transactions.reduce((acc, t) => {
      const liveConverted = convertCurrency(t.originalAmount, t.currency, settings.baseCurrency);
      
      if (t.type === TransactionType.INCOME) {
        acc.totalIncome += liveConverted;
        acc.totalBalance += liveConverted;
      } else {
        acc.totalExpense += liveConverted;
        acc.totalBalance -= liveConverted;
      }
      return acc;
    }, { totalBalance: 0, totalIncome: 0, totalExpense: 0 });
  }, [transactions, settings.baseCurrency, convertCurrency]);

  const exportToCSV = () => {
    try {
      if (transactions.length === 0) return;
      const headers = 'Date,Title,Category,Type,Amount,Currency,BaseAmount,BaseCurrency\n';
      const rows = transactions.map(t => {
        const baseAmt = convertCurrency(t.originalAmount, t.currency, settings.baseCurrency);
        return [
          new Date(t.date).toLocaleDateString(), 
          t.title, 
          t.category, 
          t.type, 
          t.originalAmount, 
          t.currency,
          baseAmt.toFixed(2),
          settings.baseCurrency
        ].join(',');
      }).join('\n');
      const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `XpenseFlow_Data.csv`;
      link.click();
      addToast('CSV Exported', 'success');
    } catch (e) {
      addToast('CSV Export Failed', 'error');
    }
  };

  const exportToPDF = () => {
    try {
      if (transactions.length === 0) return;
      const { jsPDF } = window.jspdf;
      const docPdf = new jsPDF();
      docPdf.setFontSize(18);
      docPdf.text("XpenseFlow Financial Report", 14, 22);
      
      const tableRows = transactions.map(t => {
        const liveConverted = convertCurrency(t.originalAmount, t.currency, settings.baseCurrency);
        return [
          new Date(t.date).toLocaleDateString(),
          t.title,
          t.category,
          t.type,
          `${CURRENCIES[t.currency as CurrencyCode]?.symbol || '$'}${t.originalAmount.toFixed(2)} (${CURRENCIES[settings.baseCurrency].symbol}${liveConverted.toFixed(2)})`
        ];
      });

      docPdf.autoTable({
        head: [["Date", "Title", "Category", "Type", "Amount"]],
        body: tableRows,
        startY: 30,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] }
      });
      
      docPdf.save(`XpenseFlow_Report.pdf`);
      addToast('PDF Exported', 'success');
    } catch (e) {
      addToast('PDF Export Failed', 'error');
    }
  };

  return { 
    transactions, 
    addTransaction, 
    deleteTransaction, 
    subscriptions, 
    addSubscription, 
    deleteSubscription, 
    stats, 
    settings, 
    updateSettings, 
    toasts, 
    removeToast, 
    exportToCSV, 
    exportToPDF, 
    isDataLoaded,
    convertCurrency 
  };
};