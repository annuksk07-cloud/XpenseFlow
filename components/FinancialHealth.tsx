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
    <p className="text-xs font-bold text-gray-500 uppercase">{title}</p>
    <p className="text-2xl font-bold text-[#1A1C2E]">{value}</p>
    <p className="text-sm text-gray-400">{caption}</p>
  </div>
);

const FinancialHealth: React.FC<FinancialHealthProps> = ({ stats, settings }) => {
  const { t } = useLanguage();
  const budgetUsedPercent = settings.budgetLimit > 0 ? (stats.totalExpense / settings.budgetLimit) * 100 : 0;
  
  return (
    <div className="mb-8">
       <h3 className="text-lg font-bold text-[#1A1C2E] px-2 mb-4">{t('financialHealth.title')}</h3>
       <div className="grid grid-cols-2 gap-6">
          <FinancialHealthCard 
            icon="fa-fire"
            title={t('financialHealth.savingsStreak')}
            value="12"
            caption={t('financialHealth.days')}
            iconBg="bg-orange-100 text-orange-500"
          />
          <FinancialHealthCard 
            icon="fa-chart-pie"
            title={t('financialHealth.budgetUse')}
            value={`${Math.round(budgetUsedPercent)}%`}
            caption={t('financialHealth.spent')}
            iconBg="bg-purple-100 text-purple-500"
          />
       </div>
    </div>
  );
};

export default FinancialHealth;
