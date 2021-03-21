import LinearProgress from '@material/react-linear-progress';
import '@material/react-linear-progress/dist/linear-progress.css';
import { Delay } from 'bibliotheca/components/Delay';
import { useLoadingRoute } from 'react-navi';
import { getGlobalState } from '../interface';

export const Progress = () => {
  const { progress } = getGlobalState.useState();
  const loadingRoute = useLoadingRoute();

  return progress || loadingRoute ? (
    <Delay wait={1000}>
      <LinearProgress indeterminate />
    </Delay>
  ) : null;
};
