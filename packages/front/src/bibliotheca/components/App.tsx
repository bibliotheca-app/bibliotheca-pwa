import { defer, Deffered } from 'bibliotheca/defer';
import { useBarcodeLoaderModule } from 'bibliotheca/features/barcodeLoader/module';
import { useBookModule } from 'bibliotheca/features/book/module';
import { getGlobalState, GlobalActions } from 'bibliotheca/features/global/interface';
import { useGlobalModule } from 'bibliotheca/features/global/module';
import { useNotificationModule } from 'bibliotheca/features/notification/module';
import { useRouterModule } from 'bibliotheca/features/router/module';
import { navigation } from 'bibliotheca/routes';
import { authService } from 'bibliotheca/services/ServiceContainer';
import { Grommet } from 'grommet';
import { NotFoundError } from 'navi';
import React, { Suspense, useEffect, useRef } from 'react';
import { NotFoundBoundary, Router, View } from 'react-navi';
import { useActions } from 'typeless';
import { Dashboard } from './Dashboard';
import { FullScreenSpinner } from './FullScreenSpinner';

const setGlobalValue = () => {
  if (process.env.NODE_ENV === 'production') {
    (window as any).__bibliotheca_version = {
      revision: process.env.REACT_APP_VERSION,
      branch: process.env.REACT_APP_BRANCH,
    };
  }
};
setGlobalValue();

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
  useBarcodeLoaderModule();

  const { loggedIn } = useActions(GlobalActions);
  useEffect(() => authService.subscribe(authUser => loggedIn(authUser)), [loggedIn]);

  const { isLoaded, user } = getGlobalState.useState();

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
