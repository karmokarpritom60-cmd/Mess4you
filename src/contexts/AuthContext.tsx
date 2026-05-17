import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase.config';
import { User } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Omit<User, 'uid' | 'isActive' | 'createdAt' | 'hostelId'>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
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
            const data = docSnap.data();
            setUserData({
              uid: user.uid,
              name: data.name || user.displayName || '',
              email: data.email || user.email || '',
              phone: data.phone || '',
              role: data.role || 'student',
              roomNumber: data.roomNumber || '',
              vegPreference: data.vegPreference || 'veg',
              isActive: data.isActive !== false,
              createdAt: data.createdAt?.toDate?.() || new Date(),
              hostelId: data.hostelId || 'default-hostel',
              profilePhotoUrl: data.profilePhotoUrl,
            } as User);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    setUserData(null);
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const signUp = async (email: string, password: string, userData: Omit<User, 'uid' | 'isActive' | 'createdAt' | 'hostelId'>) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    await updateProfile(user, { displayName: userData.name });

    await setDoc(doc(db, 'users', user.uid), {
      ...userData,
      email: user.email,
      isActive: true,
      createdAt: new Date(),
      hostelId: 'default-hostel',
    });
  };

  return (
    <AuthContext.Provider value={{ currentUser, userData, loading, login, logout, resetPassword, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};
