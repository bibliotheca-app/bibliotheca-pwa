import { withAuthentication } from 'bibliotheca/routes';
import { mount, route } from 'navi';
import React from 'react';
import { ManagementModule } from './module';
import { Dashboard } from 'bibliotheca/components/Dashboard';

export default mount({
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
