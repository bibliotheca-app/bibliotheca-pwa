import { withAuthentication } from 'bibliotheca/routes';
import { AppContext } from 'bibliotheca/types';
import { mount, route } from 'navi';
import React from 'react';
import { {{pascalCase name}}Module } from './module';

export default mount<AppContext>({
  '/': withAuthentication(
    route({
      title: '{{pascalCase name}}',
      view: <{{pascalCase name }}Module />,
    }),
  ),
});
