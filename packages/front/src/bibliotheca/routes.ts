import { AppContext, RouteEntry } from 'bibliotheca/types';
import { createBrowserNavigation, map, Matcher, mount, redirect } from 'navi';
import { getDefaultRoute } from './features/router/helper';

const staticRoute: Record<string, Matcher<AppContext>> = {
  '/': redirect(getDefaultRoute()),
};

const resolveRoutes = () => {
  const req = require.context('./features', true, /interface.tsx?$/);
  const targetModules = req.keys().map(key => req(key));
  const matcherEntry = targetModules.reduce((acc, module) => {
    const routeEntry: RouteEntry | undefined = module.routeEntry;

    if (!routeEntry) {
      return acc;
    }

    return { ...acc, ...{ [routeEntry.path]: routeEntry.routes } };
  }, {});

  return mount<AppContext>({ ...matcherEntry, ...staticRoute });
};

const routes = resolveRoutes();
export const navigation = createBrowserNavigation<AppContext>({ routes });

export function withAuthentication(matcher: Matcher<AppContext>) {
  return map<AppContext>(async (request, context) => {
    // wait for global state
    await context.isLoadedAsync;

    return context.user
      ? matcher
      : redirect('/login?redirectTo=' + encodeURIComponent(request.mountpath + request.search));
  });
}

export const withRedirectDefaultRouteIfLoggedIn = (matcher: Matcher<AppContext>) => {
  return map<AppContext>(async (_request, context) => {
    await context.isLoadedAsync;

    return context.user
      ? redirect(getDefaultRoute())
      : matcher
  });
}
