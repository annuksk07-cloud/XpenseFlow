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
    <div className={`w-11 h-10 flex items-center justify-center rounded-2xl transition-all duration-300 ${isActive ? 'neumorphic-pressed bg-white/40' : ''}`}>
        <i className={`fa-solid ${icon} text-lg transition-colors duration-300 ${isActive ? 'text-[#1E40AF]' : 'text-[#1A1C2E] opacity-70'}`}></i>
    </div>
    <span className={`text-[10px] mt-1 font-bold transition-colors uppercase tracking-tight ${isActive ? 'text-[#1E40AF]' : 'text-gray-400'}`}>{label}</span>
  </button>
);

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, setActiveTab, onSettingsClick, onAddClick }) => {
  const { t } = useLanguage();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-0 pb-0 pointer-events-none">
      <div className="max-w-md mx-auto relative pointer-events-auto">
        
        {/* CENTERED BIG ACTION BUTTON (Overlapping FAB) */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-11 z-50">
          <button
            onClick={onAddClick}
            className="w-20 h-20 rounded-full bg-[#1E40AF] text-white flex items-center justify-center shadow-[0_18px_45px_rgba(30,64,175,0.65)] border-8 border-[#F0F2F5] active:scale-90 transition-all group overflow-hidden"
            style={{ width: '84px', height: '84px' }}
            aria-label={t('fab.addTransaction')}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-white/10 pointer-events-none"></div>
            <i className="fa-solid fa-plus text-3xl group-active:rotate-90 transition-transform duration-300"></i>
          </button>
        </div>

        {/* CUSTOM NOTCHED NAVIGATION DOCK SVG */}
        <div className="relative w-full h-[105px] flex items-end">
          <svg 
            width="100%" 
            height="105" 
            viewBox="0 0 375 105" 
            preserveAspectRatio="none" 
            className="absolute bottom-0 left-0 filter drop-shadow-[0_-18px_38px_rgba(0,0,0,0.08)]"
          >
            <path 
              d="M0 32C0 14.3269 14.3269 0 32 0H110C120 0 130 0 138 10C148 22 154 58 187.5 58C221 58 227 22 237 10C245 0 255 0 265 0H343C360.673 0 375 14.3269 375 32V105H0V32Z" 
              fill="#F0F2F5" 
            />
          </svg>
          
          <nav className="grid grid-cols-5 w-full h-full px-2 relative z-10 pb-[env(safe-area-inset-bottom)] pt-4">
            <NavItem icon="fa-house" label={t('nav.home')} isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <NavItem icon="fa-chart-pie" label={t('nav.analytics')} isActive={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
            
            {/* Empty Center for FAB */}
            <div className="w-full flex items-center justify-center pt-12">
               <span className="text-[9px] font-black text-[#1E40AF]/30 uppercase tracking-[0.3em] ml-1">New</span>
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