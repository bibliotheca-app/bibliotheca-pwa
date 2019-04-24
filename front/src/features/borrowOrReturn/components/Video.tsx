import Quagga from 'quagga';
import React, { useEffect } from 'react';
import { useActions } from 'typeless';
import { BorrowOrReturnActions } from '../interface';

export const Video: React.FC = ({}) => {
  const { detectBarcode } = useActions(BorrowOrReturnActions);
  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: document.querySelector('#video'),
          constraints: {
            width: window.innerWidth - 40, // todo: calculate size from dom
            height: window.innerHeight - 200,
          },
        } as QuaggaJSConfigObject['inputStream'],
        numOfWorkers: 1,
        locate: true,
        decoder: {
          readers: ['ean_reader', 'ean_8_reader', 'upc_reader', 'code_128_reader'],
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
      },
    );
    return () => Quagga.stop();
  }, []);

  const style: React.CSSProperties = {
    textAlign: 'center',
  };
  return <div style={style} id="video" />;
};
