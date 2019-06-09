import { withAuthentication } from 'bibliotheca/routes';
import { AppContext } from 'bibliotheca/types';
import { mount, route } from 'navi';
import React from 'react';
import { UserModule } from './module';

export default withAuthentication(
  mount<AppContext>({
    '/:userId': route({
      title: 'ユーザ - Bibliotheca',
      getView: req => <UserModule userId={req.params.userId} />,
    }),
  }),
);
