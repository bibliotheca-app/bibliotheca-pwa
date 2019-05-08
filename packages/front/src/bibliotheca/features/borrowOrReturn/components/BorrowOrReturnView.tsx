import { Dashboard } from 'bibliotheca/components/Dashboard';
import { BarcodeLoaderModule } from 'bibliotheca/features/barcodeLoader/module';
import { userIdQuery } from 'bibliotheca/features/global/query';
import { Box } from 'grommet';
import React from 'react';
import * as R from 'remeda';
import { useMappedState } from 'typeless';
import { TargetBook } from './TargetBook';

export const BorrowOrReturnView = () => {
  const { target, userId, isProcessingBook, isCameraEnabled } = useMappedState(state => ({
    ...R.pick(state.barcodeLoader, ['isCameraEnabled']),
    ...state.borrowOrReturn,
    userId: userIdQuery(state.global),
  }));
  return (
    <Dashboard>
      <BarcodeLoaderModule />
      {isCameraEnabled ? null : (
        <Box justify="center" align="center" fill>
          <div>
            <TargetBook target={target} userId={userId} isProcessingBook={isProcessingBook} />
          </div>
        </Box>
      )}
    </Dashboard>
  );
};
