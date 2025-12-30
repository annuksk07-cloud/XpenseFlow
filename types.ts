export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  WALLET = 'WALLET',
  TRANSFER = 'TRANSFER',
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY';

export const CURRENCIES: Record<CurrencyCode, { symbol: string; rate: number }> = {
  USD: { symbol: '$', rate: 1 },
  EUR: { symbol: '€', rate: 0.92 },
  GBP: { symbol: '£', rate: 0.79 },
  INR: { symbol: '₹', rate: 83.5 },
  JPY: { symbol: '¥', rate: 150.0 },
};

export interface Transaction {
  id: string;
  title: string;
  originalAmount: number;
  amount: number; // Amount in base currency
  currency: CurrencyCode;
  type: TransactionType;
  category: string;
  date: string; // ISO string
}

export interface Settings {
  budgetLimit: number;
  savingsGoal: number;
  baseCurrency: CurrencyCode;
  isPrivacyMode: boolean;
}

export interface Stats {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error';
}