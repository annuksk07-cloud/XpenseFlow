
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth } from './firebaseConfig';

// Define a safe User type that doesn't contain circular Firebase internals
export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to safely stringify errors without circularity
const safeString = (val: any): string => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  return val.message || val.code || String(val);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set persistence to local storage
    setPersistence(auth, browserLocalPersistence).catch(err => {
      console.warn("Persistence error:", safeString(err));
    });

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Create a plain object containing only necessary data
        // Explicitly cast to string to avoid any hidden getters/proxies
        const sanitizedUser: AppUser = {
          uid: String(firebaseUser.uid),
          email: firebaseUser.email ? String(firebaseUser.email) : null,
          displayName: firebaseUser.displayName ? String(firebaseUser.displayName) : null,
          photoURL: firebaseUser.photoURL ? String(firebaseUser.photoURL) : null,
        };
        
        try {
          // Verify circularity before storage
          localStorage.setItem('xpenseflow_user_data', JSON.stringify(sanitizedUser));
        } catch (e) {
          console.warn("Storage error:", safeString(e));
        }
        setUser(sanitizedUser);
      } else {
        localStorage.removeItem('xpenseflow_user_data');
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.warn("Google Sign-In error:", safeString(e));
      throw e;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const registerWithEmail = async (email: string, pass: string) => {
    await createUserWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('xpenseflow_user_data');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithEmail, registerWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
