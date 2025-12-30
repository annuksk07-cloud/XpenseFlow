import React, { useState } from 'react';
import { UserSettings } from '../types';
import { Edit2, Target, PiggyBank } from 'lucide-react';

interface BudgetGoalsProps {
  settings: UserSettings;
  totalExpense: number;
  totalSavings: number; // Derived from Income - Expense
  onUpdate: (settings: Partial<UserSettings>) => void;
}

const BudgetGoals: React.FC<BudgetGoalsProps> = ({ settings, totalExpense, totalSavings, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempBudget, setTempBudget] = useState(settings.budgetLimit.toString());
  const [tempGoal, setTempGoal] = useState(settings.savingsGoal.toString());

  const budgetProgress = Math.min((totalExpense / settings.budgetLimit) * 100, 100);
  const goalProgress = Math.min((totalSavings / settings.savingsGoal) * 100, 100);

  // Color logic for budget: Green -> Yellow -> Red
  const getBudgetColor = () => {
    if (budgetProgress < 50) return 'bg-green-500';
    if (budgetProgress < 85) return 'bg-yellow-400';
    return 'bg-red-500';
  };

  const handleSave = () => {
    onUpdate({
      budgetLimit: parseFloat(tempBudget) || 0,
      savingsGoal: parseFloat(tempGoal) || 0
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg font-bold text-gray-700">Goals & Limits</h3>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="p-3 rounded-full bg-[#efeeee] shadow-[3px_3px_6px_#c5c5c5,-3px_-3px_6px_#ffffff] text-blue-500 active:shadow-[inset_2px_2px_4px_#c5c5c5,inset_-2px_-2px_4px_#ffffff] transition-all"
        >
          {isEditing ? <span className="text-xs font-bold px-2">Save</span> : <Edit2 size={16} />}
        </button>
      </div>

      {/* Monthly Budget */}
      <div className="p-5 rounded-2xl bg-[#efeeee] shadow-[5px_5px_10px_#d1d1d1,-5px_-5px_10px_#ffffff]">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2 text-gray-600">
            <Target size={18} />
            <span className="font-bold text-sm">Monthly Budget</span>
          </div>
          {isEditing ? (
            <input 
              type="number" 
              value={tempBudget}
              onChange={(e) => setTempBudget(e.target.value)}
              className="w-20 px-2 py-1 text-right bg-[#efeeee] shadow-[inset_2px_2px_4px_#d1d1d1,inset_-2px_-2px_4px_#ffffff] rounded text-sm outline-none focus:text-blue-600"
            />
          ) : (
            <span className="text-sm font-bold text-gray-500">${settings.budgetLimit}</span>
          )}
        </div>
        
        <div className="h-3 w-full bg-[#efeeee] rounded-full shadow-[inset_2px_2px_4px_#d1d1d1,inset_-2px_-2px_4px_#ffffff] overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[2px_0_5px_rgba(0,0,0,0.1)] ${getBudgetColor()}`}
            style={{ width: `${budgetProgress}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-400 font-medium">
          <span>${totalExpense.toFixed(0)} spent</span>
          <span>{budgetProgress.toFixed(0)}%</span>
        </div>
      </div>

      {/* Savings Goal */}
      <div className="p-5 rounded-2xl bg-[#efeeee] shadow-[5px_5px_10px_#d1d1d1,-5px_-5px_10px_#ffffff]">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2 text-gray-600">
            <PiggyBank size={18} />
            <span className="font-bold text-sm">Savings Goal</span>
          </div>
          {isEditing ? (
            <input 
              type="number" 
              value={tempGoal}
              onChange={(e) => setTempGoal(e.target.value)}
              className="w-20 px-2 py-1 text-right bg-[#efeeee] shadow-[inset_2px_2px_4px_#d1d1d1,inset_-2px_-2px_4px_#ffffff] rounded text-sm outline-none focus:text-blue-600"
            />
          ) : (
             <span className="text-sm font-bold text-gray-500">${settings.savingsGoal}</span>
          )}
        </div>
        
        <div className="h-3 w-full bg-[#efeeee] rounded-full shadow-[inset_2px_2px_4px_#d1d1d1,inset_-2px_-2px_4px_#ffffff] overflow-hidden">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out shadow-[2px_0_5px_rgba(0,0,0,0.1)]"
            style={{ width: `${goalProgress}%` }}
          />
        </div>
         <div className="mt-2 flex justify-between text-xs text-gray-400 font-medium">
          <span>${totalSavings > 0 ? totalSavings.toFixed(0) : 0} saved</span>
          <span>{goalProgress.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
};

export default BudgetGoals;