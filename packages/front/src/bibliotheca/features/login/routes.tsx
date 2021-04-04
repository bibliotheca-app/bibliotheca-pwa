import { withRedirectIfLoggedIn } from 'bibliotheca/routes';
import { AppContext } from 'bibliotheca/types';
import { mount, route } from 'navi';
import { LoginModule } from './module';

// --- Routing ---
export default mount<AppContext>({
  '/': withRedirectIfLoggedIn(
    route({
      title: 'ログイン - Bibliotheca',
      view: <LoginModule />,
    }),
  ),
});
