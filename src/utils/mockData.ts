import { User, MealRecord, Payment, Expense, MenuItem, Notification, Settings } from '../types';

export const mockUsers: User[] = [
  {
    uid: 'superadmin-uid', name: 'Super Admin', email: 'superadmin@mess4you.com',
    phone: '9876543210', role: 'superadmin', roomNumber: 'Admin',
    vegPreference: 'veg', isActive: true, createdAt: new Date('2024-01-01'), hostelId: 'hostel-1',
  },
  {
    uid: 'admin-uid', name: 'Rajesh Kumar', email: 'admin@mess4you.com',
    phone: '9876543211', role: 'admin', roomNumber: 'Admin',
    vegPreference: 'veg', isActive: true, createdAt: new Date('2024-01-01'), hostelId: 'hostel-1',
  },
  {
    uid: 'cook-uid', name: 'Mohan Lal', email: 'cook@mess4you.com',
    phone: '9876543212', role: 'cook', roomNumber: 'Kitchen',
    vegPreference: 'veg', isActive: true, createdAt: new Date('2024-01-01'), hostelId: 'hostel-1',
  },
  {
    uid: 'student1-uid', name: 'Arjun Sharma', email: 'student1@mess4you.com',
    phone: '9876543213', role: 'student', roomNumber: '101',
    vegPreference: 'veg', isActive: true, createdAt: new Date('2024-01-15'), hostelId: 'hostel-1',
  },
  {
    uid: 'student2-uid', name: 'Priya Patel', email: 'student2@mess4you.com',
    phone: '9876543214', role: 'student', roomNumber: '102',
    vegPreference: 'nonveg', isActive: true, createdAt: new Date('2024-01-15'), hostelId: 'hostel-1',
  },
  {
    uid: 'student3-uid', name: 'Rahul Singh', email: 'student3@mess4you.com',
    phone: '9876543215', role: 'student', roomNumber: '201',
    vegPreference: 'nonveg', isActive: true, createdAt: new Date('2024-01-15'), hostelId: 'hostel-1',
  },
  {
    uid: 'student4-uid', name: 'Sneha Gupta', email: 'student4@mess4you.com',
    phone: '9876543216', role: 'student', roomNumber: '202',
    vegPreference: 'veg', isActive: true, createdAt: new Date('2024-01-15'), hostelId: 'hostel-1',
  },
  {
    uid: 'student5-uid', name: 'Vikram Reddy', email: 'student5@mess4you.com',
    phone: '9876543217', role: 'student', roomNumber: '301',
    vegPreference: 'nonveg', isActive: true, createdAt: new Date('2024-01-15'), hostelId: 'hostel-1',
  },
];

export const mockMenuItems: MenuItem[] = [
  { day: 'monday', breakfast: 'Idli, Sambar, Chutney', lunch: 'Rice, Dal, Sabzi, Roti', dinner: 'Chapati, Paneer Curry, Rice', updatedAt: new Date(), updatedBy: 'admin-uid' },
  { day: 'tuesday', breakfast: 'Poha, Tea', lunch: 'Rice, Rajma, Salad, Roti', dinner: 'Roti, Mixed Veg, Dal, Rice', updatedAt: new Date(), updatedBy: 'admin-uid' },
  { day: 'wednesday', breakfast: 'Upma, Coconut Chutney', lunch: 'Rice, Chole, Roti, Raita', dinner: 'Paratha, Aloo Matar, Rice', updatedAt: new Date(), updatedBy: 'admin-uid' },
  { day: 'thursday', breakfast: 'Puri Bhaji', lunch: 'Rice, Palak Dal, Roti, Pickle', dinner: 'Roti, Egg Curry / Paneer, Rice', updatedAt: new Date(), updatedBy: 'admin-uid' },
  { day: 'friday', breakfast: 'Dosa, Sambar, Chutney', lunch: 'Veg Biryani / Chicken Biryani, Raita', dinner: 'Roti, Dal Makhani, Rice', updatedAt: new Date(), updatedBy: 'admin-uid' },
  { day: 'saturday', breakfast: 'Bread Butter, Omelette / Cornflakes', lunch: 'Rice, Kadhi, Sabzi, Roti', dinner: 'Naan, Butter Chicken / Paneer Butter Masala', updatedAt: new Date(), updatedBy: 'admin-uid' },
  { day: 'sunday', breakfast: 'Chole Bhature', lunch: 'Special Thali - Rice, 2 Sabzi, Dal, Roti, Sweet', dinner: 'Roti, Leftovers Special, Rice', updatedAt: new Date(), updatedBy: 'admin-uid' },
];

