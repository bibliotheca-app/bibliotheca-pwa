import React, { useState } from 'react';
import { Layer, Box, Text, Button } from 'grommet';
import { Omit } from 'bibliotheca/types';

interface Props {
  cancelButton: string;
  confirmButton: string;
  content: string;
  header?: string;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
}

const Confirm: React.FC<Props> = ({
  cancelButton,
  confirmButton,
  content,
  header,
  onCancel,
  onConfirm,
  open,
}) => {
  const [show, setShow] = useState(open);

  if (!show) {
    return null;
  }

  const closeLayer = () => setShow(false);

  const onCancelInLayer = () => {
    onCancel();
    closeLayer();
  };

  const onConfirmInLayer = () => {
    onConfirm();
    closeLayer();
  };

  return (
    <Layer onEsc={onCancelInLayer} onClickOutside={onCancelInLayer}>
      <Box direction="column">
        {header && (
          <Box>
            <Text>{header}</Text>
          </Box>
        )}
        <Box>
          <Text>{content}</Text>
        </Box>
        <Box direction="row" justify="end" gap="small">
          <Button label={cancelButton} onClick={onCancelInLayer} />
          <Button label={confirmButton} onClick={onConfirmInLayer} />
        </Box>
      </Box>
    </Layer>
  );
};

interface UseConfirmOut {
  show: () => void;
  render: () => React.ReactNode;
}

export const useConfirm = (props: Omit<Props, 'open'>): UseConfirmOut => {
  const { onCancel, onConfirm, ...rest } = props;

  const [show, setShow] = useState(false);

  const openConfirm = () => setShow(true);
  const closeConfirm = () => setShow(false);

  const onCancelInHook = () => {
    onCancel();
    closeConfirm();
  };

  const onConfirmInHook = () => {
    onConfirm();
    closeConfirm();
  };

  return {
    show: openConfirm,
    render: () => (
      <Confirm open={show} onCancel={onCancelInHook} onConfirm={onConfirmInHook} {...rest} />
    ),
  };
};
