import { withAuthentication } from 'bibliotheca/routes';
import { mount, route } from 'navi';
import React from 'react';
import { ManagementModule } from './module';

export default mount({
  '/': withAuthentication(
    route({
      title: 'Management',
      view: <ManagementModule />,
    }),
  ),
});
