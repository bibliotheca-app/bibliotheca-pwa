import { Size, StyledLayer } from 'bibliotheca/components/StyledLayer';
import { Box, Button, Text } from 'grommet';
import React, { useState } from 'react';

interface Props {
  cancelButton: string;
  confirmButton: string;
  content: string;
  header?: string;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
  size?: Size;
  responsive?: boolean;
}

const Confirm: React.FC<Props> = ({
  cancelButton,
  confirmButton,
  content,
  header,
  onCancel,
  onConfirm,
  open,
  size,
  responsive,
}) => {
  if (!open) {
    return null;
  }

  return (
    <StyledLayer
      size={size || 'small'}
      onEsc={onCancel}
      onClickOutside={onCancel}
      responsive={responsive}
    >
      <Box pad="small" direction="column">
        {header && (
          <Box>
            <Text>{header}</Text>
          </Box>
        )}
        <Box>
          <Text>{content}</Text>
        </Box>
        <Box direction="row" justify="end" gap="small">
          <Button label={cancelButton} onClick={onCancel} />
          <Button label={confirmButton} onClick={onConfirm} />
        </Box>
      </Box>
    </StyledLayer>
  );
};

export type UseConfirmIn = Omit<Props, 'open'> & {
  responsive?: boolean;
};

interface UseConfirmOut {
  show: () => void;
  render: () => React.ReactNode;
}

export const useConfirm = (params: UseConfirmIn): UseConfirmOut => {
  const { onCancel, onConfirm, ...rest } = params;

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
