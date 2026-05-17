export type Role = 'student' | 'admin' | 'cook' | 'superadmin';
export type MealStatus = 'eating' | 'vetoed' | 'locked';
export type PaymentStatus = 'pending' | 'verified' | 'rejected';
export type NotificationType = 'normal' | 'important' | 'urgent';
export type NotificationTarget = 'all' | 'unpaid' | 'specific';
export type ExpenseCategory = 'Rice' | 'Vegetables' | 'Meat' | 'Gas' | 'Salary' | 'Maintenance' | 'Miscellaneous';

export interface User {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  roomNumber: string;
  vegPreference: 'veg' | 'nonveg';
  isActive: boolean;
  createdAt: Date;
  hostelId: string;
  profilePhotoUrl?: string;
}

export interface MealRecord {
  id?: string;
  date: string;
  studentId: string;
  breakfast: MealStatus;
  lunch: MealStatus;
  dinner: MealStatus;
  vegPreference: 'veg' | 'nonveg';
  updatedAt: Date;
}

export interface Payment {
  id?: string;
  studentId: string;
  studentName?: string;
  month: string;
  amount: number;
  screenshotUrl: string;
  status: PaymentStatus;
  rejectionReason?: string;
  verifiedBy?: string;
  createdAt: Date;
}

export interface Expense {
  id?: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  note?: string;
  receiptUrl?: string;
  addedBy: string;
  month: string;
  createdAt: Date;
}

export interface MenuItem {
  id?: string;
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  updatedAt: Date;
  updatedBy: string;
}

export interface Notification {
  id?: string;
  title: string;
  message: string;
  type: NotificationType;
  targetType: NotificationTarget;
  targetIds: string[];
  sentBy: string;
  createdAt: Date;
  readBy: string[];
}

export interface Settings {
  breakfastCutoff: string;
  lunchCutoff: string;
  dinnerCutoff: string;
  baseAmount: number;
  qrImageUrl: string;
  upiId: string;
  paymentPhone: string;
}

export interface MonthlyReport {
  id?: string;
  month: string;
  totalExpense: number;
  totalCollection: number;
  deficit: number;
  perMealRate: number;
  isFrozen: boolean;
  generatedAt: Date;
}

export interface StudentBill {
  studentId: string;
  studentName: string;
  roomNumber: string;
  baseAmount: number;
  totalMeals: number;
  extraCharge: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  status: 'paid' | 'partial' | 'unpaid';
}
