import { authService } from 'bibliotheca/services/ServiceContainer';
import * as Rx from 'typeless/rx';
import { RouterActions } from '../router/interface';
import { GlobalActions, GlobalState, handle } from './interface';

// --- Epic ---
export const epic = handle.epic().on(GlobalActions.logout, () => {
  return Rx.concatObs(
    Rx.of(RouterActions.navigate('/login')),
    Rx.fromPromise(authService.logout()).pipe(Rx.ignoreElements()),
  );
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
