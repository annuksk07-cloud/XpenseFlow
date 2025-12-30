import React from 'react';
import { Stats, Settings } from '../types';

interface FinancialHealthProps {
  stats: Stats;
  settings: Settings;
}

const FinancialHealth: React.FC<FinancialHealthProps> = ({ stats, settings }) => {
  const savingsRate = stats.totalIncome > 0 ? ((stats.totalIncome - stats.totalExpense) / stats.totalIncome) * 100 : 0;
  const budgetUsage = (stats.totalExpense / settings.budgetLimit) * 100;
  const isDangerZone = budgetUsage > 80;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold text-gray-700 px-2 mb-3">Financial Health</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-[#efeeee] shadow-[5px_5px_10px_#d1d1d1,-5px_-5px_10px_#ffffff] flex flex-col items-center text-center">
           <div className="mb-2 p-3 rounded-full bg-[#efeeee] text-orange-500 shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff]">
             <i className={`fa-solid fa-fire-flame-curved fa-lg ${savingsRate > 20 ? 'animate-pulse' : ''}`}></i>
           </div>
           <span className="text-xs font-bold text-gray-500 uppercase">Savings Streak</span>
           <span className="text-xl font-black text-gray-700">{savingsRate > 0 ? 'Active' : 'Inactive'}</span>
           <span className="text-[10px] text-gray-400 mt-1">{savingsRate.toFixed(0)}% saved</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#efeeee] shadow-[5px_5px_10px_#d1d1d1,-5px_-5px_10px_#ffffff] flex flex-col items-center text-center">
           <div className="mb-2 p-3 rounded-full bg-[#efeeee] text-blue-500 shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff]">
             <i className="fa-solid fa-gauge-high fa-lg"></i>
           </div>
           <span className="text-xs font-bold text-gray-500 uppercase">Budget Use</span>
           <span className="text-xl font-black text-gray-700">{Math.min(100, budgetUsage).toFixed(0)}%</span>
           <span className="text-[10px] text-gray-400 mt-1">of monthly limit</span>
        </div>
      </div>
      {isDangerZone && (
        <div className="mt-4 p-3 rounded-xl bg-[#efeeee] shadow-[inset_3px_3px_6px_#d1d1d1,inset_-3px_-3px_6px_#ffffff] border-l-4 border-red-500 flex items-start gap-3">
          <i className="fa-solid fa-triangle-exclamation text-red-500 shrink-0 mt-0.5"></i>
          <div>
            <p className="text-xs font-bold text-gray-700">Budget Alert</p>
            <p className="text-[10px] text-gray-500 leading-tight">You've used {budgetUsage.toFixed(0)}% of your limit.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialHealth;