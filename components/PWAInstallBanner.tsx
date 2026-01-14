import React, { useState, useEffect } from 'react';

const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [platform, setPlatform] = useState<'android' | 'ios' | 'other'>('other');

  const LOGO_URL = "https://ik.imagekit.io/13pcmqqzn/1000169239-removebg-preview%20(1).png?updatedAt=1768349953144";

  useEffect(() => {
    // 1. Check standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    if (isStandalone) return;

    // 2. Check 24-hour persistence
    const hideUntil = localStorage.getItem('xpenseflow_pwa_hide_v3');
    if (hideUntil && parseInt(hideUntil) > Date.now()) return;

    // 3. Platform Detection
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    setPlatform(isIOS ? 'ios' : 'android');

    // 4. Handle BeforeInstallPrompt for Android/Chrome
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Wait 5 seconds after prompt is available to show
      setTimeout(() => setIsVisible(true), 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 5. iOS fallback trigger (show after 5s because iOS doesn't have beforeinstallprompt)
    const iosTimer = setTimeout(() => {
      if (isIOS) {
        setIsVisible(true);
      }
    }, 5000);

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
      // Just hide and let them follow instruction
      setIsVisible(false);
    }
  };

  const handleMaybeLater = () => {
    setIsVisible(false);
    // Suppress for 24 hours
    const nextShow = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem('xpenseflow_pwa_hide_v3', nextShow.toString());
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-0 right-0 z-[100] px-6 pointer-events-none animate-in fade-in slide-in-from-top duration-700">
      <div className="max-w-md mx-auto pointer-events-auto neumorphic p-6 border-2 border-white/80 bg-[#F0F2F5]/95 backdrop-blur-xl ring-1 ring-blue-500/10">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl logo-raised flex items-center justify-center shrink-0 border border-white/50 bg-white/20 overflow-hidden">
            <img 
              src={LOGO_URL} 
              alt="XpenseFlow" 
              className="w-10 h-10 object-contain" 
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-black text-[#1A1C2E] leading-tight">Install XpenseFlow</h4>
            <p className="text-[11px] font-bold text-gray-500 mt-1.5 leading-relaxed">
              {platform === 'ios' 
                ? "Tap Share ➕ then 'Add to Home Screen' for the full app experience." 
                : "Add to home screen for instant access and native-like performance."}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handleInstallClick}
            className="flex-1 py-3.5 rounded-2xl bg-[#3B82F6] text-white text-[11px] font-black uppercase tracking-widest shadow-[0_8px_20px_rgba(59,130,246,0.3)] active:scale-[0.96] transition-all"
          >
            {platform === 'ios' ? 'Got it' : 'Install Now'}
          </button>
          <button 
            onClick={handleMaybeLater}
            className="px-6 py-3.5 rounded-2xl neumorphic-flat text-gray-400 text-[11px] font-black uppercase tracking-widest active:neumorphic-pressed transition-all"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallBanner;