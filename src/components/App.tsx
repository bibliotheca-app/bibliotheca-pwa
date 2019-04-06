import React, { useEffect } from 'react';
import * as R from 'remeda';
import useBookModule from 'src/features/book/module';
import { GlobalActions } from 'src/features/global/interface';
import { useGlobalModule } from 'src/features/global/module';
import { useRouterModule } from 'src/features/router/module';
import { authService } from 'src/services/ServiceContainer';
import { createGlobalStyle } from 'styled-components';
import { useActions, useMappedState } from 'typeless';
import { RouteResolver } from './RouteResolver';

const GlobalStyle = createGlobalStyle`
  *, ::after, ::before {
      box-sizing: border-box;
  }

  html, body, #app {
    height: 100%;
  }

  body {
    background-color: #f5f5f5;
    margin: 0;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
    font-size: 16px;
    font-weight: 400;
    line-height: 1.5;
    color: #212529;
  }
`;

export const App = () => {
  useRouterModule();
  useGlobalModule();
  useBookModule();
  const { loggedIn } = useActions(GlobalActions);
  useEffect(() => authService.subscribe(user => loggedIn(user)));
  const { isLoaded } = useMappedState(state =>
    R.pick(state.global, ['isLoaded'])
  );
  return (
    <>
      {isLoaded && <RouteResolver />}
      <GlobalStyle />
    </>
  );
};
