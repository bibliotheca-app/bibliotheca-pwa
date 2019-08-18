import { Link } from 'bibliotheca/components/Link';
import { StyledDataTable } from 'bibliotheca/components/StyledDataTable';
import { findUncheckedOnlyList } from 'bibliotheca/services/inventory/query';
import { InventoryEventDoing } from 'bibliotheca/types';
import { Button, RadioButton, Text } from 'grommet';
import React from 'react';
import { useActions, useMappedState } from 'typeless';
import { getInventoryBookModuleState } from '../../inventoryBookModule/interface';
import { getInventoryEventState, InventoryEventActions } from '../interface';

export const InventoryDoing = () => {
  const { changeView, toMissingAll, submitInventory } = useActions(InventoryEventActions);
  const { canChangeMissingAll, books, viewType } = useMappedState(
    [getInventoryBookModuleState, getInventoryEventState],
    ({ booksInList, event }, { viewType }) => {
      const uncheckedBooks = findUncheckedOnlyList(
        (event as InventoryEventDoing).inventoryBooks,
        booksInList,
      );
      const canChangeMissingAll = uncheckedBooks.length === 0;
      const books = ((e: InventoryEventDoing) => {
        switch (viewType) {
          case 'checkedOnly':
            return e.inventoryBooks.map(({ status, bookId }) => ({
              status,
              ...booksInList.find(b => b.id === bookId)!,
            }));
          case 'all':
            return booksInList.map(b => {
              const inventoryBook = e.inventoryBooks.find(ib => ib.bookId === b.id);
              if (inventoryBook) {
                return { status: inventoryBook.status, ...b };
              } else {
                return { status: 'unchecked', ...b };
              }
            });
          case 'uncheckedOnly': {
            return uncheckedBooks;
          }
          default:
            throw new Error('unknown mode');
        }
      })(event as InventoryEventDoing);
      return {
        viewType,
        books: books.map((b, i) => ({ ...b, key: i })),
        canChangeMissingAll,
      };
    },
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
          // todo: display borrowedBy
        ]}
        sortable
      />
    </>
  );
};
