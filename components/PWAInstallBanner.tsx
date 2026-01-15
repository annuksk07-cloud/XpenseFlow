import React, { useState, useEffect } from 'react';

const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [platform, setPlatform] = useState<'android' | 'ios' | 'other'>('other');

  const LOGO_URL = "https://ik.imagekit.io/13pcmqqzn/1000169239-removebg-preview%20(1).png?updatedAt=1768349953144";

  useEffect(() => {
    // 1. Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    if (isStandalone) return;

    // 2. Check dismissal cooldown
    const hideUntil = localStorage.getItem('xpenseflow_pwa_hide_v4');
    if (hideUntil && parseInt(hideUntil) > Date.now()) return;

    // 3. Platform Detection
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    setPlatform(isIOS ? 'ios' : 'android');

    // 4. Android BeforeInstallPrompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show banner after 3 seconds of usage
      setTimeout(() => setIsVisible(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 5. iOS fallback trigger
    const iosTimer = setTimeout(() => {
      if (isIOS) {
        setIsVisible(true);
      }
    }, 4000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(iosTimer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (platform === 'android' && deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else if (platform === 'ios') {
      setIsVisible(false);
    }
  };

  const handleMaybeLater = () => {
    setIsVisible(false);
    // Dismiss for 2 days to be non-intrusive
    const nextShow = Date.now() + 2 * 24 * 60 * 60 * 1000;
    localStorage.setItem('xpenseflow_pwa_hide_v4', nextShow.toString());
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-0 right-0 z-[100] px-6 pointer-events-none animate-in fade-in slide-in-from-top duration-700">
      <div className="max-w-md mx-auto pointer-events-auto neumorphic p-6 border-2 border-white/90 bg-[#F0F2F5]/98 backdrop-blur-2xl ring-1 ring-blue-500/5">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-3xl logo-raised flex items-center justify-center shrink-0 border-2 border-white bg-white/40 overflow-hidden shadow-sm">
            <img 
              src={LOGO_URL} 
              alt="XpenseFlow" 
              className="w-12 h-12 object-contain" 
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-black text-[#1A1C2E] leading-tight">Install XpenseFlow</h4>
            <p className="text-[12px] font-bold text-gray-500 mt-2 leading-relaxed opacity-80">
              {platform === 'ios' 
                ? "Tap 'Share' ➕ then 'Add to Home Screen' to unlock full features." 
                : "Add to home screen for a seamless, professional experience."}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={handleInstallClick}
            className="flex-1 py-4 rounded-2xl bg-[#3B82F6] text-white text-[12px] font-black uppercase tracking-widest shadow-[0_10px_25px_rgba(59,130,246,0.35)] active:scale-[0.96] transition-all"
          >
            {platform === 'ios' ? 'I understand' : 'Install App'}
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