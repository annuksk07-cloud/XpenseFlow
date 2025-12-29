import { useState, useEffect, useCallback } from 'react';
import { Transaction, TransactionType, DashboardStats, UserSettings, CURRENCIES, CurrencyCode, PaymentMethod, ToastMessage, ToastType } from '../types';

const STORAGE_KEY = 'expense_tracker_transactions';
const SETTINGS_KEY = 'expense_tracker_settings';

const DEFAULT_SETTINGS: UserSettings = {
  budgetLimit: 2000,
  savingsGoal: 5000,
  baseCurrency: 'USD',
  isPrivacyMode: false
};

// Polyfill for randomUUID in case it's missing (non-secure context)
const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const savedTrans = localStorage.getItem(STORAGE_KEY);
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    
    if (savedTrans) {
      try {
        setTransactions(JSON.parse(savedTrans));
      } catch (e) {
        console.error("Failed to parse transactions", e);
      }
    }

    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = generateUUID();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const convertCurrency = useCallback((amount: number, from: string, to: string) => {
    const fromRate = CURRENCIES[from as CurrencyCode]?.rate || 1;
    const toRate = CURRENCIES[to as CurrencyCode]?.rate || 1;
    return (amount / fromRate) * toRate;
  }, []);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const baseAmount = convertCurrency(transaction.originalAmount, transaction.currency, settings.baseCurrency || 'USD');

    const newTransaction: Transaction = {
      ...transaction,
      amount: baseAmount, 
      id: generateUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paymentMethod: transaction.paymentMethod || PaymentMethod.CARD
    };
    setTransactions(prev => [newTransaction, ...prev]);
    addToast('Transaction added successfully', 'success');
  }, [settings.baseCurrency, convertCurrency, addToast]);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    addToast('Transaction removed', 'info');
  }, [addToast]);

  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Advanced Stats Calculation
  const stats: DashboardStats = transactions.reduce(
    (acc, curr) => {
      const amount = Number(curr.amount);
      if (curr.type === TransactionType.INCOME) {
        acc.totalIncome += amount;
        acc.totalBalance += amount;
      } else {
        acc.totalExpense += amount;
        acc.totalBalance -= amount;
        if (curr.hasTax && curr.taxAmount) {
          acc.totalTax += Number(curr.taxAmount);
        }
      }
      return acc;
    },
    { totalBalance: 0, totalIncome: 0, totalExpense: 0, burnRate: 0, projectedSpend: 0, totalTax: 0 }
  );

  // Forecasting Logic
  const today = new Date();
  const dayOfMonth = today.getDate();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  
  // Calculate expenses specifically for CURRENT month for accurate burn rate
  const currentMonthExpenses = transactions
    .filter(t => t.type === TransactionType.EXPENSE && new Date(t.date).getMonth() === today.getMonth())
    .reduce((sum, t) => sum + t.amount, 0);

  stats.burnRate = dayOfMonth > 0 ? currentMonthExpenses / dayOfMonth : 0;
  stats.projectedSpend = stats.burnRate * daysInMonth;

  const exportToCSV = () => {
    const headers = ['Date', 'Title', 'Category', 'Amount (Base)', 'Currency', 'Type', 'Payment Method', 'Has Tax', 'Tax Amount', 'Created At'];
    const rows = transactions.map(t => [
      t.date,
      `"${t.title}"`,
      t.category,
      t.amount.toFixed(2),
      t.currency,
      t.type,
      t.paymentMethod || 'N/A',
      t.hasTax ? 'Yes' : 'No',
      t.taxAmount || 0,
      t.createdAt || ''
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `xpenseflow_audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Audit Report downloaded', 'success');
  };

  const backupData = () => {
    const backup = {
      settings,
      transactions,
      timestamp: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const link = document.createElement('a');
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `xpenseflow_backup.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Backup saved successfully', 'success');
  };

  return {
    transactions,
    settings,
    addTransaction,
    deleteTransaction,
    updateSettings,
    stats,
    convertCurrency,
    exportToCSV,
    backupData,
    toasts,
    removeToast
  };
};