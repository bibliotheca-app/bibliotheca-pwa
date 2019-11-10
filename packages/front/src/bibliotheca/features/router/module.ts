import { getNavigation } from 'bibliotheca/routes';
import { Route } from 'navi';
import * as Rx from 'typeless/rx';
import { handle, RouterActions, RouterLocation, RouterState } from './interface';

const pick = (route: Route) => ({
  state: route.state,
  url: route.url,
});

const toRouterLocation = (route: Route): RouterLocation => {
  const requests = route.chunks
    .filter(chunk => chunk.type === 'view' && chunk.request)
    .map(chunk => chunk.request);
  const request = requests.length === 0 ? undefined : requests[requests.length - 1];
  return { ...pick(route), request };
};

const emitLocationChageIfNeeded = (route: Route, emitter: (location: RouterLocation) => void) => {
  if (route.type === 'ready') {
    emitter(toRouterLocation(route));
  }
};

// --- Epic ---
export const epic = handle
  .epic()
  .on(
    RouterActions.$mounted,
    () =>
      new Rx.Observable(subscriber => {
        const emitter = (location: RouterLocation) =>
          subscriber.next(RouterActions.locationChange(location));
        emitLocationChageIfNeeded(getNavigation().getCurrentValue(), emitter);
        return getNavigation().subscribe(route => {
          emitLocationChageIfNeeded(route, emitter);
        });
      }),
  )
  .on(RouterActions.navigate, ({ url }) => {
    getNavigation().navigate(url);
    return Rx.empty();
  });

// --- Reducer ---
const initialState: RouterState = {
  location: null,
  prevLocation: null,
};

export const reducer = handle
  .reducer(initialState)
  .on(RouterActions.locationChange, (state, payload) => {
    state.prevLocation = state.location;
    state.location = payload;
  });

// --- Module ---
export const useRouterModule = () => handle();
