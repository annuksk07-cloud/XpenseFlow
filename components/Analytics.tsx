import React from 'react';
import { Transaction, TransactionType } from '../types';

interface AnalyticsProps {
  transactions: Transaction[];
}

const Analytics: React.FC<AnalyticsProps> = ({ transactions }) => {
  const expenses = transactions.filter(t => t.type === TransactionType.EXPENSE);
  const totalExpense = expenses.reduce((acc, t) => acc + Number(t.amount), 0);

  // Category Analysis
  const categories = expenses.reduce((acc, t) => {
    const category = t.category;
    const amount = Number(t.amount);
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categories)
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, 4); // Top 4 categories

  // Weekly Activity (Last 7 Days)
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const dailyTotals = last7Days.map(dateStr => {
    return expenses
      .filter(t => t.date.startsWith(dateStr))
      .reduce((acc, t) => acc + Number(t.amount), 0);
  });

  const maxDaily = Math.max(...dailyTotals, 1); // Avoid div by 0

  if (transactions.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-700 px-2 mb-4">Spend Analysis</h3>
      
      {/* Weekly Chart */}
      <div className="p-6 rounded-2xl bg-[#efeeee] shadow-[5px_5px_10px_#d1d1d1,-5px_-5px_10px_#ffffff] mb-6">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Last 7 Days</h4>
        <div className="flex items-end justify-between h-32 gap-2">
          {dailyTotals.map((amount, i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
               <div className="relative w-full flex justify-center">
                  <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 text-white text-[10px] px-1 py-0.5 rounded">
                    ${amount}
                  </div>
                  <div 
                    className="w-full max-w-[12px] bg-blue-400 rounded-t-sm shadow-[2px_2px_4px_rgba(0,0,0,0.1)] transition-all duration-500 ease-out hover:bg-blue-500"
                    style={{ height: `${(amount / maxDaily) * 100}%`, minHeight: '4px' }}
                  />
               </div>
               <span className="text-[10px] text-gray-400 font-medium">
                 {new Date(last7Days[i]).toLocaleDateString('en-US', { weekday: 'narrow' })}
               </span>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        {sortedCategories.map(([cat, amount]) => {
          const numAmount = Number(amount);
          const percent = totalExpense > 0 ? (numAmount / totalExpense) * 100 : 0;
          return (
            <div key={cat} className="flex items-center justify-between p-3 rounded-xl bg-[#efeeee] shadow-[3px_3px_6px_#d1d1d1,-3px_-3px_6px_#ffffff]">
              <div className="flex-1">
                <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                  <span>{cat}</span>
                  <span>{percent.toFixed(0)}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#efeeee] rounded-full shadow-[inset_1px_1px_2px_#d1d1d1,inset_-1px_-1px_2px_#ffffff]">
                   <div 
                      className="h-full bg-indigo-400 rounded-full"
                      style={{ width: `${percent}%` }}
                   />
                </div>
              </div>
              <div className="ml-4 font-bold text-gray-700 text-sm">
                ${numAmount.toFixed(0)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Analytics;