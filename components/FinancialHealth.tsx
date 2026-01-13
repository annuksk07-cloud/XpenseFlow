import React from 'react';
import { Stats, Settings } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface FinancialHealthProps {
  stats: Stats;
  settings: Settings;
}

const FinancialHealthCard: React.FC<{ icon: string; title: string; value: string; caption: string; iconBg: string }> = ({ icon, title, value, caption, iconBg }) => (
  <div className="neumorphic p-5 flex flex-col items-center justify-center text-center">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${iconBg}`}>
      <i className={`fa-solid ${icon} text-xl`}></i>
    </div>
    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{title}</p>
    <p className="text-2xl font-black text-[#1A1C2E]">{value}</p>
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{caption}</p>
  </div>
);

const FinancialHealth: React.FC<FinancialHealthProps> = ({ stats, settings }) => {
  const { t } = useLanguage();
  const budgetUsedPercent = settings.budgetLimit > 0 ? (stats.totalExpense / settings.budgetLimit) * 100 : 0;
  
  const savingsProgress = settings.savingsGoal > 0 
    ? Math.min(100, Math.max(0, (stats.totalBalance / settings.savingsGoal) * 100)) 
    : 0;

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: settings.baseCurrency,
      maximumFractionDigits: 0 
    }).format(amount);

  return (
    <div className="mb-8">
       <h3 className="text-lg font-black text-[#1A1C2E] px-2 mb-4 tracking-tight">{t('financialHealth.title')}</h3>
       
       <div className="grid grid-cols-2 gap-6 mb-6">
          <FinancialHealthCard 
            icon="fa-fire"
            title={t('financialHealth.savingsStreak')}
            value="12"
            caption={t('financialHealth.days')}
            iconBg="bg-orange-100/50 text-orange-500"
          />
          <FinancialHealthCard 
            icon="fa-chart-pie"
            title={t('financialHealth.budgetUse')}
            value={`${Math.round(budgetUsedPercent)}%`}
            caption={t('financialHealth.spent')}
            iconBg="bg-purple-100/50 text-purple-500"
          />
       </div>

       {/* Savings Goal Progress Card */}
       <div className="neumorphic p-6 relative overflow-hidden group">
          <div className="flex justify-between items-end mb-4 relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  {t('financialHealth.savingsGoal')}
                </p>
              </div>
              <p className="text-2xl font-black text-[#1A1C2E]">
                {formatCurrency(stats.totalBalance)}
                <span className="text-xs font-bold text-gray-400 ml-2">
                  / {formatCurrency(settings.savingsGoal)}
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-blue-600">{Math.round(savingsProgress)}%</p>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{t('financialHealth.ofGoal')}</p>
            </div>
          </div>

          <div className="relative w-full h-4 neumorphic-inset rounded-full p-1 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_2px_8px_rgba(59,130,246,0.2)]"
              style={{ 
                width: `${savingsProgress}%`,
                background: `linear-gradient(90deg, #00D09C 0%, #3B82F6 70%, #1E3A8A 100%)`,
                backgroundSize: '200% 100%',
                backgroundPosition: 'left'
              }}
            />
          </div>
          
          {/* Subtle Background Accent */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-30 group-hover:scale-110 transition-transform duration-500"></div>
       </div>
    </div>
  );
};

export default FinancialHealth;