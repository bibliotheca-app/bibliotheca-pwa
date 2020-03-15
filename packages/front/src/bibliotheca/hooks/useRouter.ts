import { appHistory } from 'bibliotheca/services/appHistory';
import { useRouteMatch } from 'react-router-dom';

export const useRouter = <T>() => {
  const history = appHistory;

  const location = history.location;
  const { params } = useRouteMatch<T>();

  return {
    params,
    history,
    location,
  };
};
