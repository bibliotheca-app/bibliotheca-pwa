import React, { Suspense } from 'react';
import { ArrowDown, Camera, Video } from 'react-feather';
import { Dashboard } from 'src/components/Dashboard';
import { useActions, useMappedState } from 'typeless';
import { BarcodeLoadActions } from '../interface';

export const BarcodeLoadView = () => {
  const { isCameraEnabled, isCameraSupported } = useMappedState(
    state => state.barcodeLoad
  );
  const { enableCamera } = useActions(BarcodeLoadActions);

  if (!isCameraSupported) {
    return <div>Camera is not supported 😢</div>;
  }

  if (isCameraEnabled) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Video />
      </Suspense>
    );
  }

  return (
    <Dashboard>
      <div className="cameraHandler__message">
        Enable your camera with the button below
        <br />
        <div className="cameraHandler__messageIcon">
          <ArrowDown size={35} />
        </div>
      </div>
      <button
        aria-label="Enable Camera"
        className="btn__round camera__enable"
        onClick={enableCamera}
      >
        <Camera />
      </button>
    </Dashboard>
  );
};
