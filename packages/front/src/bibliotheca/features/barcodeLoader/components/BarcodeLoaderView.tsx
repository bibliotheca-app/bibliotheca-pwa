import { Box, Button } from 'grommet';
import { Clear } from 'grommet-icons';
import { Suspense } from 'react';
import { ArrowDown, Camera } from 'react-feather';
import { useActions } from 'typeless';
import { BarcodeLoaderActions, getBarcodeLoaderState } from '../interface';
import { Video } from './Video';

export const BarcodeLoaderView = () => {
  const { isCameraEnabled, isCameraSupported } = getBarcodeLoaderState.useState();
  const { enableCamera, disableCamela } = useActions(BarcodeLoaderActions);

  if (!isCameraSupported) {
    return (
      <div>
        Camera is not supported{' '}
        <span role="img" aria-label="cry">
          😢
        </span>
      </div>
    );
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
