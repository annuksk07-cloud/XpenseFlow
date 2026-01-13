import { useState, useEffect, useMemo, useCallback } from 'react';
import { db } from '../../firebaseConfig';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, orderBy, setDoc } from 'firebase/firestore';
import { Transaction, Settings, Stats, ToastMessage, TransactionType, CURRENCIES, CurrencyCode, Subscription } from '../../types';
import { useAuth } from '../../AuthContext';

declare const window: any;

const generateUUID = () => crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => (Math.random() * 16 | 0).toString(16));

/**
 * CIRCULAR-SAFE ERROR SANITIZER
 * Explicitly converts complex error objects into primitive strings to prevent JSON circularity crashes.
 */
const sanitizeError = (err: any): string => {
  if (err === null || err === undefined) return 'Unknown error';
  if (typeof err === 'string') return err;
  
  // Try to find a primitive message property
  const possibleMessage = err.message || err.code || err.reason;
  if (typeof possibleMessage === 'string') return possibleMessage;
  
  // Use String constructor for a shallow, non-recursive string conversion
  return String(err);
};

/**
 * DEEP DATA PURIFICATION
 * Ensures Firestore data is mapped to plain objects, converting special types like Timestamps to ISO strings.
 */
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
      } else {
        // Final fallback: stringify individual property if complex to avoid circle crawl
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
    
    const transactionsPath = collection(db, 'users', user.uid, 'transactions');
    const subscriptionsPath = collection(db, 'users', user.uid, 'subscriptions');
    const settingsDocRef = doc(db, 'users', user.uid, 'settings', 'config');

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
        setSettings(docSnap.data() as Settings);
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

  const convertCurrency = (amount: number, from: CurrencyCode, to: CurrencyCode) => {
    const fromRate = CURRENCIES[from]?.rate || 1;
    const toRate = CURRENCIES[to]?.rate || 1;
    return (amount / fromRate) * toRate;
  };

  const addTransaction = async (data: Omit<Transaction, 'id' | 'amount' | 'date'>) => {
    if (!user?.uid) return;
    const baseAmount = convertCurrency(data.originalAmount, data.currency, settings.baseCurrency);
    const newTransaction = { ...data, amount: baseAmount, date: new Date().toISOString() };
    try {
      await addDoc(collection(db, 'users', user.uid, 'transactions'), newTransaction);
      addToast('Transaction recorded!', 'success');
    } catch (error: any) {
      addToast(`Record error: ${sanitizeError(error)}`, 'error');
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user?.uid) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'transactions', id));
      addToast('Transaction removed.', 'info');
    } catch(error: any) {
      addToast(`Delete failed: ${sanitizeError(error)}`, 'error');
    }
  };
  
  const addSubscription = async (data: Omit<Subscription, 'id'>) => {
    if (!user?.uid) return;
    try {
      await addDoc(collection(db, 'users', user.uid, 'subscriptions'), data);
      addToast('Subscription added!', 'success');
    } catch (error: any) {
       addToast(`Add error: ${sanitizeError(error)}`, 'error');
    }
  };
  
  const deleteSubscription = async (id: string) => {
    if (!user?.uid) return;
     try {
      await deleteDoc(doc(db, 'users', user.uid, 'subscriptions', id));
      addToast('Subscription removed.', 'info');
    } catch(error: any) {
      addToast(`Delete error: ${sanitizeError(error)}`, 'error');
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    if (!user?.uid) return;
    try {
      await setDoc(doc(db, 'users', user.uid, 'settings', 'config'), { ...settings, ...newSettings });
    } catch (error: any) {
      addToast(`Settings error: ${sanitizeError(error)}`, 'error');
    }
  };

  const stats: Stats = useMemo(() => {
    return transactions.reduce((acc, t) => {
      if (t.type === TransactionType.INCOME) {
        acc.totalIncome += t.amount;
        acc.totalBalance += t.amount;
      } else {
        acc.totalExpense += t.amount;
        acc.totalBalance -= t.amount;
      }
      return acc;
    }, { totalBalance: 0, totalIncome: 0, totalExpense: 0 });
  }, [transactions]);

  const exportToCSV = () => {
    try {
      if (transactions.length === 0) return;
      const headers = 'Date,Title,Category,Type,Amount,Currency\n';
      const rows = transactions.map(t => [new Date(t.date).toLocaleDateString(), t.title, t.category, t.type, t.originalAmount, t.currency].join(',')).join('\n');
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
      
      const tableRows = transactions.map(t => [
        new Date(t.date).toLocaleDateString(),
        t.title,
        t.category,
        t.type,
        `${CURRENCIES[t.currency].symbol}${t.originalAmount.toFixed(2)}`
      ]);

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

  return { transactions, addTransaction, deleteTransaction, subscriptions, addSubscription, deleteSubscription, stats, settings, updateSettings, toasts, removeToast, exportToCSV, exportToPDF, isDataLoaded };
};