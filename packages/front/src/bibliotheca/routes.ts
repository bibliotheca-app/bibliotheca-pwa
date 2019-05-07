import { createBrowserNavigation, map, Matcher, mount, redirect } from 'navi';
import { AppContext, RouteEntry } from 'src/types';

const req = require.context('./features', true, /interface.tsx?$/);

const resolveRoutes = () => {
  const targetModules = req.keys().map(key => req(key));
  const matcherEntry = targetModules.reduce((acc, module) => {
    const routeEntry: RouteEntry | undefined = module.routeEntry;

    if (!routeEntry) {
      return acc;
    }

    return { ...acc, ...{ [routeEntry.path]: routeEntry.routes } };
  }, {});

  return mount<AppContext>(matcherEntry);
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
