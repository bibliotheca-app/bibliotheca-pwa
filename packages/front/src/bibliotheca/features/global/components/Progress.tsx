import LinearProgress from '@material/react-linear-progress';
import '@material/react-linear-progress/dist/linear-progress.css';
import { Delay } from 'bibliotheca/components/Delay';
import React from 'react';
import { useLoadingRoute } from 'react-navi';
import { useMappedState } from 'typeless';

export const Progress = () => {
  const progress = useMappedState(state => state.global.progress);
  const loadingRoute = useLoadingRoute();

  return progress || loadingRoute ? (
    <Delay wait={1000}>
      <LinearProgress indeterminate />
    </Delay>
  ) : null;
};
