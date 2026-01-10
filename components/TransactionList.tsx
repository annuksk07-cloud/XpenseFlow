import React from 'react';
import { Transaction, Settings, TransactionType } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  settings: Settings;
}

const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
        case 'food': return 'fa-utensils';
        case 'transport': return 'fa-car';
        case 'shopping': return 'fa-shopping-bag';
        case 'bills': return 'fa-file-invoice-dollar';
        case 'entertainment': return 'fa-film';
        case 'health': return 'fa-heartbeat';
        case 'salary': return 'fa-briefcase';
        default: return 'fa-dollar-sign';
    }
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete, settings }) => {
  const { t } = useLanguage();
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: settings.baseCurrency }).format(amount);

  return (
    <div className="pb-10">
      <h3 className="text-xl font-black text-[#1A1C2E] px-2 mb-6 tracking-tight">{t('transactions.title')}</h3>
      {transactions.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <div className="w-24 h-24 rounded-full neumorphic-inset flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-receipt fa-2x opacity-20"></i>
          </div>
          <p className="font-bold">{t('transactions.noTransactions')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {transactions.map(t => (
            <div key={t.id} className="group flex items-center justify-between p-5 neumorphic animate-fade-in-up">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg neumorphic-inset`}>
                  <i className={`fa-solid ${getCategoryIcon(t.category)} ${t.type === TransactionType.INCOME ? 'text-emerald-500' : 'text-rose-500'}`}></i>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-[#1A1C2E] truncate pr-2">{t.title}</p>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`font-black text-base ${t.type === TransactionType.INCOME ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {t.type === TransactionType.INCOME ? '+' : '-'}{formatCurrency(Math.abs(t.amount))}
                </span>
                <button onClick={() => onDelete(t.id)} className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-gray-400 active:text-rose-500 neumorphic-flat !rounded-full active:neumorphic-pressed transition-all">
                  <i className="fa-solid fa-trash-can text-sm"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionList;