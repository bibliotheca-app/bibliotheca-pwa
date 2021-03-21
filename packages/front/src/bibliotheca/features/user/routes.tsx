import { Dashboard } from 'bibliotheca/components/Dashboard';
import { withAuthentication } from 'bibliotheca/routes';
import { AppContext } from 'bibliotheca/types';
import { mount, route } from 'navi';
import { UserModule } from './module';

export default withAuthentication(
  mount<AppContext>({
    '/:userId': route({
      title: 'ユーザ - Bibliotheca',
      getView: req => (
        <Dashboard>
          <UserModule userId={req.params.userId} />
        </Dashboard>
      ),
    }),
  }),
);
