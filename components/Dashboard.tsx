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
    <div className="space-y-6 mb-10">
      {/* Premium Total Balance Card */}
      <div className="neumorphic p-8 text-center overflow-hidden relative">
        <div className="flex items-center justify-center gap-2.5 text-gray-400 mb-2">
            <i className="fa-solid fa-camera text-[10px] opacity-60"></i>
            <h2 className="font-bold text-[10px] tracking-[0.15em] uppercase opacity-80">{t('dashboard.totalBalance')}</h2>
        </div>
        <p className={`font-black text-[#1A1C2E] tracking-tight transition-all duration-500 ${privacyClass}`} 
           style={{ fontSize: 'clamp(2.5rem, 12vw, 3.8rem)', lineHeight: '1.1' }}>
          {formatCurrency(stats.totalBalance, { minimumFractionDigits: 2 })}
        </p>
      </div>

      <div className="flex justify-between gap-5">
        <div className="neumorphic flex-1 p-5">
            <div className="flex flex-col items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-emerald-100/50 text-emerald-500 flex items-center justify-center shadow-inner">
                    <i className="fa-solid fa-arrow-trend-up text-xs"></i>
                </div>
                <div className="text-center">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{t('dashboard.income')}</p>
                    <p className={`text-sm font-black text-[#1A1C2E] transition-all duration-300 ${privacyClass}`}>{formatCurrency(stats.totalIncome, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</p>
                </div>
            </div>
        </div>
        <div className="neumorphic flex-1 p-5">
            <div className="flex flex-col items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-rose-100/50 text-rose-500 flex items-center justify-center shadow-inner">
                    <i className="fa-solid fa-arrow-trend-down text-xs"></i>
                </div>
                <div className="text-center">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{t('dashboard.expense')}</p>
                    <p className={`text-sm font-black text-[#1A1C2E] transition-all duration-300 ${privacyClass}`}>{formatCurrency(stats.totalExpense, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;