import { Link } from 'bibliotheca/components/Link';
import { StyledDataTable } from 'bibliotheca/components/StyledDataTable';
import { Book, InventoryStatus } from 'bibliotheca/types';
import { Button, RadioButton, Text } from 'grommet';
import React from 'react';
import { useActions } from 'typeless';
import { InventoryEventActions, ViewType } from '../interface';

type BookForTable = Book & { status: InventoryStatus; key: number };
type InventoryEventDoingProps = {
  canChangeMissingAll: boolean;
  books: BookForTable[];
  viewType: ViewType;
};

export const InventoryDoing = ({
  canChangeMissingAll,
  viewType,
  books,
}: InventoryEventDoingProps) => {
  const { changeView, toMissingAll, submitInventory, toCheckStatus } = useActions(
    InventoryEventActions,
  );

  return (
    <>
      <Link href={`/inventory-event/register-book`}>
        <Button label="本を棚卸す" />
      </Link>
      <Button
        label="未チェックを全て紛失ステータスへ変更する"
        disabled={canChangeMissingAll}
        onClick={toMissingAll}
      />
      <Button label="棚卸しを完了する" onClick={submitInventory} />
      <RadioButton
        label="棚卸し済のみ"
        name="viewType"
        value="checkedOnly"
        checked={viewType === 'checkedOnly'}
        onChange={() => changeView('checkedOnly')}
      />
      <RadioButton
        label="全て"
        name="viewType"
        value="all"
        checked={viewType === 'all'}
        onChange={() => changeView('all')}
      />
      <RadioButton
        label="未チェック"
        name="viewType"
        value="uncheckedOnly"
        checked={viewType === 'uncheckedOnly'}
        onChange={() => changeView('uncheckedOnly')}
      />
      <StyledDataTable
        size="large"
        primaryKey="key"
        data={books}
        columns={[
          {
            property: 'title',
            header: 'タイトル',
            search: true,
            render: (book: { id: string; title: string }) => {
              return (
                <Link href={`/books/${book.id}`}>
                  <Text>{book.title}</Text>
                </Link>
              );
            },
          },
          { property: 'isbn', header: 'ISBN' },
          // todo: localization status
          { property: 'status', header: '棚卸しステータス' },
          // todo: can change book status(`missing` or `checked`) from list
          {
            property: '',
            header: '操作',
            render: (book: Book) => {
              return <Button label="チェックする" onClick={() => toCheckStatus(book)}></Button>;
            },
          },
          // todo: display borrowedBy
        ]}
        sortable
      />
    </>
  );
};
