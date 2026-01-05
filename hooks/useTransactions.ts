import { useState, useEffect, useMemo, useCallback } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, orderBy, setDoc } from 'firebase/firestore';
import { Transaction, Settings, Stats, ToastMessage, TransactionType, CURRENCIES, CurrencyCode, Subscription } from '../types';
import { useAuth } from '../contexts/AuthContext';

// Use jsPDF from the window object
declare const window: any;

const generateUUID = () => crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => (Math.random() * 16 | 0).toString(16));

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

  const addToast = useCallback((message: string, type: ToastMessage['type'] = 'info') => {
    const id = generateUUID();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);
  
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setSubscriptions([]);
      setIsDataLoaded(true);
      return;
    }
    
    // Firestore listeners
    const transactionsQuery = query(collection(db, 'users', user.uid, 'transactions'), orderBy('date', 'desc'));
    const subscriptionsQuery = query(collection(db, 'users', user.uid, 'subscriptions'), orderBy('nextDueDate', 'asc'));
    const settingsDocRef = doc(db, 'users', user.uid, 'settings', 'config');

    const unsubscribeTransactions = onSnapshot(transactionsQuery, (snapshot) => {
      const fetchedTransactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
      setTransactions(fetchedTransactions);
      if (!isDataLoaded) setIsDataLoaded(true);
    }, (error) => {
      console.error("Error fetching transactions:", error);
      addToast('Could not sync transactions.', 'error');
    });

    const unsubscribeSubscriptions = onSnapshot(subscriptionsQuery, (snapshot) => {
      const fetchedSubscriptions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subscription));
      setSubscriptions(fetchedSubscriptions);
    }, (error) => {
      console.error("Error fetching subscriptions:", error);
      addToast('Could not sync subscriptions.', 'error');
    });

    const unsubscribeSettings = onSnapshot(settingsDocRef, (doc) => {
      if (doc.exists()) {
        setSettings(doc.data() as Settings);
      }
    }, (error) => {
      console.error("Error fetching settings:", error);
      addToast('Could not sync settings.', 'error');
    });

    return () => {
      unsubscribeTransactions();
      unsubscribeSubscriptions();
      unsubscribeSettings();
    };
  }, [user, isDataLoaded, addToast]);


  const convertCurrency = (amount: number, from: CurrencyCode, to: CurrencyCode) => {
      const fromRate = CURRENCIES[from]?.rate || 1;
      const toRate = CURRENCIES[to]?.rate || 1;
      return (amount / fromRate) * toRate;
  };

  const addTransaction = async (data: Omit<Transaction, 'id' | 'amount' | 'date'>) => {
    if (!user) return;
    const baseAmount = convertCurrency(data.originalAmount, data.currency, settings.baseCurrency);
    const newTransaction = {
      ...data,
      amount: baseAmount,
      date: new Date().toISOString(),
    };
    try {
      await addDoc(collection(db, 'users', user.uid, 'transactions'), newTransaction);
      addToast('Transaction added successfully!', 'success');
    } catch (error) {
      console.error("Error adding transaction: ", error);
      addToast('Failed to add transaction.', 'error');
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'transactions', id));
      addToast('Transaction removed.', 'info');
    } catch(error) {
      console.error("Error removing transaction: ", error);
      addToast('Failed to remove transaction.', 'error');
    }
  };
  
  const addSubscription = async (data: Omit<Subscription, 'id'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'users', user.uid, 'subscriptions'), data);
      addToast('Subscription added!', 'success');
    } catch (error) {
       console.error("Error adding subscription: ", error);
       addToast('Failed to add subscription.', 'error');
    }
  };
  
  const deleteSubscription = async (id: string) => {
    if (!user) return;
     try {
      await deleteDoc(doc(db, 'users', user.uid, 'subscriptions', id));
      addToast('Subscription removed.', 'info');
    } catch(error) {
      console.error("Error removing subscription: ", error);
      addToast('Failed to remove subscription.', 'error');
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    if (!user) return;
    const updatedSettings = { ...settings, ...newSettings };
    try {
      await setDoc(doc(db, 'users', user.uid, 'settings', 'config'), updatedSettings);
      addToast('Settings updated!', 'success');
    } catch (error) {
      console.error("Error updating settings: ", error);
      addToast('Failed to update settings.', 'error');
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
    if (transactions.length === 0) {
      addToast('No data to export', 'error');
      return;
    }
    const headers = 'Date,Title,Category,Type,Amount,Currency\n';
    const rows = transactions.map(t =>
      [ new Date(t.date).toLocaleDateString(), t.title, t.category, t.type, t.originalAmount, t.currency ].join(',')
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `XpenseFlow_Export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    addToast('Data exported to CSV', 'success');
  };

  const exportToPDF = () => {
    if (transactions.length === 0) {
      addToast('No data to export', 'error');
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text("XpenseFlow Transaction Report", 14, 22);
    doc.setFontSize(12);
    doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 14, 30);

    const tableColumn = ["Date", "Title", "Category", "Type", "Amount"];
    const tableRows: any[] = [];

    transactions.forEach(t => {
      const transactionData = [
        new Date(t.date).toLocaleDateString(),
        t.title,
        t.category,
        t.type,
        new Intl.NumberFormat('en-US', { style: 'currency', currency: t.currency }).format(t.originalAmount)
      ];
      tableRows.push(transactionData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [22, 160, 133] }
    });
    
    const finalY = doc.autoTable.previous.finalY;
    doc.setFontSize(12);
    doc.text("Summary", 14, finalY + 15);
    doc.autoTable({
      body: [
        ['Total Income', new Intl.NumberFormat('en-US', { style: 'currency', currency: settings.baseCurrency }).format(stats.totalIncome)],
        ['Total Expense', new Intl.NumberFormat('en-US', { style: 'currency', currency: settings.baseCurrency }).format(stats.totalExpense)],
        ['Net Balance', new Intl.NumberFormat('en-US', { style: 'currency', currency: settings.baseCurrency }).format(stats.totalBalance)],
      ],
      startY: finalY + 20,
      theme: 'plain'
    });

    doc.save(`XpenseFlow_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    addToast('Data exported to PDF', 'success');
  };


  return { transactions, addTransaction, deleteTransaction, subscriptions, addSubscription, deleteSubscription, stats, settings, updateSettings, toasts, removeToast, exportToCSV, exportToPDF, isDataLoaded };
};