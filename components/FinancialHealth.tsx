import React from 'react';
import { Flame, AlertTriangle, ShieldCheck, Gauge } from 'lucide-react';
import { UserSettings } from '../types';

interface FinancialHealthProps {
  savingsRate: number; // Percentage 0-100
  budgetUsage: number; // Percentage
  settings: UserSettings;
}

const FinancialHealth: React.FC<FinancialHealthProps> = ({ savingsRate, budgetUsage, settings }) => {
  const isDangerZone = budgetUsage > 80;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold text-gray-700 px-2 mb-3">Financial Health</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Streak / Health Score */}
        <div className="p-4 rounded-2xl bg-[#efeeee] shadow-[5px_5px_10px_#d1d1d1,-5px_-5px_10px_#ffffff] flex flex-col items-center text-center">
           <div className="mb-2 p-2 rounded-full bg-[#efeeee] text-orange-500 shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff]">
             <Flame size={20} className={savingsRate > 20 ? 'animate-pulse' : ''} />
           </div>
           <span className="text-xs font-bold text-gray-500 uppercase">Savings Streak</span>
           <span className="text-xl font-black text-gray-700">{savingsRate > 0 ? 'Active' : 'Inactive'}</span>
           <span className="text-[10px] text-gray-400 mt-1">Keep saving > 20%</span>
        </div>

        {/* Debt/Savings Gauge */}
        <div className="p-4 rounded-2xl bg-[#efeeee] shadow-[5px_5px_10px_#d1d1d1,-5px_-5px_10px_#ffffff] flex flex-col items-center text-center">
           <div className="mb-2 p-2 rounded-full bg-[#efeeee] text-blue-500 shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff]">
             <Gauge size={20} />
           </div>
           <span className="text-xs font-bold text-gray-500 uppercase">Health Score</span>
           <span className="text-xl font-black text-gray-700">A+</span>
           <span className="text-[10px] text-gray-400 mt-1">Based on spending</span>
        </div>
      </div>

      {/* Smart Alert Banner */}
      {isDangerZone && (
        <div className="mt-4 p-3 rounded-xl bg-[#efeeee] shadow-[inset_3px_3px_6px_#d1d1d1,inset_-3px_-3px_6px_#ffffff] border-l-4 border-red-500 flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-gray-700">Budget Alert</p>
            <p className="text-[10px] text-gray-500 leading-tight">
              You've used {budgetUsage.toFixed(0)}% of your monthly limit. Consider slowing down on discretionary spending.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialHealth;