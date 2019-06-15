import { BarcodeLoaderView } from 'bibliotheca/features/barcodeLoader/components/BarcodeLoaderView';
import { getBarcodeLoaderState } from 'bibliotheca/features/barcodeLoader/interface';
import { getGlobalState } from 'bibliotheca/features/global/interface';
import { userIdQuery } from 'bibliotheca/features/global/query';
import { Box } from 'grommet';
import React from 'react';
import { useMappedState } from 'typeless';
import { getBorrowOrReturnState } from '../interface';
import { TargetBook } from './TargetBook';

export const BorrowOrReturnView = () => {
  const { target, userId, isProcessingBook, isCameraEnabled } = useMappedState(
    [getBorrowOrReturnState, getBarcodeLoaderState, getGlobalState],
    (borrowOrReturn, { isCameraEnabled }, global) => ({
      isCameraEnabled,
      ...borrowOrReturn,
      userId: userIdQuery(global),
    }),
  );
  return (
    <>
      <BarcodeLoaderView />
      {isCameraEnabled ? null : (
        <Box justify="center" align="center" fill>
          <div>
            <TargetBook target={target} userId={userId} isProcessingBook={isProcessingBook} />
          </div>
        </Box>
      )}
    </>
  );
};
