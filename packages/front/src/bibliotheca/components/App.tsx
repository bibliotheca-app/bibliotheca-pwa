import { useBookModule } from 'bibliotheca/features/book/module';
import { useGlobalModule } from 'bibliotheca/features/global/module';
import { useNotificationModule } from 'bibliotheca/features/notification/module';
import { useRouterModule } from 'bibliotheca/features/router/module';
import { getNavigation } from 'bibliotheca/routes';
import { NotFoundError } from 'navi';
import { useRef, Suspense } from 'react';
import { NotFoundBoundary, Router, View } from 'react-navi';
import { FullScreenSpinner } from './FullScreenSpinner';
import { getGlobalState } from 'bibliotheca/features/global/interface';
import { Deffered, defer } from 'bibliotheca/defer';

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

export const App = () => {
  useRouterModule();
  useGlobalModule();
  useBookModule();
  useNotificationModule();

  const { isLoaded } = getGlobalState.useState();

  const isLoadedAsyncRef = useRef<Deffered<void>>(defer());
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
