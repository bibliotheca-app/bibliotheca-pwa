import { createBrowserHistory, History, LocationState } from 'history';
import { AppRoutePaths } from 'bibliotheca/routes';
import { generatePath } from 'react-router-dom';
import { PushOption } from 'bibliotheca/types';

class AppHistory {
  constructor(private history: History<LocationState>) {}

  push(option: PushOption): void;
  push<T extends keyof AppRoutePaths>(identity: T, option: AppRoutePaths[T]): void;

  push(...[idOrOption, option]: [PushOption] | [string, PushOption]) {
    const href = this.createHref(typeof idOrOption === 'string' ? option! : idOrOption);
    this.history.push(href);
  }

  createHref({ path: pathSource, params, queryParams }: PushOption): string {
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
