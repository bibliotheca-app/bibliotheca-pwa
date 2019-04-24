import { Box, Button } from 'grommet';
import { Clear } from 'grommet-icons';
import React, { Suspense } from 'react';
import { ArrowDown, Camera } from 'react-feather';
import { useActions, useMappedState } from 'typeless';
import { BarcodeLoaderActions } from '../interface';
import { Video } from './Video';

export const BarcodeLoaderView = () => {
  const { isCameraEnabled, isCameraSupported } = useMappedState(state => ({
    ...state.barcodeLoader,
  }));
  const { enableCamera, disableCamela } = useActions(BarcodeLoaderActions);

  if (!isCameraSupported) {
    return <div>Camera is not supported 😢</div>;
  }

  const loader = (
    <>
      <Button label={<Clear />} onClick={disableCamela} />
      <Suspense fallback={<div>Loading...</div>}>
        <Video />
      </Suspense>
    </>
  );
  const enabler = (
    <>
      <div>
        <div>
          <ArrowDown size={35} />
        </div>
      </div>
      <Button label={<Camera />} onClick={enableCamera} />
    </>
  );

  return (
    <Box justify="center" align="center" fill>
      バーコード読み取り
      {isCameraEnabled ? loader : enabler}
    </Box>
  );
};
