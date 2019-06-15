import { createModule } from 'typeless';
import { NotificationSymbol } from './symbol';

// --- Actions ---
const modules = createModule(NotificationSymbol).withActions({
  notifyMessage: (message: string) => ({ payload: { message } }),
});

export const handle = modules[0];
export const NotificationActions = modules[1];
