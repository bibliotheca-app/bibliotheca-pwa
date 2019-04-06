import React from 'react';
import { RouteConfig } from 'src/types';
import { useActions } from 'typeless';
import { getDefaultRoute } from '../router/helper';
import { RouterActions } from '../router/interface';

// --- Routing ---
const Sample1Route = () => {
  const { replace } = useActions(RouterActions);
  replace(getDefaultRoute());
  return <></>;
};

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/',
  component: <Sample1Route />,
};
