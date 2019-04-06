import { authService } from 'src/services/ServiceContainer';
import { createEpic, createReducer, useModule } from 'typeless';
import * as Rx from 'typeless/rx';
import { RouterActions } from '../router/interface';
import { GlobalActions, GlobalState, MODULE } from './interface';

// --- Epic ---
export const epic = createEpic(MODULE).on(GlobalActions.logout, () => {
  return Rx.concatObs(
    Rx.of(RouterActions.push('/login')),
    Rx.fromPromise(authService.logout()).pipe(Rx.ignoreElements())
  );
});

// --- Reducer ---
const initialState: GlobalState = {
  isLoaded: false,
  user: null,
};

export const reducer = createReducer(initialState)
  .on(GlobalActions.loggedIn, (state, { user }) => {
    state.isLoaded = true;
    state.user = user == null ? null : { firebaseAuth: user };
  })
  .on(GlobalActions.logout, state => {
    state.user = null;
  });

// --- Module ---
export const useGlobalModule = () =>
  useModule({
    epic,
    reducer,
    reducerPath: ['global'],
    actions: GlobalActions,
  });
