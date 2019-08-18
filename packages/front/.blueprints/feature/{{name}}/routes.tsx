import { withAuthentication } from 'bibliotheca/routes';
import { mount, route } from 'navi';
import React from 'react';
import { {{pascalCase name}}Module } from './module';
import { Dashboard } from 'bibliotheca/components/Dashboard';

export default mount({
  '/': withAuthentication(
    route({
      title: '{{pascalCase name}}',
      view: <Dashboard><{{pascalCase name }}Module /></Dashboard>,
    }),
  ),
});
