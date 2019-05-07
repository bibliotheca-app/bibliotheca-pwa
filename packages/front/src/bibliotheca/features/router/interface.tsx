import { NaviRequest, URLDescriptor } from 'navi';
import { createActions } from 'typeless';

// --- Constants ---
export const MODULE = '@@router';

// --- Actions ---
export const RouterActions = createActions(MODULE, {
  $mounted: null,
  navigate: (url: RouterNavigation) => ({ payload: { url } }),
  locationChange: (data: RouterLocation) => ({ payload: data }),
});

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

declare module 'typeless/types' {
  export interface DefaultState {
    router: RouterState;
  }
}
