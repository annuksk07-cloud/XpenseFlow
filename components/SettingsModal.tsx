import React from 'react';
import { Settings, CURRENCIES, CurrencyCode } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  onExport: () => void;
  onBackup: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, updateSettings, onExport, onBackup }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-[#efeeee] rounded-t-3xl sm:rounded-3xl p-6 shadow-lg animate-in slide-in-from-bottom" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-gray-700">App Settings</h3>
          <button onClick={onClose} className="w-11 h-11 flex items-center justify-center rounded-full bg-[#efeeee] shadow-[3px_3px_6px_#c5c5c5,-3px_-3px_6px_#ffffff] text-gray-500"><i className="fa-solid fa-xmark"></i></button>
        </div>
        <div className="space-y-6">
          <div>
            <label className="font-bold text-sm text-gray-600 mb-2 block"><i className="fa-solid fa-globe mr-2"></i>Base Currency</label>
            <div className="flex gap-2 overflow-x-auto pb-2">{Object.keys(CURRENCIES).map(code => (
              <button key={code} onClick={() => updateSettings({ baseCurrency: code as CurrencyCode })} className={`px-4 py-3 rounded-lg font-bold text-xs transition-all ${settings.baseCurrency === code ? 'bg-[#efeeee] text-blue-500 shadow-[inset_3px_3px_6px_#d1d1d1,inset_-3px_-3px_6px_#ffffff]' : 'text-gray-500 shadow-[3px_3px_6px_#d1d1d1,-3px_-3px_6px_#ffffff]'}`}>
                {code}
              </button>
            ))}</div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#efeeee] shadow-[5px_5px_10px_#d1d1d1,-5px_-5px_10px_#ffffff]">
             <div><p className="font-bold text-sm text-gray-700">Stealth Mode</p><p className="text-[10px] text-gray-400">Blur sensitive numbers</p></div>
             <button onClick={() => updateSettings({ isPrivacyMode: !settings.isPrivacyMode })} className={`w-12 h-6 rounded-full relative transition-colors ${settings.isPrivacyMode ? 'bg-blue-500' : 'bg-gray-300'}`}><div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${settings.isPrivacyMode ? 'left-7' : 'left-1'}`}></div></button>
          </div>
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Data & Backup</h4>
            <button onClick={onExport} className="w-full text-left p-4 rounded-xl bg-[#efeeee] shadow-[3px_3px_6px_#d1d1d1,-3px_-3px_6px_#ffffff] text-gray-600 font-semibold"><i className="fa-solid fa-file-csv mr-3"></i>Export to CSV</button>
            <button onClick={onBackup} className="w-full text-left p-4 rounded-xl bg-[#efeeee] shadow-[3px_3px_6px_#d1d1d1,-3px_-3px_6px_#ffffff] text-gray-600 font-semibold"><i className="fa-solid fa-database mr-3"></i>Backup JSON</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;