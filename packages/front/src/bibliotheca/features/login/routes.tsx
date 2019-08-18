import { withRedirectIfLoggedIn } from 'bibliotheca/routes';
import { mount, route } from 'navi';
import React from 'react';
import { LoginModule } from './module';

// --- Routing ---
export default mount({
  '/': withRedirectIfLoggedIn(
    route({
      title: 'ログイン - Bibliotheca',
      view: <LoginModule />,
    }),
  ),
});
