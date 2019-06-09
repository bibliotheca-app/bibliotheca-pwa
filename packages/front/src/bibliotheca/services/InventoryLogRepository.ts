import { InventoryEventLog, InventoryEventLogBody } from 'bibliotheca/types';
import { firestore } from 'firebase';

const inventoryEventFromDoc = (doc: firestore.DocumentSnapshot): InventoryEventLog => {
  const data = doc.data()!;

  return {
    id: doc.id,
    date: data.date.toDate(),
    status: data.status,
    books: data.books,
  };
};

export class InventoryLogRepository {
  private collection = this.db.collection('inventoryEventLogs');

  constructor(private db: firestore.Firestore) {}

  findAllEvents = async (): Promise<InventoryEventLog[]> => {
    const querySnapshot = await this.collection.get();
    return querySnapshot.docs.map(inventoryEventFromDoc);
  };

  add = async (log: InventoryEventLogBody) => {
    const ref = await this.collection.add(log);
    return ref.get().then(inventoryEventFromDoc);
  };
}
