import * as Rx from 'bibliotheca/rx';
import { handle, NotificationActions } from './interface';

// --- Epic ---
export const epic = handle.epic().on(NotificationActions.notifyMessage, ({ message }) => {
  alert(message);
  return Rx.empty();
});

// --- Module ---
export const useNotificationModule = () => {
  handle();
};
