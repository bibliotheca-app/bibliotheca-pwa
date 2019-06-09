import { BookDataViewTable } from 'bibliotheca/components/BookDataTable';
import { BarcodeLoaderView } from 'bibliotheca/features/barcodeLoader/components/BarcodeLoaderView';
import { Book } from 'bibliotheca/types';
import { Button } from 'grommet';
import React from 'react';

export const RegistrationFromCamera = (props: {
  targetBook?: Book;
  checkedAll: boolean;
  submit: () => void;
}) => {
  const label = props.checkedAll ? 'この書籍は全てチェック済みです' : 'チェックする';
  return (
    <>
      <BarcodeLoaderView />
      {props.targetBook ? (
        <>
          <BookDataViewTable book={props.targetBook} />
          <Button
            type="button"
            fill
            primary
            label={label}
            disabled={props.checkedAll}
            onClick={props.submit}
          />
        </>
      ) : null}
    </>
  );
};
