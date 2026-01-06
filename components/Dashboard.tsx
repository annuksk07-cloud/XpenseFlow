import React from 'react';
import { Stats, Settings } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardProps {
  stats: Stats;
  settings: Settings;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, settings }) => {
  const { t } = useLanguage();
  const formatCurrency = (amount: number, options?: Intl.NumberFormatOptions) => new Intl.NumberFormat('en-US', { style: 'currency', currency: settings.baseCurrency, minimumFractionDigits: 2, ...options }).format(amount);
  const privacyClass = settings.isPrivacyMode ? 'filter blur-md' : '';

  return (
    <div className="space-y-6 mb-8">
      <div className="neumorphic p-6 text-center">
        <div className="flex items-center justify-center gap-3 text-gray-500 mb-2">
            <i className="fa-solid fa-wallet"></i>
            <h2 className="font-medium text-sm tracking-wider uppercase">{t('dashboard.totalBalance')}</h2>
        </div>
        <p className={`text-4xl sm:text-5xl font-bold text-[#1A1C2E] transition-all duration-300 ${privacyClass}`}>
          {formatCurrency(stats.totalBalance, { minimumFractionDigits: 2 })}
        </p>
      </div>

      <div className="flex justify-between gap-6">
        <div className="neumorphic flex-1 p-5">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center">
                    <i className="fa-solid fa-arrow-up"></i>
                </div>
                <div>
                    <p className="text-sm text-gray-500">{t('dashboard.income')}</p>
                    <p className={`text-lg font-bold text-[#1A1C2E] transition-all duration-300 ${privacyClass}`}>{formatCurrency(stats.totalIncome, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</p>
                </div>
            </div>
        </div>
        <div className="neumorphic flex-1 p-5">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center">
                    <i className="fa-solid fa-arrow-down"></i>
                </div>
                <div>
                    <p className="text-sm text-gray-500">{t('dashboard.expense')}</p>
                    <p className={`text-lg font-bold text-[#1A1C2E] transition-all duration-300 ${privacyClass}`}>{formatCurrency(stats.totalExpense, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;