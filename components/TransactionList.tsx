import React from 'react';
import { Transaction, Settings, TransactionType } from '../types';

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
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: settings.baseCurrency }).format(amount);

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-700 px-2 mb-3">{transactions.length} Transaction{transactions.length !== 1 ? 's' : ''}</h3>
      {transactions.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="w-16 h-16 rounded-full bg-[#efeeee] shadow-[5px_5px_10px_#c5c5c5,-5px_-5px_10px_#ffffff] flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-inbox fa-lg"></i>
          </div>
          <p>No transactions yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map(t => (
            <div key={t.id} className="group flex items-center justify-between p-4 rounded-2xl bg-[#efeeee] shadow-[5px_5px_10px_#d1d1d1,-5px_-5px_10px_#ffffff]">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff] ${t.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-500'}`}>
                  <i className={`fa-solid ${getCategoryIcon(t.category)}`}></i>
                </div>
                <div>
                  <p className="font-bold text-gray-700 text-sm">{t.title}</p>
                  <span className="text-xs text-gray-500">{new Date(t.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-bold ${t.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-500'}`}>
                  {t.type === TransactionType.INCOME ? '+' : '-'}{formatCurrency(Math.abs(t.amount))}
                </span>
                <button onClick={() => onDelete(t.id)} className="w-11 h-11 rounded-full flex items-center justify-center text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity">
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