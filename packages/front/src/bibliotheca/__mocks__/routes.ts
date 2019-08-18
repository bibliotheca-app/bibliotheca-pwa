import { createMemoryNavigation } from 'navi';

const actualRoutes = jest.requireActual('bibliotheca/routes');

const { resolveRoutes } = actualRoutes;

const mock = {
  ...actualRoutes,
  getNavigation: () => createMemoryNavigation({ routes: resolveRoutes(), url: '/' }),
};

export {};

module.exports = mock;
