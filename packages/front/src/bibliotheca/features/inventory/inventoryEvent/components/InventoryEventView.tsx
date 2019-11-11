import { Link } from 'bibliotheca/components/Link';
import { findUncheckedOnlyList } from 'bibliotheca/services/inventory/query';
import { InventoryEventDoing, InventoryEventStatus, InventoryStatus } from 'bibliotheca/types';
import React from 'react';
import { useMappedState } from 'typeless';
import { getInventoryBookModuleState } from '../../inventoryBookModule/interface';
import { getInventoryEventState } from '../interface';
import { InventoryDoing } from './InventoryDoing';
import { InventoryDone } from './InventoryDone';

export const InventoryEventView = () => {
  const states = useMappedState(
    [getInventoryBookModuleState, getInventoryEventState],
    ({ booksInList, event }, { viewType }) => {
      if (!event) return undefined;
      if (event.status === 'done') {
        return { eventStatus: event.status };
      }

      const uncheckedBooks = findUncheckedOnlyList(event.inventoryBooks, booksInList);
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
                return { status: 'unchecked' as InventoryStatus, ...b };
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
        eventStatus: event.status,
        viewType,
        books: books.map((b, i) => ({ ...b, key: i })),
        canChangeMissingAll,
      };
    },
  );

  let component: JSX.Element | string;
  if (states === undefined) {
    component = 'Loading...';
  } else {
    switch (states.eventStatus) {
      case InventoryEventStatus.Doing:
        const { eventStatus: _, ...props } = states;
        component = <InventoryDoing {...props} />;
        break;
      case InventoryEventStatus.Done:
        component = <InventoryDone />;
        break;
      default:
        throw new Error('unknown mode');
    }
  }
  return (
    <>
      <Link href="/inventory-event/logs">過去の棚卸し履歴</Link>
      {component}
    </>
  );
};
