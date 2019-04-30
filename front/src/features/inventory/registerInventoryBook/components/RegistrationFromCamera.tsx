import { Button } from 'grommet';
import React from 'react';
import { BookDetail } from 'src/components/BookDetail';
import { BarcodeLoaderModule } from 'src/features/barcodeLoader/module';
import { useActions, useMappedState } from 'typeless';
import { RegisterInventoryBookActions } from '../interface';

export const RegistrationFromCamera = () => {
  const { registerBook } = useMappedState(state => state.registerInventoryBook);
  const { submit } = useActions(RegisterInventoryBookActions);

  return (
    <>
      <BarcodeLoaderModule />
      {registerBook ? (
        <>
          <BookDetail book={registerBook} />
          <Button type="button" primary label="登録" onClick={submit} />
        </>
      ) : null}
    </>
  );
};
