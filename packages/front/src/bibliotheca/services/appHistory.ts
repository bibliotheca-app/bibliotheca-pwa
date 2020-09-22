import { AppPaths, GetOptionFromPath } from 'bibliotheca/routes';
import { LocationSource, LocationOption } from 'bibliotheca/types';
import { createBrowserHistory, History, LocationState } from 'history';
import { generatePath } from 'react-router-dom';

class AppHistory {
  constructor(private history: History<LocationState>) {}

  push(option: LocationSource): void;
  push<T extends AppPaths>(path: T, option?: GetOptionFromPath<T>): void;

  push(...[idOrOption, option]: [LocationSource] | [string, LocationOption]) {
    const href = this.createHref(
      typeof idOrOption === 'string' ? { path: idOrOption, ...option } : idOrOption,
    );
    this.history.push(href);
  }

  createHref({ path: pathSource, params, queryParams }: LocationSource): string {
    const path = params ? generatePath(pathSource, params) : pathSource;
    const search = queryParams ? `?${new URLSearchParams(queryParams).toString()}` : '';
    return `${path}${search}`;
  }

  toRouterProps() {
    return { history: this.history };
  }

  get location() {
    const { state, search, ...rest } = this.history.location;
    const searchParams = new URLSearchParams(search);
    const pathAfter = `${rest.pathname}${search}${rest.hash}`;
    return { ...rest, searchParams, pathAfter };
  }
}

export const appHistory = new AppHistory(createBrowserHistory());
