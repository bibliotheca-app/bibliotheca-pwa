import { createModule } from 'typeless';
import { NotificationSymbol } from './symbol';

// --- Actions ---
export const [handle, NotificationActions] = createModule(NotificationSymbol).withActions({
  notifyMessage: (message: string) => ({ payload: { message } }),
});
