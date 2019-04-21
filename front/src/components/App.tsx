import { Grommet } from 'grommet';
import React, { useEffect } from 'react';
import * as R from 'remeda';
import { useBookModule } from 'src/features/book/module';
import { GlobalActions } from 'src/features/global/interface';
import { useGlobalModule } from 'src/features/global/module';
import { useRouterModule } from 'src/features/router/module';
import { authService } from 'src/services/ServiceContainer';
import { useActions, useMappedState } from 'typeless';
import { RouteResolver } from './RouteResolver';

export const App = () => {
  useRouterModule();
  useGlobalModule();
  useBookModule();
  const { loggedIn } = useActions(GlobalActions);
  useEffect(() => authService.subscribe(user => loggedIn(user)));
  const { isLoaded } = useMappedState(state =>
    R.pick(state.global, ['isLoaded'])
  );
  return <Grommet plain>{isLoaded && <RouteResolver />}</Grommet>;
};
