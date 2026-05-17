import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase.config';
import { User } from '../types';
import { mockUsers } from '../utils/mockData';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

const getMockUserByEmail = (email: string): User | undefined => {
  return mockUsers.find(u => u.email === email);
};

const MOCK_PASSWORDS: Record<string, string> = {
  'superadmin@mess4you.com': 'Admin@123',
  'admin@mess4you.com': 'Admin@123',
  'student1@mess4you.com': 'Student@123',
  'student2@mess4you.com': 'Student@123',
  'student3@mess4you.com': 'Student@123',
  'student4@mess4you.com': 'Student@123',
  'student5@mess4you.com': 'Student@123',
  'cook@mess4you.com': 'Cook@123',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData({ uid: user.uid, ...docSnap.data() } as User);
          }
        } catch {
          const mockSession = localStorage.getItem('mock_session');
          if (mockSession) setUserData(JSON.parse(mockSession));
        }
      } else {
        const mockSession = localStorage.getItem('mock_session');
        if (mockSession) {
          setUserData(JSON.parse(mockSession));
        } else {
          setUserData(null);
        }
      }
      setLoading(false);
    }, () => {
      const mockSession = localStorage.getItem('mock_session');
      if (mockSession) setUserData(JSON.parse(mockSession));
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      const mockUser = getMockUserByEmail(email);
      const expectedPassword = MOCK_PASSWORDS[email];
      if (mockUser && expectedPassword === password) {
        localStorage.setItem('mock_session', JSON.stringify(mockUser));
        setUserData(mockUser);
      } else {
        throw new Error('Invalid email or password');
      }
    }
  };

  const logout = async () => {
    localStorage.removeItem('mock_session');
    setUserData(null);
    try { await signOut(auth); } catch { /* ignore */ }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch {
      const mockUser = getMockUserByEmail(email);
      if (!mockUser) throw new Error('Email not found');
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, userData, loading, login, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};
