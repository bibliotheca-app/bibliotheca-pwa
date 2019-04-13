import Quagga from 'quagga';
import React, { useEffect } from 'react';
import { useActions } from 'typeless';
import { BarcodeLoadActions } from '../interface';

export const Video: React.FC = ({}) => {
  const { detectBarcode } = useActions(BarcodeLoadActions);
  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: document.querySelector('#video'),
          constraints: {
            width: 640,
            height: 480,
          },
        } as QuaggaJSConfigObject['inputStream'],
        numOfWorkers: 1,
        locate: true,
        decoder: {
          readers: [
            'ean_reader',
            'ean_8_reader',
            'upc_reader',
            'code_128_reader',
          ],
        },
      },
      (err: any) => {
        if (err) {
          // tslint:disable-next-line:no-console
          console.log(err);
          return;
        }
        Quagga.start();
        Quagga.onDetected(detectBarcode);
      }
    );
    return () => Quagga.stop();
  }, []);

  const style: React.CSSProperties = {
    width: '160px',
  };
  return <div style={style} id="video" />;
};
