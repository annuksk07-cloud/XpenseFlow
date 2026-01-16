import React, { useState } from 'react';
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

const SectionHeader: React.FC<{ icon: string; title: string }> = ({ icon, title }) => (
  <div className="flex items-center gap-3 mb-4 px-1">
    <div className="w-8 h-8 rounded-xl neumorphic-flat flex items-center justify-center text-blue-600">
      <i className={`fa-solid ${icon} text-xs`}></i>
    </div>
    <label className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 block">{title}</label>
  </div>
);

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, updateSettings, onExportCSV, onExportPDF }) => {
  const { logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [showRates, setShowRates] = useState(false);
  
  if (!isOpen) return null;

  const currentCurrencySymbol = CURRENCIES[settings.baseCurrency].symbol;

  const handleRateChange = (code: CurrencyCode, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    const newCustomRates = { ...settings.customRates, [code]: numValue };
    updateSettings({ customRates: newCustomRates });
  };

  const resetRates = () => {
    updateSettings({ customRates: {} });
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-0 sm:px-4" onClick={onClose}>
      <div className="w-full max-w-md bg-[#F0F2F5] rounded-t-[45px] sm:rounded-[45px] p-6 pt-8 pb-10 shadow-2xl animate-in slide-in-from-bottom duration-500 max-h-[92vh] overflow-y-auto custom-scrollbar" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-10 px-2">
          <div>
            <h3 className="text-2xl font-black text-[#1A1C2E] leading-tight">{t('modals.settingsTitle')}</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Configure your experience</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 flex items-center justify-center neumorphic-flat active:neumorphic-pressed !rounded-full transition-all text-gray-500 border border-white/50">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div className="space-y-12">
          
          {/* Group 1: Preferences */}
          <section>
            <SectionHeader icon="fa-language" title={t('modals.language')} />
            <div className="grid grid-cols-2 gap-4">
              {LANGUAGES.map(lang => (
                <button 
                  key={lang.code} 
                  onClick={() => setLanguage(lang.code)} 
                  className={`px-4 py-4 rounded-2xl font-black text-xs transition-all ${language === lang.code ? 'neumorphic-pressed !rounded-2xl text-blue-600' : 'neumorphic-flat !rounded-2xl text-gray-700'}`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </section>

          {/* Group 2: Currency & Rates */}
          <section>
            <SectionHeader icon="fa-coins" title={t('modals.baseCurrency')} />
            <div className="grid grid-cols-3 gap-3 mb-6">
              {Object.keys(CURRENCIES).map(code => (
                 <button 
                    key={code} 
                    onClick={() => updateSettings({ baseCurrency: code as CurrencyCode })} 
                    className={`px-2 py-4 rounded-2xl font-black text-[11px] transition-all ${settings.baseCurrency === code ? 'neumorphic-pressed !rounded-2xl text-blue-600' : 'neumorphic-flat !rounded-2xl text-gray-700'}`}
                 >
                  {code}
                </button>
              ))}
            </div>

            <div className="neumorphic-inset p-5 rounded-3xl">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider">{t('modals.exchangeRates')}</p>
                <button onClick={() => setShowRates(!showRates)} className="text-[9px] font-black text-blue-600 uppercase tracking-widest px-4 py-1.5 neumorphic-flat !rounded-full active:neumorphic-pressed transition-all">
                  {showRates ? t('modals.hide') : t('modals.show')}
                </button>
              </div>
              
              {showRates && (
                <div className="space-y-4 pt-2 animate-in fade-in duration-300">
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight mb-4">Base: 1 USD (Customized)</p>
                  <div className="space-y-3">
                    {(Object.keys(CURRENCIES) as CurrencyCode[]).map(code => {
                      if (code === 'USD') return null;
                      const currentRate = settings.customRates?.[code] ?? CURRENCIES[code].rate;
                      return (
                        <div key={code} className="flex items-center gap-4 p-3 bg-white/40 rounded-2xl border border-white/60">
                          <div className="w-10 h-10 rounded-xl neumorphic-flat flex items-center justify-center font-black text-blue-600 text-sm">{CURRENCIES[code].symbol}</div>
                          <div className="flex-1">
                             <input 
                                type="number" step="0.01" value={currentRate} 
                                onChange={(e) => handleRateChange(code, e.target.value)}
                                className="w-full bg-transparent outline-none text-[#1A1C2E] font-black text-sm" 
                             />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={resetRates} className="w-full py-3 text-[9px] font-black text-rose-500 uppercase tracking-[0.15em] neumorphic-flat !rounded-2xl mt-4">
                    {t('modals.resetRates')}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Group 3: Targets */}
          <section>
            <SectionHeader icon="fa-bullseye" title={t('modals.financialTargets')} />
            <div className="grid grid-cols-1 gap-5">
              <div className="neumorphic-inset p-5 rounded-3xl relative">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-3">{t('modals.budgetLimitLabel')}</span>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl neumorphic-flat flex items-center justify-center font-black text-blue-600 text-xl">{currentCurrencySymbol}</div>
                  <input 
                    type="number" 
                    value={settings.budgetLimit} 
                    onChange={(e) => updateSettings({ budgetLimit: Number(e.target.value) })}
                    className="flex-1 bg-transparent outline-none text-[#1A1C2E] font-black text-xl" 
                  />
                </div>
              </div>

              <div className="neumorphic-inset p-5 rounded-3xl relative">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-3">{t('modals.savingsGoalLabel')}</span>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl neumorphic-flat flex items-center justify-center font-black text-emerald-600 text-xl">{currentCurrencySymbol}</div>
                  <input 
                    type="number" 
                    value={settings.savingsGoal} 
                    onChange={(e) => updateSettings({ savingsGoal: Number(e.target.value) })}
                    className="flex-1 bg-transparent outline-none text-[#1A1C2E] font-black text-xl" 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Group 4: Privacy & Display */}
          <section>
            <SectionHeader icon="fa-shield-halved" title="Visibility & Privacy" />
            <div className="space-y-4">
              <div className="flex items-center justify-between p-6 rounded-[32px] neumorphic-flat">
                 <div className="pr-4">
                    <p className="font-black text-sm text-[#1A1C2E]">{t('modals.stealthMode')}</p>
                    <p className="text-[10px] text-gray-400 font-bold mt-1 leading-relaxed">{t('modals.stealthModeDesc')}</p>
                 </div>
                 <button onClick={() => updateSettings({ isPrivacyMode: !settings.isPrivacyMode })} className={`w-14 h-8 rounded-full relative transition-all duration-300 shrink-0 ${settings.isPrivacyMode ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'neumorphic-pressed'}`}>
                    <div className={`absolute top-1.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${settings.isPrivacyMode ? 'left-7.5' : 'left-1.5'}`}></div>
                 </button>
              </div>

              <div className="flex items-center justify-between p-6 rounded-[32px] neumorphic-flat">
                 <div className="pr-4">
                    <p className="font-black text-sm text-[#1A1C2E]">{t('modals.showOriginalCurrency')}</p>
                    <p className="text-[10px] text-gray-400 font-bold mt-1 leading-relaxed">{t('modals.showOriginalCurrencyDesc')}</p>
                 </div>
                 <button onClick={() => updateSettings({ showOriginalCurrency: !settings.showOriginalCurrency })} className={`w-14 h-8 rounded-full relative transition-all duration-300 shrink-0 ${settings.showOriginalCurrency ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'neumorphic-pressed'}`}>
                    <div className={`absolute top-1.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${settings.showOriginalCurrency ? 'left-7.5' : 'left-1.5'}`}></div>
                 </button>
              </div>
            </div>
          </section>

          {/* Group 5: Data & Actions */}
          <section>
            <SectionHeader icon="fa-database" title={t('modals.dataBackup')} />
            <div className="grid grid-cols-2 gap-4">
              <button onClick={onExportCSV} className="flex flex-col items-center justify-center gap-3 p-6 rounded-[32px] neumorphic-flat active:neumorphic-pressed transition-all">
                <i className="fa-solid fa-file-csv text-emerald-500 text-xl"></i>
                <span className="text-[10px] font-black uppercase text-[#1A1C2E] tracking-tighter">CSV</span>
              </button>
              <button onClick={onExportPDF} className="flex flex-col items-center justify-center gap-3 p-6 rounded-[32px] neumorphic-flat active:neumorphic-pressed transition-all">
                <i className="fa-solid fa-file-pdf text-rose-500 text-xl"></i>
                <span className="text-[10px] font-black uppercase text-[#1A1C2E] tracking-tighter">PDF</span>
              </button>
            </div>
          </section>

          {/* Group 6: Logout */}
          <div className="pt-6">
             <button onClick={logout} className="w-full flex items-center justify-center p-6 rounded-[32px] neumorphic-flat !rounded-[32px] active:neumorphic-pressed transition-all text-rose-600 font-black text-sm gap-3 border border-rose-100">
               <i className="fa-solid fa-right-from-bracket"></i>
               {t('modals.signOut')}
             </button>
             <p className="text-center text-[9px] font-bold text-gray-300 uppercase tracking-[0.3em] mt-8">XpenseFlow v2.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;