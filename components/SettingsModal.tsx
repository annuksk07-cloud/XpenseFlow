import React from 'react';
import { Settings, CURRENCIES, CurrencyCode } from '../types';
import { useAuth } from '../AuthContext';
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
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="w-full max-w-md bg-[#F0F2F5] rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-[#1A1C2E]">{t('modals.settingsTitle')}</h3>
          <button onClick={onClose} className="w-11 h-11 flex items-center justify-center neumorphic-flat active:neumorphic-pressed !rounded-full transition-all text-gray-500"><i className="fa-solid fa-xmark"></i></button>
        </div>

        <div className="space-y-8">
          <section>
            <label className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4 block">{t('modals.language')}</label>
            <div className="grid grid-cols-2 gap-3">
              {LANGUAGES.map(lang => (
                <button key={lang.code} onClick={() => setLanguage(lang.code)} className={`px-4 py-3 rounded-2xl font-bold text-sm transition-all ${language === lang.code ? 'neumorphic-pressed !rounded-2xl text-blue-600' : 'neumorphic-flat !rounded-2xl text-gray-700'}`}>
                  {lang.name}
                </button>
              ))}
            </div>
          </section>

          <section>
            <label className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4 block">{t('modals.baseCurrency')}</label>
            <div className="grid grid-cols-3 gap-3">
              {Object.keys(CURRENCIES).map(code => (
                 <button key={code} onClick={() => updateSettings({ baseCurrency: code as CurrencyCode })} className={`px-3 py-3 rounded-2xl font-bold text-sm transition-all ${settings.baseCurrency === code ? 'neumorphic-pressed !rounded-2xl text-blue-600' : 'neumorphic-flat !rounded-2xl text-gray-700'}`}>
                  {code}
                </button>
              ))}
            </div>
          </section>

          <section className="flex items-center justify-between p-5 rounded-3xl neumorphic-inset">
             <div><p className="font-bold text-sm text-[#1A1C2E]">{t('modals.stealthMode')}</p><p className="text-[10px] text-gray-500">{t('modals.stealthModeDesc')}</p></div>
             <button onClick={() => updateSettings({ isPrivacyMode: !settings.isPrivacyMode })} className={`w-14 h-7 rounded-full relative transition-colors ${settings.isPrivacyMode ? 'bg-blue-600' : 'neumorphic-pressed !rounded-full'}`}><div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${settings.isPrivacyMode ? 'left-8' : 'left-1'}`}></div></button>
          </section>

          <section className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{t('modals.dataBackup')}</h4>
            <div className="grid grid-cols-1 gap-3">
              <button onClick={onExportCSV} className="w-full flex items-center p-5 rounded-3xl neumorphic-flat !rounded-3xl active:neumorphic-pressed transition-all text-[#1A1C2E] font-bold text-sm"><i className="fa-solid fa-file-csv mr-4 text-emerald-600 text-lg"></i>{t('modals.exportCSV')}</button>
              <button onClick={onExportPDF} className="w-full flex items-center p-5 rounded-3xl neumorphic-flat !rounded-3xl active:neumorphic-pressed transition-all text-[#1A1C2E] font-bold text-sm"><i className="fa-solid fa-file-pdf mr-4 text-rose-600 text-lg"></i>{t('modals.exportPDF')}</button>
            </div>
          </section>

           <div className="pt-6 pb-8">
             <button onClick={logout} className="w-full flex items-center justify-center p-5 rounded-3xl neumorphic-flat !rounded-3xl active:neumorphic-pressed transition-all text-rose-600 font-black text-sm"><i className="fa-solid fa-right-from-bracket mr-3"></i>{t('modals.signOut')}</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;