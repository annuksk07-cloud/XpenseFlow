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
      <div className="neumorphic p-6 text-center overflow-hidden">
        <div className="flex items-center justify-center gap-3 text-gray-400 mb-2">
            <i className="fa-solid fa-wallet text-sm"></i>
            <h2 className="font-bold text-xs tracking-widest uppercase">{t('dashboard.totalBalance')}</h2>
        </div>
        <p className={`font-black text-[#1A1C2E] transition-all duration-300 ${privacyClass}`} 
           style={{ fontSize: 'clamp(2rem, 10vw, 3.5rem)', lineHeight: '1.1' }}>
          {formatCurrency(stats.totalBalance, { minimumFractionDigits: 2 })}
        </p>
      </div>

      <div className="flex justify-between gap-4">
        <div className="neumorphic flex-1 p-4">
            <div className="flex flex-col items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center shadow-inner">
                    <i className="fa-solid fa-arrow-up text-sm"></i>
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{t('dashboard.income')}</p>
                    <p className={`text-base font-black text-[#1A1C2E] transition-all duration-300 ${privacyClass}`}>{formatCurrency(stats.totalIncome, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</p>
                </div>
            </div>
        </div>
        <div className="neumorphic flex-1 p-4">
            <div className="flex flex-col items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center shadow-inner">
                    <i className="fa-solid fa-arrow-down text-sm"></i>
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{t('dashboard.expense')}</p>
                    <p className={`text-base font-black text-[#1A1C2E] transition-all duration-300 ${privacyClass}`}>{formatCurrency(stats.totalExpense, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;