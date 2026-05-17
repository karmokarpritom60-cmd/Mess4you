import {
  collection, doc, setDoc, updateDoc, deleteDoc, getDocs, getDoc, query, where, orderBy, onSnapshot, writeBatch, Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { User, MealRecord, Payment, Expense, MenuItem, Notification, Settings } from '../types';

// ============ USER OPERATIONS ============

export const createUser = async (uid: string, userData: Omit<User, 'uid' | 'createdAt'>) => {
  await setDoc(doc(db, 'users', uid), {
    ...userData,
    createdAt: Timestamp.now(),
  });
};

export const getUser = async (uid: string): Promise<User | null> => {
  const docSnap = await getDoc(doc(db, 'users', uid));
  if (!docSnap.exists()) return null;
  const data = docSnap.data();
  return { uid, ...data, createdAt: data.createdAt?.toDate?.() || new Date() } as User;
};

export const updateUser = async (uid: string, updates: Partial<User>) => {
  const { createdAt, uid: _, ...data } = updates;
  await updateDoc(doc(db, 'users', uid), data);
};

export const getAllStudents = async (): Promise<User[]> => {
  const q = query(collection(db, 'users'), where('role', '==', 'student'), where('isActive', '==', true));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate?.() || new Date() } as User));
};

export const subscribeToStudents = (callback: (students: User[]) => void) => {
  const q = query(collection(db, 'users'), where('role', '==', 'student'), where('isActive', '==', true));
  return onSnapshot(q, (querySnapshot) => {
    const students = querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate?.() || new Date() } as User));
    callback(students);
  });
};

// ============ MEAL OPERATIONS ============

export const getMealsForDate = async (date: string): Promise<MealRecord[]> => {
  const q = query(collection(db, 'meals'), where('date', '==', date));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), updatedAt: doc.data().updatedAt?.toDate?.() || new Date() } as MealRecord));
};

export const getMealsForStudent = async (studentId: string): Promise<MealRecord[]> => {
  const q = query(collection(db, 'meals'), where('studentId', '==', studentId), orderBy('date', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), updatedAt: doc.data().updatedAt?.toDate?.() || new Date() } as MealRecord));
};

export const setMealRecord = async (mealData: Omit<MealRecord, 'id'>) => {
  const mealId = `${mealData.studentId}_${mealData.date}`;
  await setDoc(doc(db, 'meals', mealId), {
    ...mealData,
    updatedAt: Timestamp.now(),
  });
};

export const updateMealRecord = async (studentId: string, date: string, updates: Partial<MealRecord>) => {
  const mealId = `${studentId}_${date}`;
  await updateDoc(doc(db, 'meals', mealId), {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

export const subscribeToDayMeals = (date: string, callback: (meals: MealRecord[]) => void) => {
  const q = query(collection(db, 'meals'), where('date', '==', date));
  return onSnapshot(q, (querySnapshot) => {
    const meals = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), updatedAt: doc.data().updatedAt?.toDate?.() || new Date() } as MealRecord));
    callback(meals);
  });
};

// ============ PAYMENT OPERATIONS ============

export const createPayment = async (paymentData: Omit<Payment, 'id' | 'createdAt'>) => {
  const newDoc = doc(collection(db, 'payments'));
  await setDoc(newDoc, {
    ...paymentData,
    createdAt: Timestamp.now(),
  });
  return newDoc.id;
};

export const updatePaymentStatus = async (paymentId: string, status: string, rejectionReason?: string, verifiedBy?: string) => {
  const updates: any = { status };
  if (rejectionReason) updates.rejectionReason = rejectionReason;
  if (verifiedBy) updates.verifiedBy = verifiedBy;
  await updateDoc(doc(db, 'payments', paymentId), updates);
};

export const getPaymentsForMonth = async (month: string): Promise<Payment[]> => {
  const q = query(collection(db, 'payments'), where('month', '==', month));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate?.() || new Date() } as Payment));
};

export const getPendingPayments = async (): Promise<Payment[]> => {
  const q = query(collection(db, 'payments'), where('status', '==', 'pending'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate?.() || new Date() } as Payment));
};

export const subscribeToPendingPayments = (callback: (payments: Payment[]) => void) => {
  const q = query(collection(db, 'payments'), where('status', '==', 'pending'));
  return onSnapshot(q, (querySnapshot) => {
    const payments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate?.() || new Date() } as Payment));
    callback(payments);
  });
};

