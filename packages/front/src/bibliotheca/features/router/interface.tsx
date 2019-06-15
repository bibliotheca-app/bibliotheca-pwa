import { NaviRequest, URLDescriptor } from 'navi';
import { createModule } from 'typeless';
import { RouterSymbol } from './symbol';

// --- Actions ---
const modules = createModule(RouterSymbol)
  .withActions({
    $mounted: null,
    navigate: (url: RouterNavigation) => ({ payload: { url } }),
    locationChange: (data: RouterLocation) => ({ payload: data }),
  })
  .withState<RouterState>();

export const handle = modules[0];
export const RouterActions = modules[1];
export const getRouterState = modules[2];

// --- Types ---
export type RouterNavigation = string | Partial<URLDescriptor>;
export interface RouterLocation {
  url: URLDescriptor;
  state?: object;
  request?: NaviRequest;
}

export interface RouterState {
  location: RouterLocation | null;
  prevLocation: RouterLocation | null;
}
