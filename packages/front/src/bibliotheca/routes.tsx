import React from 'react';
import { AppContext, RouteEntry } from 'bibliotheca/types';
import { createBrowserNavigation, map, Matcher, mount, Navigation, redirect } from 'navi';
import { getGlobalState } from './features/global/interface';
import {
  decideRedirectUrlFromRequest,
  getDefaultRoute,
  makeLoginUrlForRedirectFromRequest,
} from './features/router/helper';

import loadable, { LoadableComponent } from '@loadable/component';
import { Merge, ToUnion, ToStringObject } from 'bibliotheca/types';
import { Redirect } from 'react-router-dom';

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
  return map<AppContext>(async (request, context) => {
    await context.isLoadedAsync;
    const { user } = getGlobalState();
    return user ? matcher : redirect(makeLoginUrlForRedirectFromRequest(request));
  });
}

export const withRedirectIfLoggedIn = (matcher: Matcher<any, any>) => {
  return map<AppContext>(async (request, context) => {
    await context.isLoadedAsync;
    const { user } = getGlobalState();
    return user ? redirect(decideRedirectUrlFromRequest(request)) : matcher;
  });
};

type RouteDefinitionsBase = {
  [key: string]: {
    readonly path: string | readonly string[];
    readonly title?: string;
    readonly params?: readonly string[];
    readonly queryParams?: readonly string[];
    readonly requiresAuth: boolean;
    readonly Component: LoadableComponent<unknown>;
  };
};

export const appRouteDefinitions = {
  home: {
    path: '/',
    requiresAuth: true,
    Component: loadable(() =>
      Promise.resolve({ default: () => <Redirect to={getDefaultRoute()}></Redirect> }),
    ),
  },
  bookLists: {
    path: '/books',
    title: '書籍一覧 - Bibliotheca',
    requiresAuth: true,
    Component: loadable(() =>
      import('bibliotheca/features/book/bookList/module').then(m => ({
        default: m.BookListModule,
      })),
    ) as LoadableComponent<unknown>,
  },
  login: {
    path: '/login',
    title: 'ログイン - Bibliotheca',
    queryParams: ['redirectTo'],
    requiresAuth: false,
    Component: loadable(() =>
      import('bibliotheca/features/login/module').then(m => ({ default: m.LoginModule })),
    ) as LoadableComponent<unknown>,
  },
} as const;

type RouteDefinitions = typeof appRouteDefinitions;
export type AppRoutePaths = {
  [K in keyof RouteDefinitions]: Merge<
    { path: ToUnion<RouteDefinitions[K]['path']> },
    RouteDefinitions[K] extends { params: infer V }
      ? { params: ToStringObject<ToUnion<V>> }
      : { params?: never },
    RouteDefinitions[K] extends { queryParams: infer W }
      ? { queryParams: Partial<ToStringObject<ToUnion<W>>> }
      : { queryParams?: never }
  >;
};

type ValidateRouteDefinitions = RouteDefinitions extends RouteDefinitionsBase ? true : never;

// note: this is checking type of `RouteDefinitions`
export function validateRouteDefinitions(): ValidateRouteDefinitions {
  return true;
}
