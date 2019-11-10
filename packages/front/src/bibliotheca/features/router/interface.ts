import { NaviRequest, URLDescriptor } from 'navi';
import { createModule } from 'typeless';
import { RouterSymbol } from './symbol';

// --- Actions ---
export const [handle, RouterActions, getRouterState] = createModule(RouterSymbol)
  .withActions({
    $mounted: null,
    navigate: (url: RouterNavigation) => ({ payload: { url } }),
    locationChange: (data: RouterLocation) => ({ payload: data }),
  })
  .withState<RouterState>();

// --- Types ---
export type RouterNavigation = string | Partial<URLDescriptor>;
export interface RouterLocation {
  request?: NaviRequest;
  state?: object;
  url: URLDescriptor;
}

export interface RouterState {
  location: RouterLocation | null;
  prevLocation: RouterLocation | null;
}
