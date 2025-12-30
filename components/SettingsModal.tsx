import React from 'react';
import { X, Lock, Globe, Download, FileText, Database } from 'lucide-react';
import { UserSettings, CURRENCIES, CurrencyCode } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdate: (s: Partial<UserSettings>) => void;
  onExportCSV: () => void;
  onBackup: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onUpdate, onExportCSV, onBackup }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#efeeee] rounded-t-3xl sm:rounded-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom duration-300">
        
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-gray-700">App Settings</h3>
          <button 
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-[#efeeee] shadow-[3px_3px_6px_#c5c5c5,-3px_-3px_6px_#ffffff] text-gray-500 active:shadow-[inset_2px_2px_4px_#c5c5c5,inset_-2px_-2px_4px_#ffffff]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-6">
          
          {/* Base Currency */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-gray-600">
              <Globe size={18} />
              <span className="font-bold text-sm">Base Currency</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {Object.keys(CURRENCIES).map((code) => (
                <button
                  key={code}
                  onClick={() => onUpdate({ baseCurrency: code })}
                  className={`px-4 py-3 rounded-lg font-bold text-xs transition-all ${
                    settings.baseCurrency === code
                      ? 'bg-[#efeeee] text-blue-500 shadow-[inset_3px_3px_6px_#d1d1d1,inset_-3px_-3px_6px_#ffffff]'
                      : 'text-gray-500 shadow-[3px_3px_6px_#d1d1d1,-3px_-3px_6px_#ffffff]'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Toggle (Stealth Mode) */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#efeeee] shadow-[5px_5px_10px_#d1d1d1,-5px_-5px_10px_#ffffff]">
             <div className="flex items-center gap-3">
               <div className="p-2 rounded-full bg-[#efeeee] text-purple-500 shadow-[inset_2px_2px_4px_#c5c5c5,inset_-2px_-2px_4px_#ffffff]">
                 <Lock size={18} />
               </div>
               <div>
                 <p className="font-bold text-sm text-gray-700">Stealth Mode</p>
                 <p className="text-[10px] text-gray-400">Blur sensitive numbers</p>
               </div>
             </div>
             <button 
               onClick={() => onUpdate({ isPrivacyMode: !settings.isPrivacyMode })}
               className={`w-12 h-6 rounded-full transition-colors relative ${settings.isPrivacyMode ? 'bg-blue-500' : 'bg-gray-300'}`}
             >
               <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${settings.isPrivacyMode ? 'left-7' : 'left-1'}`} />
             </button>
          </div>

          {/* Data Management */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Data & Backup</h4>
            
            <button 
              onClick={onExportCSV}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-[#efeeee] shadow-[3px_3px_6px_#d1d1d1,-3px_-3px_6px_#ffffff] active:shadow-[inset_3px_3px_6px_#d1d1d1,inset_-3px_-3px_6px_#ffffff] text-gray-600 group"
            >
               <div className="flex items-center gap-3">
                 <FileText size={18} className="text-green-600" />
                 <span className="font-bold text-sm">Export CSV Report</span>
               </div>
               <Download size={16} className="opacity-50 group-hover:opacity-100 transition-opacity" />
            </button>

            <button 
              onClick={onBackup}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-[#efeeee] shadow-[3px_3px_6px_#d1d1d1,-3px_-3px_6px_#ffffff] active:shadow-[inset_3px_3px_6px_#d1d1d1,inset_-3px_-3px_6px_#ffffff] text-gray-600 group"
            >
               <div className="flex items-center gap-3">
                 <Database size={18} className="text-blue-600" />
                 <span className="font-bold text-sm">Backup JSON Data</span>
               </div>
               <Download size={16} className="opacity-50 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsModal;