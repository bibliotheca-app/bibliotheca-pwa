import loadable, { LoadableComponent } from '@loadable/component';
import { AppContext, RouteEntry, ToStringObject, ToUnion } from 'bibliotheca/types';
import { createBrowserNavigation, map, Matcher, mount, Navigation, redirect } from 'navi';
import React from 'react';
import { Redirect } from 'react-router-dom';
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
  bookDetail: {
    path: '/books/:bookId',
    params: ['bookId'],
    title: '書籍詳細 - Bibliotheca',
    requiresAuth: true,
    Component: loadable(() =>
      import('bibliotheca/features/book/detail/module').then(m => ({
        default: m.BookDetailModule,
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

// route definition type
type RD = typeof appRouteDefinitions;
type Paths = {
  [K in keyof RD]: { path: ToUnion<RD[K]['path']> };
};
type Params = {
  [K in keyof RD]: RD[K] extends { params: infer V } ? { params: ToStringObject<ToUnion<V>> } : {};
};
type QueryParams = {
  [K in keyof RD]: RD[K] extends { queryParams: infer W }
    ? { queryParams: Partial<ToStringObject<ToUnion<W>>> }
    : {};
};

export type AppPaths = Paths[keyof Paths]['path'];
export type GetSourceFromPath<T extends AppPaths> = {
  [K in keyof RD]: RD[K] extends { path: T } ? Paths[K] & Params[K] & QueryParams[K] : never;
}[keyof RD];
export type GetOptionFromPath<T extends AppPaths> = {
  [K in keyof RD]: RD[K] extends { path: T } ? Params[K] & QueryParams[K] : never;
}[keyof RD];

// note: this is checking type of `RouteDefinitions`
type ValidateRouteDefinitions = RD extends RouteDefinitionsBase ? true : never;
export function validateRouteDefinitions(): ValidateRouteDefinitions {
  return true;
}
