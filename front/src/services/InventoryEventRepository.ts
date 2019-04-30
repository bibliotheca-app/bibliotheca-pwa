import { endOfDay, startOfDay } from 'date-fns';
import { firestore } from 'firebase';
import { InventoryEvent, InventoryEventBody, InventoryEventStatus } from 'src/types';

const inventoryEventFromDoc = (doc: firestore.DocumentSnapshot): InventoryEvent => {
  const data = doc.data()!;

  return {
    id: doc.id,
    date: data.date.toDate(),
    status: data.status,
  };
};

export class InventoryEventRepository {
  private collection = this.db.collection('inventoryEvents');

  constructor(private db: firestore.Firestore) {}

  findAllEvents = async (): Promise<InventoryEvent[]> => {
    const querySnapshot = await this.collection.get();
    return querySnapshot.docs.map(inventoryEventFromDoc);
  };

  findInventoryEventById = async (eventId: string) => {
    return this.collection
      .doc(eventId)
      .get()
      .then(inventoryEventFromDoc);
  };

  findInventoryEventByDate = async (date: Date): Promise<InventoryEvent> => {
    const querySnapshot = await this.collection
      .where('date', '>=', startOfDay(date))
      .where('date', '<', endOfDay(date))
      .get();

    // note: result must have only 1 item
    return querySnapshot.docs.map(inventoryEventFromDoc)[0];
  };
  findInventoryEventByStatus = async (status: InventoryEventStatus) => {
    const querySnapshot = await this.collection.where('status', '==', status).get();

    return querySnapshot.docs.map(inventoryEventFromDoc);
  };

  createInventoryEvent = async () => {
    const doingEvents = await this.findInventoryEventByStatus('doing');
    if (doingEvents.length > 0) {
      throw new Error('棚卸し中に新しい棚卸しは開始できません');
    }

    const e: InventoryEventBody = { date: new Date(), status: 'doing' };
    const ref = await this.collection.add(e);
    return ref.get().then(inventoryEventFromDoc);
  };
}
