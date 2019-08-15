import { NaviRequest } from 'navi';

export const getDefaultRoute = () => {
  const isSmartphone = !!('ontouchstart' in window);

  return isSmartphone ? '/borrow-or-return' : '/books';
};

const loginPathRegex = /^\/login\/?/;

export const makeLoginUrlForRedirectFromRequest = (request: NaviRequest): string => {
  if (!request.mountpath || request.mountpath === '/login') {
    return '/login';
  }

  if (loginPathRegex.test(request.mountpath)) {
    return request.mountpath;
  }

  return '/login?redirectTo=' + encodeURIComponent(request.mountpath + request.search);
};

export const decideRedirectUrlFromRequest = (request: NaviRequest): string => {
  const redirectTo = request.params.redirectTo;

  return !redirectTo ? getDefaultRoute() : decodeURIComponent(redirectTo);
};
