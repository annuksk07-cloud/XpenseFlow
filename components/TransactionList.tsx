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
    <div>
      <h3 className="text-lg font-bold text-[#1A1C2E] px-2 mb-4">{t('transactions.title')}</h3>
      {transactions.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="w-20 h-20 rounded-full neumorphic-inset flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-inbox fa-2x"></i>
          </div>
          <p>{t('transactions.noTransactions')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map(t => (
            <div key={t.id} className="group flex items-center justify-between p-4 neumorphic animate-fade-in-up">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg neumorphic-inset`}>
                  <i className={`fa-solid ${getCategoryIcon(t.category)} ${t.type === TransactionType.INCOME ? 'text-emerald-500' : 'text-rose-500'}`}></i>
                </div>
                <div>
                  <p className="font-bold text-[#1A1C2E]">{t.title}</p>
                  <span className="text-sm text-gray-500">{new Date(t.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-bold text-lg ${t.type === TransactionType.INCOME ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {t.type === TransactionType.INCOME ? '+' : '-'}{formatCurrency(Math.abs(t.amount))}
                </span>
                <button onClick={() => onDelete(t.id)} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 opacity-0 group-hover:opacity-100 neumorphic-flat !rounded-full active:neumorphic-pressed hover:text-rose-500 transition-all">
                  <i className="fa-solid fa-trash"></i>
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