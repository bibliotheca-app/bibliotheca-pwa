import { withRedirectDefaultRouteIfLoggedIn } from 'bibliotheca/routes';
import { AppContext } from 'bibliotheca/types';
import { mount, route } from 'navi';
import React from 'react';
import { LoginModule } from './module';

// --- Routing ---
export default mount<AppContext>({
  '/': withRedirectDefaultRouteIfLoggedIn(
    route({
      title: 'ログイン - Bibliotheca',
      view: <LoginModule />,
    }),
  ),
});
