import { RouteEntry } from 'bibliotheca/types';
import { createBrowserNavigation, map, Matcher, mount, redirect, Navigation } from 'navi';
import { getGlobalState } from './features/global/interface';
import {
  decideRedirectUrlFromRequest,
  getDefaultRoute,
  makeLoginUrlForRedirectFromRequest,
} from './features/router/helper';

const staticRoute: Record<string, Matcher<any>> = {
  '/': redirect(getDefaultRoute()),
};

export const resolveRoutes = () => {
  const req = require.context('./features', true, /interface.tsx?$/);
  const targetModules = req.keys().map(key => req(key));
  const matcherEntry = targetModules.reduce((acc, module) => {
    const routeEntry: RouteEntry | undefined = module.routeEntry;

    if (!routeEntry) {
      return acc;
    }

    return { ...acc, ...{ [routeEntry.path]: routeEntry.routes } };
  }, {});

  return mount({ ...matcherEntry, ...staticRoute });
};

let navigation: Navigation;
export const getNavigation = () => {
  if (navigation) {
    return navigation;
  }
  navigation = createBrowserNavigation({ routes: resolveRoutes() });
  return navigation;
};

export function withAuthentication(matcher: Matcher<any, any>) {
  return map(request => {
    const { user } = getGlobalState();
    return user ? matcher : redirect(makeLoginUrlForRedirectFromRequest(request));
  });
}

export const withRedirectIfLoggedIn = (matcher: Matcher<any, any>) => {
  return map(request => {
    const { user } = getGlobalState();
    return user ? redirect(decideRedirectUrlFromRequest(request)) : matcher;
  });
};
