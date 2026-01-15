import React, { useState, useEffect } from 'react';

const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [platform, setPlatform] = useState<'android' | 'ios' | 'other'>('other');

  const LOGO_URL = "https://ik.imagekit.io/13pcmqqzn/1000169239-removebg-preview%20(1).png?updatedAt=1768349953144";

  useEffect(() => {
    // 1. Check if already running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    if (isStandalone) return;

    // 2. Dismissal cooldown check (v7)
    const hideUntil = localStorage.getItem('xpenseflow_pwa_hide_v7');
    if (hideUntil && parseInt(hideUntil) > Date.now()) return;

    // 3. Platform Detection
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    setPlatform(isIOS ? 'ios' : 'android');

    // 4. Capture native install event (Chrome/Android/Desktop)
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent browser from showing default mini-infobar
      e.preventDefault();
      setDeferredPrompt(e);
      // Wait 5 seconds as requested before showing custom banner
      setTimeout(() => setIsVisible(true), 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 5. iOS Manual Trigger logic (since iOS doesn't support beforeinstallprompt)
    if (isIOS) {
      const iosTimer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);
      return () => clearTimeout(iosTimer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (platform === 'android' && deferredPrompt) {
      // Show the native prompt
      deferredPrompt.prompt();
      // Wait for user choice
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`XpenseFlow: Install outcome: ${outcome}`);
      setIsVisible(false);
      setDeferredPrompt(null);
    } else if (platform === 'ios') {
      // For iOS, banner shows instructions; clicking hides the banner for the session
      setIsVisible(false);
    }
  };

  const handleMaybeLater = () => {
    setIsVisible(false);
    // Dismiss for 2 days to maintain premium UX
    const nextShow = Date.now() + 2 * 24 * 60 * 60 * 1000;
    localStorage.setItem('xpenseflow_pwa_hide_v7', nextShow.toString());
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-24 left-0 right-0 z-[10000] px-6 pointer-events-none animate-in fade-in slide-in-from-top duration-700">
      <div className="max-w-md mx-auto pointer-events-auto neumorphic p-6 border-2 border-white/90 bg-[#F0F2F5]/98 backdrop-blur-2xl ring-1 ring-blue-500/5">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-[24px] logo-raised flex items-center justify-center shrink-0 border-2 border-white bg-white/60 overflow-hidden shadow-sm">
            <img 
              src={LOGO_URL} 
              alt="XpenseFlow" 
              className="w-12 h-12 object-contain" 
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-black text-[#1A1C2E] leading-tight">Install XpenseFlow</h4>
            <p className="text-[11px] font-bold text-gray-500 mt-2 leading-relaxed opacity-90">
              {platform === 'ios' 
                ? "Tap 'Share' ➕ then 'Add to Home Screen' for the full professional experience." 
                : "Add to home screen for instant access and a seamless mobile interface."}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={handleInstallClick}
            className="flex-1 py-4 rounded-2xl bg-[#1E40AF] text-white text-[12px] font-black uppercase tracking-widest shadow-[0_12px_28px_rgba(30,64,175,0.4)] active:scale-[0.96] transition-all"
          >
            {platform === 'ios' ? 'Got It' : 'Install App'}
          </button>
          <button 
            onClick={handleMaybeLater}
            className="px-6 py-4 rounded-2xl neumorphic-flat text-gray-400 text-[12px] font-black uppercase tracking-widest active:neumorphic-pressed transition-all"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallBanner;