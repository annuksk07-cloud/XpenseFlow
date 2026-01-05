import React from 'react';
import { Settings, CURRENCIES, CurrencyCode } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../i18n/translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  onExportCSV: () => void;
  onExportPDF: () => void;
}

const LANGUAGES: { code: Language, name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'fr', name: 'Français' },
];

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, updateSettings, onExportCSV, onExportPDF }) => {
  const { logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/25 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-[#F0F2F5] rounded-t-3xl sm:rounded-3xl p-6 shadow-lg animate-slide-in-bottom" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-[#1A1C2E]">{t('modals.settingsTitle')}</h3>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center neumorphic-flat active:neumorphic-pressed !rounded-full transition-all text-gray-500"><i className="fa-solid fa-xmark"></i></button>
        </div>
        <div className="space-y-6">
          <div>
            <label className="font-bold text-sm text-gray-600 mb-2 block"><i className="fa-solid fa-language mr-2"></i>{t('modals.language')}</label>
            <div className="flex gap-2 overflow-x-auto pb-2">{LANGUAGES.map(lang => (
              <button key={lang.code} onClick={() => setLanguage(lang.code)} className={`px-4 py-3 rounded-lg font-bold text-xs transition-all ${language === lang.code ? 'neumorphic-pressed !rounded-lg text-blue-600' : 'neumorphic-flat !rounded-lg text-gray-700'}`}>
                {lang.name}
              </button>
            ))}</div>
          </div>

          <div>
            <label className="font-bold text-sm text-gray-600 mb-2 block"><i className="fa-solid fa-globe mr-2"></i>{t('modals.baseCurrency')}</label>
            <div className="flex gap-2 overflow-x-auto pb-2">{Object.keys(CURRENCIES).map(code => (
               <button key={code} onClick={() => updateSettings({ baseCurrency: code as CurrencyCode })} className={`px-4 py-3 rounded-lg font-bold text-xs transition-all ${settings.baseCurrency === code ? 'neumorphic-pressed !rounded-lg text-blue-600' : 'neumorphic-flat !rounded-lg text-gray-700'}`}>
                {code}
              </button>
            ))}</div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl neumorphic-inset">
             <div><p className="font-bold text-sm text-[#2D3748]">{t('modals.stealthMode')}</p><p className="text-xs text-gray-500">{t('modals.stealthModeDesc')}</p></div>
             <button onClick={() => updateSettings({ isPrivacyMode: !settings.isPrivacyMode })} className={`w-12 h-6 rounded-full relative transition-colors ${settings.isPrivacyMode ? 'bg-blue-600' : 'neumorphic-pressed !rounded-full'}`}><div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${settings.isPrivacyMode ? 'left-7' : 'left-1'}`}></div></button>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('modals.dataBackup')}</h4>
            <button onClick={onExportCSV} className="w-full text-left p-4 rounded-xl neumorphic-flat !rounded-xl active:neumorphic-pressed transition-all text-[#2D3748] font-semibold"><i className="fa-solid fa-file-csv mr-3 text-emerald-600"></i>{t('modals.exportCSV')}</button>
            <button onClick={onExportPDF} className="w-full text-left p-4 rounded-xl neumorphic-flat !rounded-xl active:neumorphic-pressed transition-all text-[#2D3748] font-semibold"><i className="fa-solid fa-file-pdf mr-3 text-rose-600"></i>{t('modals.exportPDF')}</button>
          </div>

           <div className="border-t border-gray-300/50 pt-5">
             <button onClick={logout} className="w-full text-left p-4 rounded-xl neumorphic-flat !rounded-xl active:neumorphic-pressed transition-all text-rose-600 font-bold"><i className="fa-solid fa-right-from-bracket mr-3"></i>{t('modals.signOut')}</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;