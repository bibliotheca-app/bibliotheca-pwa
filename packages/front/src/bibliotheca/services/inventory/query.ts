import { InventoryBook, Book, InventoryStatus } from 'bibliotheca/types';

export function findUncheckedOnlyList(inventoryBooks: InventoryBook[], booksInList: Book[]) {
  const checked = new Set(inventoryBooks.map(b => b.bookId));

  return booksInList
    .filter(b => !checked.has(b.id))
    .map(b => ({ status: 'unchecked' as InventoryStatus, ...b }));
}
