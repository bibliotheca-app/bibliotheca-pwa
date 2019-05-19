import { createActions } from 'typeless';

// --- Constants ---
export const MODULE = 'notification';

// --- Actions ---
export const NotificationActions = createActions(MODULE, {
  notifyMessage: (message: string) => ({ payload: { message } }),
});

// --- Types ---
export interface NotificationState {}

declare module 'typeless/types' {
  export interface DefaultState {
    notification: NotificationState;
  }
}