// ============ EXPENSE OPERATIONS ============

export const addExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
  const newDoc = doc(collection(db, 'expenses'));
  await setDoc(newDoc, {
    ...expenseData,
    createdAt: Timestamp.now(),
  });
  return newDoc.id;
};

export const updateExpense = async (expenseId: string, updates: Partial<Expense>) => {
  const { createdAt, id, ...data } = updates;
  await updateDoc(doc(db, 'expenses', expenseId), data);
};

export const deleteExpense = async (expenseId: string) => {
  await deleteDoc(doc(db, 'expenses', expenseId));
};

export const getExpensesForMonth = async (month: string): Promise<Expense[]> => {
  const q = query(collection(db, 'expenses'), where('month', '==', month), orderBy('date', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate?.() || new Date() } as Expense));
};

export const subscribeToExpenses = (month: string, callback: (expenses: Expense[]) => void) => {
  const q = query(collection(db, 'expenses'), where('month', '==', month), orderBy('date', 'desc'));
  return onSnapshot(q, (querySnapshot) => {
    const expenses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate?.() || new Date() } as Expense));
    callback(expenses);
  });
};

// ============ MENU OPERATIONS ============

export const setMenuForDay = async (day: string, menuData: Omit<MenuItem, 'id'>) => {
  await setDoc(doc(db, 'menu', day), {
    ...menuData,
    updatedAt: Timestamp.now(),
  });
};

export const getWeeklyMenu = async (): Promise<MenuItem[]> => {
  const querySnapshot = await getDocs(collection(db, 'menu'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), updatedAt: doc.data().updatedAt?.toDate?.() || new Date() } as MenuItem));
};

export const subscribeToMenu = (callback: (menu: MenuItem[]) => void) => {
  return onSnapshot(collection(db, 'menu'), (querySnapshot) => {
    const menu = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), updatedAt: doc.data().updatedAt?.toDate?.() || new Date() } as MenuItem));
    callback(menu);
  });
};

// ============ NOTIFICATION OPERATIONS ============

export const sendNotification = async (notificationData: Omit<Notification, 'id' | 'createdAt'>) => {
  const newDoc = doc(collection(db, 'notifications'));
  await setDoc(newDoc, {
    ...notificationData,
    createdAt: Timestamp.now(),
  });
  return newDoc.id;
};

export const getNotifications = async (limit = 10): Promise<Notification[]> => {
  const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.slice(0, limit).map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate?.() || new Date() } as Notification));
};

// ============ SETTINGS OPERATIONS ============

export const getSettings = async (): Promise<Settings | null> => {
  const docSnap = await getDoc(doc(db, 'settings', 'default'));
  if (!docSnap.exists()) return null;
  return docSnap.data() as Settings;
};

export const updateSettings = async (updates: Partial<Settings>) => {
  await updateDoc(doc(db, 'settings', 'default'), updates);
};

export const subscribeToSettings = (callback: (settings: Settings) => void) => {
  return onSnapshot(doc(db, 'settings', 'default'), (doc) => {
    if (doc.exists()) callback(doc.data() as Settings);
  });
};

// ============ AUDIT LOG OPERATIONS ============

export const logAction = async (action: string, userId: string, oldValue?: any, newValue?: any) => {
  const newDoc = doc(collection(db, 'auditLogs'));
  await setDoc(newDoc, {
    action,
    userId,
    oldValue,
    newValue,
    timestamp: Timestamp.now(),
  });
};

// ============ BATCH OPERATIONS ============

export const generateMonthlyBills = async (month: string, students: User[], expenses: Expense[], payments: Payment[], baseAmount: number) => {
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalStudents = students.length;
  const totalCollection = payments.filter(p => p.status === 'verified').reduce((sum, p) => sum + p.amount, 0);
  const deficit = totalExpense - (baseAmount * totalStudents);
  const totalMeals = totalStudents * 90; // Approximate
  const perMealRate = totalMeals > 0 ? deficit / totalMeals : 0;

  const batch = writeBatch(db);

  // Save monthly report
  batch.set(doc(db, 'monthlyReports', month), {
    month,
    totalExpense,
    totalCollection,
    deficit,
    perMealRate,
    isFrozen: false,
    generatedAt: Timestamp.now(),
  });

  return batch.commit();
};
