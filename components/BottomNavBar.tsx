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
        <i className={`fa-solid ${icon} text-lg transition-colors duration-300 ${isActive ? 'text-blue-600' : 'text-[#1A1C2E] opacity-70'}`}></i>
    </div>
    <span className={`text-[10px] mt-1 font-bold transition-colors uppercase tracking-tight ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>{label}</span>
  </button>
);

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, setActiveTab, onSettingsClick, onAddClick }) => {
  const { t } = useLanguage();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-0 pb-0 pointer-events-none">
      <div className="max-w-md mx-auto relative pointer-events-auto">
        
        {/* CENTERED BIG ACTION BUTTON (Overlapping FAB) */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-8 z-50">
          <button
            onClick={onAddClick}
            className="w-18 h-18 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-[0_12px_35px_rgba(59,130,246,0.6)] border-6 border-[#F0F2F5] active:scale-90 transition-all group overflow-hidden"
            style={{ width: '74px', height: '74px' }}
            aria-label={t('fab.addTransaction')}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-700/30 to-white/10 pointer-events-none"></div>
            <i className="fa-solid fa-plus text-3xl group-active:rotate-90 transition-transform duration-300"></i>
          </button>
        </div>

        {/* CUSTOM NOTCHED NAVIGATION DOCK SVG */}
        <div className="relative w-full h-[95px] flex items-end">
          <svg 
            width="100%" 
            height="95" 
            viewBox="0 0 375 95" 
            preserveAspectRatio="none" 
            className="absolute bottom-0 left-0 filter drop-shadow-[0_-12px_32px_rgba(0,0,0,0.06)]"
          >
            <path 
              d="M0 32C0 14.3269 14.3269 0 32 0H120C130 0 138 0 144 6C152 14 158 48 187.5 48C217 48 223 14 231 6C237 0 245 0 255 0H343C360.673 0 375 14.3269 375 32V95H0V32Z" 
              fill="#F0F2F5" 
            />
          </svg>
          
          <nav className="grid grid-cols-5 w-full h-full px-2 relative z-10 pb-[env(safe-area-inset-bottom)] pt-4">
            <NavItem icon="fa-house" label={t('nav.home')} isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <NavItem icon="fa-chart-pie" label={t('nav.analytics')} isActive={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
            
            {/* Empty Center for FAB */}
            <div className="w-full flex items-center justify-center pt-8">
               <span className="text-[10px] font-black text-blue-600/20 uppercase tracking-tighter">Add</span>
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