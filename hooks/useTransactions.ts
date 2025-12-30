import { useState, useEffect, useMemo } from 'react';
import { Transaction, Settings, Stats, ToastMessage, TransactionType, CURRENCIES, CurrencyCode } from '../types';

const STORAGE_KEY_TRANSACTIONS = 'expense_tracker_transactions';
const STORAGE_KEY_SETTINGS = 'expense_tracker_settings';

const generateUUID = () => crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => (Math.random() * 16 | 0).toString(16));

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<Settings>({
    budgetLimit: 2000,
    savingsGoal: 5000,
    baseCurrency: 'USD',
    isPrivacyMode: false,
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Load state from localStorage on initial mount
  useEffect(() => {
    try {
      const savedTransactions = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
      const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      }
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Failed to load data from localStorage', error);
    } finally {
      setIsDataLoaded(true); // Signal that loading is complete
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
    }
  }, [transactions, isDataLoaded]);

  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    }
  }, [settings, isDataLoaded]);

  const addToast = (message: string, type: ToastMessage['type'] = 'info') => {
    const id = generateUUID();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };
  
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  const convertCurrency = (amount: number, from: CurrencyCode, to: CurrencyCode) => {
      const fromRate = CURRENCIES[from]?.rate || 1;
      const toRate = CURRENCIES[to]?.rate || 1;
      return (amount / fromRate) * toRate;
  };

  const addTransaction = (data: Omit<Transaction, 'id' | 'amount' | 'date'>) => {
    const baseAmount = convertCurrency(data.originalAmount, data.currency, settings.baseCurrency);
    const newTransaction: Transaction = {
      ...data,
      id: generateUUID(),
      amount: baseAmount,
      date: new Date().toISOString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
    addToast('Transaction added successfully!', 'success');
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    addToast('Transaction removed.', 'info');
  };
  
  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    addToast('Settings updated!', 'success');
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

  const exportToCSV = () => { /* ... (Logic remains the same) ... */ addToast('Data exported'); };
  const backupData = () => { /* ... (Logic remains the same) ... */ addToast('Backup created'); };

  return { transactions, addTransaction, deleteTransaction, stats, settings, updateSettings, toasts, removeToast, exportToCSV, backupData, isDataLoaded };
};