import { useBookModule } from 'bibliotheca/features/book/module';
import { useGlobalModule } from 'bibliotheca/features/global/module';
import { useNotificationModule } from 'bibliotheca/features/notification/module';
import { useRouterModule } from 'bibliotheca/features/router/module';
import { navigation } from 'bibliotheca/routes';
import { Grommet } from 'grommet';
import { NotFoundError } from 'navi';
import React, { Suspense } from 'react';
import { NotFoundBoundary, Router, View } from 'react-navi';
import { Dashboard } from './Dashboard';
import { FullScreenSpinner } from './FullScreenSpinner';
import { getGlobalState } from 'bibliotheca/features/global/interface';

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
  children: React.ReactElement;
}
export const Layout: React.SFC<LayoutProps> = ({ children }: LayoutProps) => {
  const { user } = getGlobalState.useState();

  return !user ? (
    children
  ) : (
    <Grommet plain>
      <Dashboard>{children}</Dashboard>
    </Grommet>
  );
};
const NotFound = (_error: NotFoundError) => <>not found :cry:</>;

export const App = () => {
  useRouterModule();
  useGlobalModule();
  useBookModule();
  useNotificationModule();

  return (
    <Router navigation={navigation}>
      <Layout>
        <NotFoundBoundary render={NotFound}>
          <Suspense fallback={<FullScreenSpinner />}>
            <View />
          </Suspense>
        </NotFoundBoundary>
      </Layout>
    </Router>
  );
};
