import { firestore } from 'firebase';
import * as R from 'remeda';
import { Book, InventoryBook, InventoryStatus } from 'src/types';
import { bookFromDoc } from './BookRepository';
import { InventoryEventRepository } from './InventoryEventRepository';

const inventoryBookFromDoc = (doc: firestore.DocumentSnapshot): InventoryBook => {
  const data = doc.data()!;

  return {
    ...bookFromDoc(doc),
    status: data.status,
  };
};

export class InventoryBookRepository {
  private collection = this.db.collection('inventoryEvents');

  constructor(
    private db: firestore.Firestore,
    private inventoryEventRepository: InventoryEventRepository,
  ) {}

  findAllInventoryBookByEventDate = async (eventDate: Date) => {
    const event = await this.inventoryEventRepository.findInventoryEventByDate(eventDate);
    return this.findAllInventoryBookByEventId(event.id);
  };

  findAllInventoryBookByEventId = async (eventId: string) => {
    const querySnapshot = await this.mkInventoryBookRefByEvent({ id: eventId })
      .collection('books')
      .get();
    return querySnapshot.docs.map(inventoryBookFromDoc);
  };

  addInventoriedItem = async (eventId: string, book: Book, status: InventoryStatus) => {
    const bookData = { ...R.omit(book, ['id', 'borrowedBy']), status };
    await this.mkInventoryBookRefByEvent({ id: eventId })
      .collection('books')
      .doc(book.id)
      .set(bookData);
  };

  private mkInventoryBookRefByEvent = (ev: { id: string }): firestore.DocumentReference =>
    this.collection.doc(ev.id);
}
