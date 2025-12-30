import React from 'react';
import { Stats, Settings } from '../types';

interface DashboardProps {
  stats: Stats;
  settings: Settings;
  onSettingsClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, settings, onSettingsClick }) => {
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: settings.baseCurrency }).format(amount);
  const privacyClass = settings.isPrivacyMode ? 'filter blur-md' : '';

  return (
    <div className="p-6 rounded-3xl bg-[#efeeee] shadow-[10px_10px_20px_#c5c5c5,-10px_-10px_20px_#ffffff] mb-8 relative">
      <button onClick={onSettingsClick} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-blue-500" aria-label="Open settings">
        <i className="fa-solid fa-gear text-lg"></i>
      </button>
      <div className="text-center mb-6 mt-2">
        <h2 className="text-gray-500 font-medium text-sm tracking-wider uppercase mb-2">Total Balance</h2>
        <div className={`flex items-center justify-center gap-2 text-4xl font-bold text-gray-700 transition-all duration-300 ${privacyClass}`}>
          <i className="fa-solid fa-wallet"></i>
          <span>{formatCurrency(stats.totalBalance)}</span>
        </div>
      </div>
      <div className="flex justify-between gap-4">
        <div className="flex-1 p-4 rounded-2xl bg-[#efeeee] shadow-[inset_5px_5px_10px_#d1d1d1,inset_-5px_-5px_10px_#ffffff] flex flex-col items-center">
          <div className="flex items-center gap-1 mb-1 text-green-600"><i className="fa-solid fa-arrow-trend-up"></i><span className="text-xs font-bold uppercase">Income</span></div>
          <span className={`text-lg font-bold text-gray-700 transition-all duration-300 ${privacyClass}`}>{formatCurrency(stats.totalIncome)}</span>
        </div>
        <div className="flex-1 p-4 rounded-2xl bg-[#efeeee] shadow-[inset_5px_5px_10px_#d1d1d1,inset_-5px_-5px_10px_#ffffff] flex flex-col items-center">
          <div className="flex items-center gap-1 mb-1 text-red-500"><i className="fa-solid fa-arrow-trend-down"></i><span className="text-xs font-bold uppercase">Expense</span></div>
          <span className={`text-lg font-bold text-gray-700 transition-all duration-300 ${privacyClass}`}>{formatCurrency(stats.totalExpense)}</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;