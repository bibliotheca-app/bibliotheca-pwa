import { useBookModule } from 'bibliotheca/features/book/module';
import { GlobalActions } from 'bibliotheca/features/global/interface';
import { useGlobalModule } from 'bibliotheca/features/global/module';
import { useRouterModule } from 'bibliotheca/features/router/module';
import { authService } from 'bibliotheca/services/ServiceContainer';
import { Grommet } from 'grommet';
import React, { useEffect } from 'react';
import * as R from 'remeda';
import { useActions, useMappedState } from 'typeless';
import { RouteResolver } from './RouteResolver';

export const App = () => {
  useRouterModule();
  useGlobalModule();
  useBookModule();
  const { loggedIn } = useActions(GlobalActions);
  useEffect(() => authService.subscribe(user => loggedIn(user)));
  const { isLoaded } = useMappedState(state => R.pick(state.global, ['isLoaded']));
  return <Grommet plain>{isLoaded && <RouteResolver />}</Grommet>;
};
