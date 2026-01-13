
import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const { t } = useLanguage();

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegistering) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err: any) {
      let errorMessage = 'An unexpected error occurred. Please try again.';
      switch (err.code) {
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'This email address is already registered. Please sign in or use a different email.';
          break;
        case 'auth/weak-password':
          errorMessage = 'The password is too weak. Please use at least 6 characters.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'The email address is not valid. Please enter a valid email.';
          break;
        case 'auth/too-many-requests':
            errorMessage = 'Access to this account is temporarily disabled due to too many failed login attempts. You can reset your password or try again later.';
            break;
        default:
          errorMessage = 'Failed to authenticate. Please try again.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      let errorMessage = 'An unexpected error occurred during Google Sign-In.';
      switch(err.code) {
          case 'auth/popup-closed-by-user':
              errorMessage = 'Google Sign-In was cancelled. Please try again.';
              break;
          case 'auth/account-exists-with-different-credential':
              errorMessage = 'An account already exists with this email. Please sign in using your email and password.';
              break;
          default:
              errorMessage = 'Failed to sign in with Google. Please try again.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-tight text-[#1A1C2E]">{t('login.title')}</h1>
          <p className="text-gray-500 mt-2">{t('login.subtitle')}</p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <form onSubmit={handleAuthAction} className="space-y-6">
            <input
              type="email"
              placeholder={t('login.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-100 rounded-lg outline-none border-2 border-transparent focus:border-[#00D09C] text-[#2D3748] placeholder:text-gray-400"
            />
            <input
              type="password"
              placeholder={t('login.passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-100 rounded-lg outline-none border-2 border-transparent focus:border-[#00D09C] text-[#2D3748] placeholder:text-gray-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[#00D09C] text-white font-bold hover:opacity-90 transition-opacity disabled:bg-gray-300"
            >
              {loading ? 'Processing...' : (isRegistering ? t('login.createAccount') : t('login.signIn'))}
            </button>
          </form>

          {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}

          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-200" />
            <span className="mx-4 text-gray-400 text-sm">{t('login.or')}</span>
            <hr className="flex-grow border-gray-200" />
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 rounded-lg bg-white text-gray-700 font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 disabled:bg-gray-300 border border-gray-200"
          >
            <i className="fa-brands fa-google"></i>{t('login.signInWithGoogle')}
          </button>

          <p className="text-center text-gray-500 text-sm mt-6">
            {isRegistering ? t('login.hasAccount') : t('login.noAccount')}
            <button onClick={() => {setIsRegistering(!isRegistering); setError('')}} className="font-bold text-[#00D09C] hover:underline">
              {isRegistering ? t('login.signIn') : t('login.signUp')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
