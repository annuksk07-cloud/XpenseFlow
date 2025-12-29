import React from 'react';
import { TrendingUp, Calendar, AlertTriangle, Receipt } from 'lucide-react';
import { DashboardStats, UserSettings } from '../types';

interface ForecastingWidgetProps {
  stats: DashboardStats;
  settings: UserSettings;
}

const ForecastingWidget: React.FC<ForecastingWidgetProps> = ({ stats, settings }) => {
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: settings.baseCurrency,
    maximumFractionDigits: 0
  });

  const isOverBudget = stats.projectedSpend > settings.budgetLimit;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-700 px-2 mb-3">AI Insights</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Burn Rate & Projection */}
        <div className="p-5 rounded-2xl bg-[#efeeee] shadow-[5px_5px_10px_#d1d1d1,-5px_-5px_10px_#ffffff] relative overflow-hidden">
           <div className="absolute top-0 right-0 p-3 opacity-5">
             <TrendingUp size={80} />
           </div>
           
           <div className="flex items-center gap-2 mb-2 text-blue-500">
             <Calendar size={18} />
             <span className="text-xs font-bold uppercase tracking-wider">End of Month Projection</span>
           </div>
           
           <div className={`text-2xl font-black transition-all ${settings.isPrivacyMode ? 'blur-sm' : 'text-gray-700'}`}>
             {currencyFormatter.format(stats.projectedSpend)}
           </div>
           
           <div className="mt-3 flex items-center gap-2 text-xs font-medium text-gray-400">
             <span>Daily Burn: <span className={settings.isPrivacyMode ? 'blur-xs' : 'text-gray-600'}>{currencyFormatter.format(stats.burnRate)}</span>/day</span>
           </div>

           {isOverBudget && (
             <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md w-fit">
               <AlertTriangle size={12} />
               <span>On track to exceed budget</span>
             </div>
           )}
        </div>

        {/* Tax Estimator */}
        <div className="p-5 rounded-2xl bg-[#efeeee] shadow-[5px_5px_10px_#d1d1d1,-5px_-5px_10px_#ffffff]">
           <div className="flex items-center gap-2 mb-2 text-purple-500">
             <Receipt size={18} />
             <span className="text-xs font-bold uppercase tracking-wider">Est. Tax Paid</span>
           </div>
           
           <div className={`text-2xl font-black transition-all ${settings.isPrivacyMode ? 'blur-sm' : 'text-gray-700'}`}>
             {currencyFormatter.format(stats.totalTax)}
           </div>
           
           <p className="mt-2 text-[10px] text-gray-400 leading-tight">
             Total declared VAT/Tax for this fiscal period based on flagged expenses.
           </p>
        </div>
      </div>
    </div>
  );
};

export default ForecastingWidget;