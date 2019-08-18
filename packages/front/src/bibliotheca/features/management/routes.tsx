import { Dashboard } from 'bibliotheca/components/Dashboard';
import { withAuthentication } from 'bibliotheca/routes';
import { AppContext } from 'bibliotheca/types';
import { mount, route } from 'navi';
import React from 'react';
import { ManagementModule } from './module';

export default mount<AppContext>({
  '/': withAuthentication(
    route({
      title: 'Management',
      view: (
        <Dashboard>
          <ManagementModule />
        </Dashboard>
      ),
    }),
  ),
});
