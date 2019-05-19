import { defer, Deffered } from 'bibliotheca/defer';
import { useBookModule } from 'bibliotheca/features/book/module';
import { GlobalActions } from 'bibliotheca/features/global/interface';
import { useGlobalModule } from 'bibliotheca/features/global/module';
import { useRouterModule } from 'bibliotheca/features/router/module';
import { navigation } from 'bibliotheca/routes';
import { authService } from 'bibliotheca/services/ServiceContainer';
import { Grommet } from 'grommet';
import { NotFoundError } from 'navi';
import React, { Suspense, useEffect, useRef } from 'react';
import { NotFoundBoundary, Router, View } from 'react-navi';
import * as R from 'remeda';
import { useActions, useMappedState } from 'typeless';
import { Dashboard } from './Dashboard';
import { FullScreenSpinner } from './FullScreenSpinner';
import { useNotificationModule } from 'bibliotheca/features/notification/module';

interface LayoutProps {
  isLoggedIn: boolean;
  children: React.ReactElement;
}
const Layout: React.SFC<LayoutProps> = ({ isLoggedIn, children }: LayoutProps) =>
  !isLoggedIn ? (
    children
  ) : (
    <Grommet plain>
      <Dashboard>{children}</Dashboard>
    </Grommet>
  );

const NotFound = (_error: NotFoundError) => <>not found :cry:</>;

export const App = () => {
  useRouterModule();
  useGlobalModule();
  useBookModule();
  useNotificationModule();

  const { loggedIn } = useActions(GlobalActions);
  useEffect(() => authService.subscribe(authUser => loggedIn(authUser)), [loggedIn]);

  const { isLoaded, user } = useMappedState(state => ({
    ...R.pick(state.global, ['isLoaded']),
    ...R.pick(state.global, ['user']),
  }));

  const isLoadedAsyncRef = useRef<Deffered<void>>(defer());

  if (isLoaded) {
    isLoadedAsyncRef.current.resolve();
  }

  return (
    <Router
      navigation={navigation}
      context={{ user, isLoadedAsync: isLoadedAsyncRef.current.promise }}
    >
      <Layout isLoggedIn={!!user}>
        <NotFoundBoundary render={NotFound}>
          <Suspense fallback={<FullScreenSpinner />}>
            <View />
          </Suspense>
        </NotFoundBoundary>
      </Layout>
    </Router>
  );
};
