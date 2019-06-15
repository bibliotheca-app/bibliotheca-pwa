import { createModule } from 'typeless';

// --- Constants ---
export const MODULE = Symbol('notification');

// --- Actions ---
const modules = createModule(MODULE).withActions({
  notifyMessage: (message: string) => ({ payload: { message } }),
});

export const handle = modules[0];
export const NotificationActions = modules[1];
