import { User } from 'bibliotheca/types';
import { User as FirebaseUser } from 'firebase/app';
import { createActions } from 'typeless';

// --- Constants ---
export const MODULE = 'global';

// --- Actions ---
export const GlobalActions = createActions(MODULE, {
  $mounted: null,
  logout: null,
  loggedIn: (user: FirebaseUser | null) => ({ payload: { user } }),
  progressShow: null,
  progressHide: null,
});

// --- Types ---
export interface GlobalState {
  isLoaded: boolean;
  user: User | null;
  progress: boolean;
}

declare module 'typeless/types' {
  export interface DefaultState {
    global: GlobalState;
  }
}
