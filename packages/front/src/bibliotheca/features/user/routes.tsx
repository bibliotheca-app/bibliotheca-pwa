import { withAuthentication } from 'bibliotheca/routes';
import { mount, route } from 'navi';
import React from 'react';
import { UserModule } from './module';
import { Dashboard } from 'bibliotheca/components/Dashboard';

export default withAuthentication(
  mount({
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
