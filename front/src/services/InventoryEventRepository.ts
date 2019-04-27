import { endOfDay, startOfDay } from 'date-fns';
import { firestore } from 'firebase';
import * as R from 'remeda';
import { Book, InventoryEvent, InventoryEventBody } from 'src/types';

const inventoryEventFromDoc = (doc: firestore.DocumentSnapshot): InventoryEvent => {
  const data = doc.data()!;

  return {
    id: doc.id,
    date: data.date.toDate(),
    status: data.status,
  };
};

const toInventoryKey = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

export class InventoryEventRepository {
  private collection = this.db.collection('inventoryEvents');

  constructor(private db: firestore.Firestore) {}

  findAllEvents = async (): Promise<InventoryEvent[]> => {
    const querySnapshot = await this.collection.get();
    return querySnapshot.docs.map(inventoryEventFromDoc);
  };

  findInventoryEventByDate = async (date: Date) => {
    const querySnapshot = await this.collection
      .where('date', '>=', startOfDay(date))
      .where('date', '<', endOfDay(date))
      .get();
    return querySnapshot.docs.map(inventoryEventFromDoc);
  };

  createInventoryEvent = async () => {
    // todo: disallow to create when collection has 'doing' status event
    const e: InventoryEventBody = { date: new Date(), status: 'doing' };
    const eventRef = await this.collection.add(e);
    return eventRef.get().then(inventoryEventFromDoc);
  };

  addInventoriedItem = async (date: Date, book: Book) => {
    const bookData = R.omit(book, ['id']);
    await this.mkBookInventoryEventRefByDate(date)
      .collection('books')
      .doc(book.id)
      .set(bookData);
  };

  private mkBookInventoryEventRefByDate = (date: Date): firestore.DocumentReference =>
    this.collection.doc(toInventoryKey(date));
}
