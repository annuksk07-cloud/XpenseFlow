import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface BottomNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSettingsClick: () => void;
  onAddClick: () => void;
}

const NavItem: React.FC<{ icon: string; label: string; isActive: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center justify-center w-full h-full transition-all active:scale-90 focus:outline-none relative z-10">
    <div className={`w-11 h-10 flex items-center justify-center rounded-2xl transition-all duration-300 ${isActive ? 'neumorphic-pressed bg-white/60' : ''}`}>
        <i className={`fa-solid ${icon} text-lg transition-colors duration-300 ${isActive ? 'text-[#1E40AF]' : 'text-[#1A1C2E] opacity-50'}`}></i>
    </div>
    <span className={`text-[9px] mt-1.5 font-bold transition-colors uppercase tracking-tight ${isActive ? 'text-[#1E40AF]' : 'text-gray-400'}`}>{label}</span>
  </button>
);

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, setActiveTab, onSettingsClick, onAddClick }) => {
  const { t } = useLanguage();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-0 pb-0 pointer-events-none">
      <div className="max-w-md mx-auto relative pointer-events-auto">
        
        {/* CENTERED BIG ACTION BUTTON (Perfectly Aligned to Notch) */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-10 z-50">
          <button
            onClick={onAddClick}
            className="w-20 h-20 rounded-full bg-[#1E40AF] text-white flex items-center justify-center shadow-[0_15px_35px_rgba(30,64,175,0.45)] border-[7px] border-[#F0F2F5] active:scale-95 transition-all group relative overflow-hidden"
            style={{ width: '80px', height: '80px' }}
            aria-label={t('fab.addTransaction')}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 to-white/10 pointer-events-none"></div>
            <i className="fa-solid fa-plus text-3xl group-active:rotate-90 transition-transform duration-300 relative z-10"></i>
          </button>
        </div>

        {/* CUSTOM NOTCHED NAVIGATION DOCK SVG */}
        <div className="relative w-full h-[95px] flex items-end">
          <svg 
            width="100%" 
            height="95" 
            viewBox="0 0 375 95" 
            preserveAspectRatio="none" 
            className="absolute bottom-0 left-0 filter drop-shadow-[0_-12px_24px_rgba(0,0,0,0.06)]"
          >
            <path 
              d="M0 25C0 11.1929 11.1929 0 25 0H115C125 0 132 2 138 8C148 18 152 52 187.5 52C223 52 227 18 237 8C243 2 250 0 260 0H350C363.807 0 375 11.1929 375 25V95H0V25Z" 
              fill="#F0F2F5" 
            />
          </svg>
          
          <nav className="grid grid-cols-5 w-full h-full px-2 relative z-10 pb-[env(safe-area-inset-bottom)] pt-3">
            <NavItem icon="fa-house" label={t('nav.home')} isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <NavItem icon="fa-chart-pie" label={t('nav.analytics')} isActive={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
            
            {/* Centered "New" Label beneath the FAB */}
            <div className="w-full flex flex-col items-center justify-end pb-4 pt-10">
               <span className="text-[9px] font-black text-[#1E40AF] uppercase tracking-[0.2em] opacity-30">New</span>
            </div>
            
            <NavItem icon="fa-list-ul" label={t('nav.history')} isActive={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} />
            <NavItem icon="fa-cog" label={t('nav.settings')} isActive={false} onClick={onSettingsClick} />
          </nav>
        </div>
      </div>
    </div>
  );
};

export default BottomNavBar;