
import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const LoginScreen: React.FC = () => {
  const { loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password);
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-white rounded-3xl logo-raised flex items-center justify-center mx-auto mb-6">
            <img src="https://img.sanishtech.com/u/4e2e11616c139405209c8eefc154c9a5.png" alt="Logo" className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-black text-[#1A1C2E] tracking-tight">
            Xpense<span className="text-blue-600">Flow</span>
          </h1>
          <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">{t('login.subtitle')}</p>
        </div>

        <div className="neumorphic p-8 space-y-6">
          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="email"
              placeholder={t('login.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 neumorphic-inset outline-none placeholder:text-gray-400 text-[#1A1C2E] font-medium"
              required
            />
            <input
              type="password"
              placeholder={t('login.passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 neumorphic-inset outline-none placeholder:text-gray-400 text-[#1A1C2E] font-medium"
              required
            />
            <button
              type="submit"
              className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-500/30 active:scale-95 transition-all"
            >
              {isLogin ? t('login.signIn') : t('login.signUp')}
            </button>
          </form>

          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <span className="relative bg-[#F0F2F5] px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('login.or')}</span>
          </div>

          <button
            onClick={loginWithGoogle}
            className="w-full py-4 neumorphic-flat active:neumorphic-pressed !rounded-2xl flex items-center justify-center gap-3 text-[#1A1C2E] font-bold transition-all"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            {t('login.signInWithGoogle')}
          </button>
        </div>

        <p className="text-center text-sm font-bold text-gray-500">
          {isLogin ? t('login.noAccount') : t('login.hasAccount')}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 font-black ml-1 hover:underline">
            {isLogin ? t('login.signUp') : t('login.signIn')}
          </button>
        </p>
      </div>
    </div>
  );
};

// Fix: Added missing default export for LoginScreen component.
export default LoginScreen;
