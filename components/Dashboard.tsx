import React from 'react';
import { DashboardStats, UserSettings, CURRENCIES, CurrencyCode } from '../types';
import { Wallet, TrendingUp, TrendingDown, Eye, EyeOff, Settings } from 'lucide-react';

interface DashboardProps {
  stats: DashboardStats;
  settings: UserSettings;
  onOpenSettings: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, settings, onOpenSettings }) => {
  const currencySymbol = CURRENCIES[settings.baseCurrency as CurrencyCode]?.symbol || '$';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: settings.baseCurrency,
    }).format(amount);
  };

  return (
    <div className="p-6 rounded-3xl bg-[#efeeee] shadow-[10px_10px_20px_#c5c5c5,-10px_-10px_20px_#ffffff] mb-8 relative group">
      <div className="absolute top-4 right-4 flex gap-2">
         <button 
          onClick={onOpenSettings}
          className="p-2 rounded-full text-gray-400 hover:text-blue-500 transition-colors"
          title="App Settings"
        >
          <Settings size={18} />
        </button>
      </div>

      <div className="text-center mb-6 mt-2">
        <h2 className="text-gray-500 font-medium text-sm tracking-wider uppercase mb-2">Total Balance</h2>
        <div className={`flex items-center justify-center gap-2 text-4xl font-bold text-gray-700 transition-all duration-300 ${settings.isPrivacyMode ? 'filter blur-md select-none' : ''}`}>
           <Wallet className="w-8 h-8 opacity-75" />
           <span>{formatCurrency(stats.totalBalance)}</span>
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <div className="flex-1 p-4 rounded-2xl bg-[#efeeee] shadow-[inset_5px_5px_10px_#d1d1d1,inset_-5px_-5px_10px_#ffffff] flex flex-col items-center">
          <div className="flex items-center gap-1 mb-1 text-green-600">
            <TrendingUp size={16} />
            <span className="text-xs font-bold uppercase">Income</span>
          </div>
          <span className={`text-lg font-bold text-gray-700 transition-all duration-300 ${settings.isPrivacyMode ? 'filter blur-md' : ''}`}>
            {formatCurrency(stats.totalIncome)}
          </span>
        </div>

        <div className="flex-1 p-4 rounded-2xl bg-[#efeeee] shadow-[inset_5px_5px_10px_#d1d1d1,inset_-5px_-5px_10px_#ffffff] flex flex-col items-center">
          <div className="flex items-center gap-1 mb-1 text-red-500">
            <TrendingDown size={16} />
            <span className="text-xs font-bold uppercase">Expense</span>
          </div>
          <span className={`text-lg font-bold text-gray-700 transition-all duration-300 ${settings.isPrivacyMode ? 'filter blur-md' : ''}`}>
            {formatCurrency(stats.totalExpense)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;