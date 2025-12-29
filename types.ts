export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  WALLET = 'WALLET',
  TRANSFER = 'TRANSFER'
}

export interface Transaction {
  id: string;
  title: string;
  amount: number; // Stored in base currency equivalent for easier calc
  originalAmount: number; // What user entered
  currency: string;
  type: TransactionType;
  date: string;
  category: string;
  tags?: string[];
  isRecurring?: boolean;
  // New Fields
  paymentMethod?: PaymentMethod;
  hasTax?: boolean;
  taxAmount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  burnRate: number; // Daily spend average
  projectedSpend: number; // End of month projection
  totalTax: number;
}

export interface UserSettings {
  budgetLimit: number;
  savingsGoal: number;
  baseCurrency: string;
  isPrivacyMode: boolean;
}

export const CURRENCIES = {
  USD: { symbol: '$', rate: 1 },
  EUR: { symbol: '€', rate: 0.92 },
  GBP: { symbol: '£', rate: 0.79 },
  INR: { symbol: '₹', rate: 83.5 },
  JPY: { symbol: '¥', rate: 150.0 }
};

export type CurrencyCode = keyof typeof CURRENCIES;

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}