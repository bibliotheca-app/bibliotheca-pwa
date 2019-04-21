import React, { useEffect, useState } from 'react';
import * as R from 'remeda';
import { getDefaultRoute } from 'src/features/router/helper';
import { RouterActions, RouterLocation } from 'src/features/router/interface';
import { usePrevious } from 'src/hooks/usePrevious';
import { RouteConfig } from 'src/types';
import { useActions, useMappedState } from 'typeless';

// load dynamically all routes from all interfaces
const req = require.context('../features', true, /interface.tsx?$/);

const routes = R.flatMap(req.keys(), key => {
  const module = req(key);
  const items = Object.values(module);
  return items.filter((item: any) => item.type === 'route') as RouteConfig[];
});

function getMatch(loc: RouterLocation | null, isLogged: boolean) {
  if (!loc) {
    return null;
  }
  return routes.find(route => {
    if ((route.auth && !isLogged) || (!route.auth && isLogged)) {
      return false;
    }
    return route.path === loc.pathname;
  });
}

export const RouteResolver = () => {
  const { user, location } = useMappedState(state => ({
    ...R.pick(state.global, ['isLoaded', 'user']),
    ...R.pick(state.router, ['location']),
  }));
  const { push } = useActions(RouterActions);
  const [component, setComponent] = useState(<div />);

  const prevUser = usePrevious(user);

  useEffect(() => {
    let match = getMatch(location, !!user);
    if (match) {
      setComponent(match.component);
      return;
    }
    if (!prevUser && user) {
      // user is logging in
      // keep rendering current route if not found
      match = getMatch(location, !user);
      if (match) {
        setComponent(match.component);
      }
      return;
    }
    // not found route
    // you can display 404 or redirect to default routes
    push(user ? getDefaultRoute() : '/login');
  }, [location, user]);

  return component;
};