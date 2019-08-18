import { authService } from 'bibliotheca/services/ServiceContainer';
import * as Rx from 'typeless/rx';
import { GlobalActions, GlobalState, handle } from './interface';
import { RouterActions } from '../router/interface';
import { getDefaultRoute } from '../router/helper';

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
  .on(GlobalActions.loggedIn, ({ user }) => {
    const route = user == null ? '/login' : getDefaultRoute();
    return RouterActions.navigate(route);
  })
  .on(GlobalActions.logout, () => {
    if (subscribe) subscribe();
    return Rx.from(authService.logout()).pipe(Rx.ignoreElements());
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
  .on(GlobalActions.progressShow, state => {
    state.progress = true;
  })
  .on(GlobalActions.progressHide, state => {
    state.progress = false;
  });

// --- Module ---
export const useGlobalModule = () => handle();
