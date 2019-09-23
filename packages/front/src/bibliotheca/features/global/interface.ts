import { User } from 'bibliotheca/types';
import { User as FirebaseUser } from 'firebase/app';
import { createModule } from 'typeless';
import { GlobalSymbol } from './symbol';

// --- Actions ---
export const [handle, GlobalActions, getGlobalState] = createModule(GlobalSymbol)
  .withActions({
    $mounted: null,
    logout: null,
    loggedIn: (user: FirebaseUser | null) => ({ payload: { user } }),
    progressShow: null,
    progressHide: null,
  })
  .withState<GlobalState>();

// --- Types ---
export interface GlobalState {
  isLoaded: boolean;
  user: User | null;
  progress: boolean;
}
