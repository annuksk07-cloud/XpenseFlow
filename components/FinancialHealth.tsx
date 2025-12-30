import React, { useState, useEffect } from 'react';
import { Stats, Settings } from '../types';

interface FinancialHealthProps {
  stats: Stats;
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const FinancialHealth: React.FC<FinancialHealthProps> = ({ stats, settings, updateSettings }) => {
  const savingsRate = stats.totalIncome > 0 ? ((stats.totalIncome - stats.totalExpense) / stats.totalIncome) * 100 : 0;
  const budgetUsage = settings.budgetLimit > 0 ? (stats.totalExpense / settings.budgetLimit) * 100 : 0;
  const isDangerZone = budgetUsage > 80;

  const [isSmartAlertVisible, setIsSmartAlertVisible] = useState(true);

  useEffect(() => {
    // If spending goes above the danger zone threshold, ensure the alert is visible
    if (isDangerZone) {
      setIsSmartAlertVisible(true);
    }
  }, [isDangerZone]);

  const goalProgress = settings.savingsGoal > 0 ? (stats.totalBalance / settings.savingsGoal) * 100 : 0;
  const clampedProgress = Math.max(0, Math.min(100, goalProgress));
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: settings.baseCurrency }).format(amount);

  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalAmount, setGoalAmount] = useState(settings.savingsGoal.toString());

  useEffect(() => {
    setGoalAmount(settings.savingsGoal.toString());
  }, [settings.savingsGoal]);

  const handleGoalSave = () => {
    const newGoal = parseFloat(goalAmount);
    if (!isNaN(newGoal) && newGoal >= 0) {
      updateSettings({ savingsGoal: newGoal });
    } else {
      setGoalAmount(settings.savingsGoal.toString());
    }
    setIsEditingGoal(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGoalSave();
    } else if (e.key === 'Escape') {
      setGoalAmount(settings.savingsGoal.toString());
      setIsEditingGoal(false);
    }
  };

  const getProgressBarColor = () => {
    if (clampedProgress < 40) return 'bg-orange-500';
    if (clampedProgress < 80) return 'bg-blue-500';
    return 'bg-green-500';
  };
  
  const getIconColor = () => {
    if (clampedProgress < 40) return 'text-orange-500';
    if (clampedProgress < 80) return 'text-blue-500';
    return 'text-green-500';
  };

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

      <div className="mt-4 p-4 rounded-2xl bg-[#efeeee] shadow-[5px_5px_10px_#d1d1d1,-5px_-5px_10px_#ffffff]">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <i className={`fa-solid fa-trophy ${getIconColor()}`}></i>
            <span className="text-xs font-bold text-gray-500 uppercase">Savings Goal</span>
          </div>
          <span className="text-xs font-bold text-gray-600">{clampedProgress.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-[#d1d1d1] rounded-full h-2 shadow-[inset_2px_2px_4px_#bebebe,inset_-2px_-2px_4px_#ffffff]">
          <div
            className={`${getProgressBarColor()} h-2 rounded-full transition-all duration-500`}
            style={{ width: `${clampedProgress}%` }}
          ></div>
        </div>
        <div className="text-right text-[10px] text-gray-400 mt-1 flex justify-end items-center gap-1">
          <span>{formatCurrency(stats.totalBalance > 0 ? stats.totalBalance : 0)} / </span>
          {isEditingGoal ? (
            <input
              type="number"
              value={goalAmount}
              onChange={(e) => setGoalAmount(e.target.value)}
              onBlur={handleGoalSave}
              onKeyDown={handleKeyDown}
              className="w-24 bg-transparent text-right font-bold text-gray-500 outline-none p-0 border-b border-dashed border-gray-400"
              autoFocus
            />
          ) : (
            <button onClick={() => setIsEditingGoal(true)} className="flex items-center gap-1.5 group">
              <span>{formatCurrency(settings.savingsGoal)}</span>
              <i className="fa-solid fa-pencil text-gray-400 text-[8px] opacity-0 group-hover:opacity-100 transition-opacity"></i>
            </button>
          )}
        </div>
      </div>

      {isDangerZone && isSmartAlertVisible && (
        <div className="mt-4 p-3 pr-8 rounded-xl bg-[#efeeee] shadow-[inset_3px_3px_6px_#d1d1d1,inset_-3px_-3px_6px_#ffffff] border-l-4 border-red-500 flex items-start gap-3 relative animate-in fade-in">
          <i className="fa-solid fa-triangle-exclamation text-red-500 shrink-0 mt-0.5"></i>
          <div>
            <p className="text-xs font-bold text-gray-700">Smart Alert</p>
            <p className="text-[10px] text-gray-500 leading-tight">You've used {budgetUsage.toFixed(0)}% of your monthly budget limit.</p>
          </div>
           <button onClick={() => setIsSmartAlertVisible(false)} className="absolute top-1 right-1 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 transition-colors" aria-label="Dismiss alert">
                <i className="fa-solid fa-xmark fa-sm"></i>
            </button>
        </div>
      )}
    </div>
  );
};

export default FinancialHealth;