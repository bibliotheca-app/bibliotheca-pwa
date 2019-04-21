import { Box, Button } from 'grommet';
import { Clear } from 'grommet-icons';
import React, { Suspense } from 'react';
import { ArrowDown, Camera } from 'react-feather';
import { Dashboard } from 'src/components/Dashboard';
import { userIdQuery } from 'src/features/global/query';
import { useActions, useMappedState } from 'typeless';
import { BarcodeLoadActions } from '../interface';
import { TargetBook } from './TargetBook';
import { Video } from './Video';

export const BarcodeLoadView = () => {
  const { isCameraEnabled, isCameraSupported, target, userId, isProcessingBook } = useMappedState(
    state => ({
      ...state.barcodeLoad,
      userId: userIdQuery(state.global),
    }),
  );
  const { enableCamera, disableCamela } = useActions(BarcodeLoadActions);

  if (!isCameraSupported) {
    return <div>Camera is not supported 😢</div>;
  }

  if (isCameraEnabled) {
    return (
      <Dashboard>
        <Box justify="center" align="center" fill>
          <Button label={<Clear />} onClick={disableCamela} />
          バーコード読み取り
          <Suspense fallback={<div>Loading...</div>}>
            <Video />
          </Suspense>
        </Box>
      </Dashboard>
    );
  }
  return (
    <Dashboard>
      <Box justify="center" align="center" fill>
        バーコード読み取り
        <div>
          <div>
            <ArrowDown size={35} />
          </div>
        </div>
        <Button label={<Camera />} onClick={enableCamera} />
        <div>
          <TargetBook target={target} userId={userId} isProcessingBook={isProcessingBook} />
        </div>
      </Box>
    </Dashboard>
  );
};
