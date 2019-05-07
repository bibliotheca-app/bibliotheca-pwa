import { InventoryEventLog } from 'bibliotheca/types';
import { firestore } from 'firebase';

const inventoryEventFromDoc = (doc: firestore.DocumentSnapshot): InventoryEventLog => {
  const data = doc.data()!;

  return {
    id: doc.id,
    date: data.date.toDate(),
    status: data.status,
  };
};

export class InventoryLogRepository {
  private collection = this.db.collection('inventoryEvents');

  constructor(private db: firestore.Firestore) {}

  findAllEvents = async (): Promise<InventoryEventLog[]> => {
    const querySnapshot = await this.collection.get();
    return querySnapshot.docs.map(inventoryEventFromDoc);
  };
}
