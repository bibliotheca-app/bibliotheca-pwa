import React, { useState } from 'react';
import { UseConfirmIn, useConfirm } from './useConfirm';

type UseConfirmWithDataIn<Data extends object> = Omit<UseConfirmIn, 'onCancel' | 'onConfirm'> & {
  onCancel: (data: Data) => void;
  onConfirm: (data: Data) => void;
};

interface UseConfirmWithDataOut<Data extends object> {
  show: (data: Data) => void;
  render: () => React.ReactNode;
}

export const useConfirmWithData = <Data extends object = {}>(
  props: UseConfirmWithDataIn<Data>,
): UseConfirmWithDataOut<Data> => {
  const { onCancel, onConfirm, ...rest } = props;

  const [data, setData] = useState<Data>({} as Data);

  const onCancelInHook = () => onCancel(data);
  const onConfirmInHook = () => onConfirm(data);

  const { show: innerShow, render } = useConfirm({
    ...rest,
    onCancel: onCancelInHook,
    onConfirm: onConfirmInHook,
  });

  return {
    show: (data: Data) => {
      setData(data);
      innerShow();
    },
    render,
  };
};
