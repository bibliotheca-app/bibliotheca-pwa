import { Route } from 'navi';
import { navigation } from 'bibliotheca/routes';
import { createEpic, createReducer, useModule } from 'typeless';
import * as Rx from 'typeless/rx';
import { MODULE, RouterActions, RouterLocation, RouterState } from './interface';

const toRouterLocation = (route: Route): RouterLocation => {
  const { url, state } = route;
  const requests = route.chunks.filter(chunk => chunk.request).map(chunk => chunk.request);
  const request = requests.length === 0 ? undefined : requests[requests.length - 1];
  return { url, state, request };
};

const emitLocationChageIfNeeded = (route: Route, fn: (location: RouterLocation) => void) => {
  if (route.type === 'ready') {
    fn(toRouterLocation(route));
  }
};

// --- Epic ---
export const epic = createEpic(MODULE)
  .on(
    RouterActions.$mounted,
    () =>
      new Rx.Observable(subscriber => {
        const emitter = (location: RouterLocation) =>
          subscriber.next(RouterActions.locationChange(location));
        emitLocationChageIfNeeded(navigation.getCurrentValue(), emitter);
        return navigation.subscribe(route => {
          emitLocationChageIfNeeded(route, emitter);
        });
      }),
  )
  .on(RouterActions.navigate, ({ url }) => {
    return Rx.fromPromise(navigation.navigate(url)).pipe(
      Rx.map(route => RouterActions.locationChange(toRouterLocation(route))),
    );
  });

// --- Reducer ---
const initialState: RouterState = {
  location: null,
  prevLocation: null,
};

export const reducer = createReducer(initialState).on(
  RouterActions.locationChange,
  (state, payload) => {
    state.prevLocation = state.location;
    state.location = payload;
  },
);

// --- Module ---
export const useRouterModule = () =>
  useModule({
    epic,
    reducer,
    reducerPath: ['router'],
    actions: RouterActions,
  });
