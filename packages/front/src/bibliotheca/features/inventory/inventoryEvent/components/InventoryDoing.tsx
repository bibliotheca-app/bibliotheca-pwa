import { Link } from 'bibliotheca/components/Link';
import { StyledDataTable } from 'bibliotheca/components/StyledDataTable';
import { Book, InventoryStatus, InventoryStatusText, isBook } from 'bibliotheca/types';
import { Button, RadioButton, Text, Box } from 'grommet';
import React from 'react';
import { useActions } from 'typeless';
import { InventoryEventActions, ViewType } from '../interface';
import { FormCheckmark as FormCheckmarkIcon, FormClose as FormCloseIcon } from 'grommet-icons';

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
  const { changeView, toMissingAll, submitInventory, changeStatus } = useActions(
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
        ]}
        sortable
      />
    </>
  );
};
