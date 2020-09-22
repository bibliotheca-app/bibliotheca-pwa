import { useBookModule } from 'bibliotheca/features/book/module';
import { useGlobalModule } from 'bibliotheca/features/global/module';
import { useNotificationModule } from 'bibliotheca/features/notification/module';
import { useRouterModule } from 'bibliotheca/features/router/module';
import { getNavigation, appRouteDefinitions } from 'bibliotheca/routes';
import { NotFoundError } from 'navi';
import React, { Suspense } from 'react';
import { NotFoundBoundary, Router, View } from 'react-navi';
import { FullScreenSpinner } from './FullScreenSpinner';
import { getGlobalState } from 'bibliotheca/features/global/interface';
import { Deffered, defer } from 'bibliotheca/defer';

import { Router as RRouter, Switch, Route, RouteProps, Redirect } from 'react-router-dom';
import { appHistory } from 'bibliotheca/services/appHistory';
import { useRouter } from 'bibliotheca/hooks/useRouter';
import { getDefaultRoute } from 'bibliotheca/features/router/helper';
import { useSelector } from 'typeless';
import { isLoggedInQuery } from 'bibliotheca/features/global/query';
import { Dashboard } from './Dashboard';

const setGlobalValue = () => {
  if (process.env.NODE_ENV === 'production') {
    (window as any).__bibliotheca_version = {
      revision: process.env.REACT_APP_VERSION,
      branch: process.env.REACT_APP_BRANCH,
    };
  }
};
setGlobalValue();

const NotFound = (_error: NotFoundError) => <>not found :cry:</>;

// todo: delete
export const App1 = () => {
  useRouterModule();
  useGlobalModule();
  useBookModule();
  useNotificationModule();

  const { isLoaded } = getGlobalState.useState();

  const isLoadedAsyncRef = React.useRef<Deffered<void>>(defer());
  if (isLoaded) {
    isLoadedAsyncRef.current.resolve();
  }
  return (
    <Router
      navigation={getNavigation()}
      context={{ isLoadedAsync: isLoadedAsyncRef.current.promise }}
    >
      <NotFoundBoundary render={NotFound}>
        <Suspense fallback={<FullScreenSpinner />}>
          <View />
        </Suspense>
      </NotFoundBoundary>
    </Router>
  );
};

const WithAuth: React.FC = ({ children }) => {
  const { location } = useRouter();

  const isLoggedIn = useSelector(isLoggedInQuery);

  if (isLoggedIn) {
    return <Dashboard>{children}</Dashboard>;
  }

  const login = `/login?${new URLSearchParams({ redirectTo: location.pathAfter }).toString()}`;
  return <Redirect to={login}></Redirect>;
};

// note: publicエンドポイントで常に強制リダイレクトしちゃう
const WithoutAuth: React.FC = ({ children }) => {
  const isLoggedIn = useSelector(isLoggedInQuery);
  const { location } = useRouter();

  if (!isLoggedIn) {
    return <>{children}</>;
  }

  const redirectTo = location.searchParams.get('redirectTo');

  const to = redirectTo === null ? getDefaultRoute() : decodeURIComponent(redirectTo);
  return <Redirect to={to}></Redirect>;
};

export const App: React.FC = () => {
  useGlobalModule();
  useBookModule();
  useNotificationModule();
  const { isLoaded } = getGlobalState.useState();

  const isLoadedAsyncRef = React.useRef<Deffered<void>>(defer());
  if (isLoaded) {
    isLoadedAsyncRef.current.resolve();
  }

  if (!isLoaded) {
    return <FullScreenSpinner />;
  }

  return (
    <RRouter {...appHistory.toRouterProps()}>
      <Switch>
        {Object.values(appRouteDefinitions).map(({ Component, path, requiresAuth }, key) => {
          const base: RouteProps & { key: React.Key } = {
            key,
            exact: true,
            sensitive: true,
            path: path as string | string[],
          };

          if (requiresAuth) {
            return (
              <Route {...base}>
                <WithAuth>
                  <Component></Component>
                </WithAuth>
              </Route>
            );
          } else {
            return (
              <Route {...base}>
                <WithoutAuth>
                  <Component></Component>
                </WithoutAuth>
              </Route>
            );
          }
        })}
        <Route>
          <>not found :cry:</>
        </Route>
      </Switch>
    </RRouter>
  );
};
