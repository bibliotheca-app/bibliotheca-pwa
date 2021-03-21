import { InventoryEventLog, InventoryEventLogBody } from 'bibliotheca/types';
import firebase, { myFirestore } from 'firebase/app';

const inventoryEventFromDoc = (doc: firebase.firestore.DocumentSnapshot): InventoryEventLog => {
  const data = doc.data()!;

  return {
    id: doc.id,
    date: data.date.toDate(),
    status: data.status,
    books: data.books.map((b: any) => ({
      ...b,
      inventoriedAt: b.inventoriedAt ? b.inventoriedAt.toDate() : null,
      updatedAt: b.updatedAt ? b.updatedAt.toDate() : null,
      createdAt: b.createdAt ? b.createdAt.toDate() : null,
    })),
  };
};

export class InventoryLogRepository {
  private collection = this.db.collection('inventoryEventLogs');

  constructor(private db: firebase.firestore.Firestore) {}

  findAllEvents = async (): Promise<InventoryEventLog[]> => {
    const querySnapshot = await this.collection.get();
    return querySnapshot.docs.map(inventoryEventFromDoc);
  };

  findById = async (id: string): Promise<InventoryEventLog> => {
    return this.mkRefById(id).get().then(inventoryEventFromDoc);
  };

  add = async (log: InventoryEventLogBody) => {
    const ref = await this.collection.add(log);
    return ref.get().then(inventoryEventFromDoc);
  };

  private mkRefById = (id: string): myFirestore.DocumentReference => this.collection.doc(id);
}
