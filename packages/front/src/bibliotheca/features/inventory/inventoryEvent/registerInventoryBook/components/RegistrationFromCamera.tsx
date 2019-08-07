import { BookDataViewTable } from 'bibliotheca/components/BookDataTable';
import { BarcodeLoaderModule } from 'bibliotheca/features/barcodeLoader/module';
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
      <BarcodeLoaderModule />
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
