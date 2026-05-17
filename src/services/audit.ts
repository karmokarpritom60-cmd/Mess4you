import { logAction } from './firestore';
import { User } from '../types';

export const auditLog = async (
  action: string,
  user: User | null,
  details?: {
    oldValue?: any;
    newValue?: any;
    targetUserId?: string;
    targetResourceId?: string;
  }
) => {
  if (!user) return;

  try {
    await logAction(
      `${action} by ${user.name} (${user.role})`,
      user.uid,
      details?.oldValue,
      details?.newValue
    );
  } catch (error) {
    console.error('Failed to log action:', error);
  }
};

export const auditActions = {
  ADD_STUDENT: 'add_student',
  EDIT_STUDENT: 'edit_student',
  DEACTIVATE_STUDENT: 'deactivate_student',
  ADD_EXPENSE: 'add_expense',
  EDIT_EXPENSE: 'edit_expense',
  DELETE_EXPENSE: 'delete_expense',
  UPDATE_MENU: 'update_menu',
  VERIFY_PAYMENT: 'verify_payment',
  REJECT_PAYMENT: 'reject_payment',
  OVERRIDE_MEAL: 'override_meal',
  SEND_NOTIFICATION: 'send_notification',
  GENERATE_BILLS: 'generate_bills',
  UPDATE_SETTINGS: 'update_settings',
  CHANGE_USER_ROLE: 'change_user_role',
  ADD_ADMIN: 'add_admin',
  REMOVE_ADMIN: 'remove_admin',
  FREEZE_MONTH: 'freeze_month',
} as const;
