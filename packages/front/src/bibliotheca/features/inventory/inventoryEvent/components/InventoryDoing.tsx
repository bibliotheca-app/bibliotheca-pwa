import { Link } from 'bibliotheca/components/Link';
import { StyledDataTable } from 'bibliotheca/components/StyledDataTable';
import { Book, InventoryStatus, InventoryStatusText } from 'bibliotheca/types';
import { Box, Button, RadioButton, Text } from 'grommet';
import { FormCheckmark as FormCheckmarkIcon, FormClose as FormCloseIcon } from 'grommet-icons';
import React from 'react';
import { useActions } from 'typeless';
import { InventoryEventActions, ViewType } from '../interface';
import { InventorySubmitButton } from './InventorySubmitButton';
import format from 'date-fns/format';

export type BookForTable = Book & {
  status: InventoryStatus;
  inventoriedBy?: string;
  inventoriedAt?: Date;
  key: number;
};
type InventoryEventDoingProps = {
  canChangeMissingAll: boolean;
  canEndInventory: boolean;
  books: BookForTable[];
  viewType: ViewType;
};

export const InventoryDoing = ({
  canChangeMissingAll,
  canEndInventory,
  viewType,
  books,
}: InventoryEventDoingProps) => {
  const { changeView, toMissingAll, changeStatus } = useActions(InventoryEventActions);

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
      <InventorySubmitButton canEndInventory={canEndInventory}></InventorySubmitButton>
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
            render: (book: BookForTable) => {
              return (
                <Link href={`/books/${book.id}`}>
                  <Text>{book.title}</Text>
                </Link>
              );
            },
          },
          { property: 'isbn', header: 'ISBN' },
          {
            property: 'status',
            header: '棚卸しステータス',
            render: (book: BookForTable) => {
              return (
                <Text color={book.status === 'missing' ? 'status-critical' : ''}>
                  {InventoryStatusText[book.status]}
                </Text>
              );
            },
          },
          {
            property: '',
            header: '操作',
            render: (book: BookForTable) => {
              return (
                <Box gap="xsmall" direction="row">
                  <Button
                    icon={<FormCheckmarkIcon />}
                    plain={false}
                    disabled={book.status === 'checked'}
                    onClick={() => changeStatus(book, 'checked')}
                  />
                  <Button
                    icon={<FormCloseIcon />}
                    plain={false}
                    disabled={book.status === 'missing'}
                    onClick={() => changeStatus(book, 'missing')}
                  />
                </Box>
              );
            },
          },
          {
            property: 'borrowedBy',
            header: '借りてる人',
            render: (book: Partial<Book>) => book.borrowedBy,
          },
          {
            property: 'inventoriedBy',
            header: '棚卸した人',
            render: (book: Partial<BookForTable>) => {
              return book.inventoriedBy;
            },
          },
          {
            property: 'inventoriedAt',
            header: '棚卸した日時',
            render: (book: Partial<BookForTable>) => {
              return book.inventoriedAt ? format(book.inventoriedAt, 'YYYY/MM/DD hh:mm') : '-';
            },
          },
        ]}
        sortable
      />
    </>
  );
};
