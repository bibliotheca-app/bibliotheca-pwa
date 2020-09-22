import { authService } from 'bibliotheca/services/ServiceContainer';
import * as Rx from 'typeless/rx';
import { GlobalActions, GlobalState, handle } from './interface';

// --- Epic ---
let subscribe: (() => void) | null = null;
export const epic = handle
  .epic()
  .on(GlobalActions.$mounted, () => {
    return new Rx.Observable(subscriber => {
      subscribe = authService.subscribe(authUser => {
        subscriber.next(GlobalActions.loggedIn(authUser));
      });
    });
  })
  .on(GlobalActions.logout, async () => {
    if (subscribe) subscribe();
    await authService.logout();
    return null;
  });

// --- Reducer ---
const initialState: GlobalState = {
  isLoaded: false,
  user: null,
  progress: false,
};

export const reducer = handle
  .reducer(initialState)
  .on(GlobalActions.loggedIn, (state, { user }) => {
    state.isLoaded = true;
    state.user = user == null ? null : { firebaseAuth: user, email: user.email! };
  })
  .on(GlobalActions.logout, state => {
    state.user = null;
  })
  .on(GlobalActions.progressShow, state => {
    state.progress = true;
  })
  .on(GlobalActions.progressHide, state => {
    state.progress = false;
  });

// --- Module ---
export const useGlobalModule = () => handle();
