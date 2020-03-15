import { createBrowserHistory, History, LocationState } from 'history';
import { AppRoutePaths } from 'bibliotheca/routes';
import { generatePath } from 'react-router-dom';

type PushOption = {
  path: History.Path;
  params?: { [paramName: string]: string | number | boolean | undefined } | undefined;
  queryParams?: Record<string, string>;
};
class AppHistory {
  constructor(private history: History<LocationState>) {}

  push(option: PushOption): void;
  push<T extends keyof AppRoutePaths>(identity: T, option: AppRoutePaths[T]): void;

  push(...[idOrOption, option]: [PushOption] | [string, PushOption]) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { path: pathSource, params, queryParams } =
      typeof idOrOption === 'string' ? option! : idOrOption;

    const path = params ? generatePath(pathSource, params) : pathSource;
    const search = queryParams ? `?${new URLSearchParams(queryParams).toString()}` : '';
    this.history.push(`${path}${search}`);
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
