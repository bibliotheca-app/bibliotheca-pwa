import { authService } from 'bibliotheca/services/ServiceContainer';
import { createEpic, createReducer, useModule } from 'typeless';
import * as Rx from 'typeless/rx';
import { RouterActions } from '../router/interface';
import { GlobalActions, GlobalState, MODULE } from './interface';

// --- Epic ---
export const epic = createEpic(MODULE).on(GlobalActions.logout, () => {
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

export const reducer = createReducer(initialState)
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
export const useGlobalModule = () =>
  useModule({
    epic,
    reducer,
    reducerPath: ['global'],
    actions: GlobalActions,
  });