export const mockPayments: Payment[] = [
  { id: 'pay-1', studentId: 'student1-uid', studentName: 'Arjun Sharma', month: '2025-05', amount: 3200, screenshotUrl: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?w=400', status: 'pending', createdAt: new Date('2025-05-10') },
  { id: 'pay-2', studentId: 'student2-uid', studentName: 'Priya Patel', month: '2025-05', amount: 3500, screenshotUrl: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?w=400', status: 'pending', createdAt: new Date('2025-05-12') },
  { id: 'pay-3', studentId: 'student3-uid', studentName: 'Rahul Singh', month: '2025-05', amount: 3000, screenshotUrl: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?w=400', status: 'pending', createdAt: new Date('2025-05-14') },
  { id: 'pay-4', studentId: 'student4-uid', studentName: 'Sneha Gupta', month: '2025-04', amount: 3200, screenshotUrl: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?w=400', status: 'verified', verifiedBy: 'admin-uid', createdAt: new Date('2025-04-15') },
  { id: 'pay-5', studentId: 'student5-uid', studentName: 'Vikram Reddy', month: '2025-04', amount: 2800, screenshotUrl: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?w=400', status: 'rejected', rejectionReason: 'Screenshot unclear, please re-upload', createdAt: new Date('2025-04-18') },
];

export const mockExpenses: Expense[] = [
  { id: 'exp-1', category: 'Rice', amount: 4500, date: '2025-05-01', note: '50kg Basmati Rice', addedBy: 'admin-uid', month: '2025-05', createdAt: new Date('2025-05-01') },
  { id: 'exp-2', category: 'Vegetables', amount: 3200, date: '2025-05-02', note: 'Weekly vegetables', addedBy: 'admin-uid', month: '2025-05', createdAt: new Date('2025-05-02') },
  { id: 'exp-3', category: 'Meat', amount: 5500, date: '2025-05-03', note: 'Chicken 10kg', addedBy: 'admin-uid', month: '2025-05', createdAt: new Date('2025-05-03') },
  { id: 'exp-4', category: 'Gas', amount: 1800, date: '2025-05-04', note: '2 cylinders', addedBy: 'admin-uid', month: '2025-05', createdAt: new Date('2025-05-04') },
  { id: 'exp-5', category: 'Salary', amount: 12000, date: '2025-05-05', note: 'Cook salary', addedBy: 'admin-uid', month: '2025-05', createdAt: new Date('2025-05-05') },
  { id: 'exp-6', category: 'Vegetables', amount: 2800, date: '2025-05-08', note: 'Week 2 vegetables', addedBy: 'admin-uid', month: '2025-05', createdAt: new Date('2025-05-08') },
  { id: 'exp-7', category: 'Miscellaneous', amount: 650, date: '2025-05-10', note: 'Cleaning supplies', addedBy: 'admin-uid', month: '2025-05', createdAt: new Date('2025-05-10') },
];

export const mockNotifications: Notification[] = [
  { id: 'notif-1', title: 'May Bills Generated', message: 'Bills for the month of May 2025 have been generated. Please check your payment section.', type: 'important', targetType: 'all', targetIds: [], sentBy: 'admin-uid', createdAt: new Date('2025-05-15'), readBy: ['student1-uid', 'student3-uid'] },
  { id: 'notif-2', title: 'Payment Reminder', message: 'Your May payment is pending. Please pay before 25th May to avoid late fees.', type: 'urgent', targetType: 'unpaid', targetIds: [], sentBy: 'admin-uid', createdAt: new Date('2025-05-16'), readBy: [] },
  { id: 'notif-3', title: 'Special Dinner Tomorrow', message: 'Special dinner will be served tomorrow for the hostel day celebrations.', type: 'normal', targetType: 'all', targetIds: [], sentBy: 'admin-uid', createdAt: new Date('2025-05-14'), readBy: ['student1-uid', 'student2-uid', 'student4-uid'] },
];

export const mockSettings: Settings = {
  breakfastCutoff: '05:00',
  lunchCutoff: '07:00',
  dinnerCutoff: '15:30',
  baseAmount: 2500,
  qrImageUrl: 'https://images.pexels.com/photos/278430/pexels-photo-278430.jpeg?w=300',
  upiId: 'mess4you@upi',
  paymentPhone: '9876543210',
};

export const generateMockMeals = (studentId: string): MealRecord[] => {
  const meals: MealRecord[] = [];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isPast = day < today;
    const isToday = day === today;

    let breakfast: 'eating' | 'vetoed' | 'locked' = 'eating';
    let lunch: 'eating' | 'vetoed' | 'locked' = 'eating';
    let dinner: 'eating' | 'vetoed' | 'locked' = 'eating';

    if (isPast || isToday) {
      breakfast = 'locked';
      lunch = 'locked';
      dinner = isPast ? 'locked' : 'eating';
      if (day % 5 === 0) breakfast = 'vetoed';
      if (day % 7 === 0) lunch = 'vetoed';
    } else {
      if (day % 6 === 0) breakfast = 'vetoed';
      if (day % 8 === 0) dinner = 'vetoed';
    }

    meals.push({
      id: `meal-${studentId}-${date}`,
      date,
      studentId,
      breakfast,
      lunch,
      dinner,
      vegPreference: studentId.includes('2') || studentId.includes('3') || studentId.includes('5') ? 'nonveg' : 'veg',
      updatedAt: new Date(),
    });
  }
  return meals;
};
