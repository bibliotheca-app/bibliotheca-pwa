import {
  InventoryBook,
  InventoryEvent,
  InventoryEventDoing,
  InventoryEventStatus,
  isDoneEvent,
} from 'bibliotheca/types';
import firebase from 'firebase/app';

const inventoryEventFromDoc = (doc: firebase.firestore.DocumentSnapshot): InventoryEvent => {
  const data = doc.data()!;
  switch (data.status) {
    case InventoryEventStatus.Done:
      return { status: InventoryEventStatus.Done };

    case InventoryEventStatus.Doing:
      return {
        date: data.date.toDate(),
        status: InventoryEventStatus.Doing,
        inventoryBooks: data.inventoryBooks.map((b: any) => ({
          ...b,
          inventoriedAt: b.inventoriedAt ? b.inventoriedAt.toDate() : null,
        })),
      };

    default:
      throw new Error('Invalid field: `status` must be InventoryEventStatus');
  }
};

export class InventoryEventRepository {
  private collection = this.db.collection('inventoryEvent');
  private eventRef = this.collection.doc('event');
  constructor(private db: firebase.firestore.Firestore) {}

  get = async (): Promise<InventoryEvent> => {
    return this.eventRef.get().then(inventoryEventFromDoc);
  };

  start = async (): Promise<InventoryEvent> => {
    await this.db.runTransaction(async tx => {
      const presentEvent = await tx.get(this.eventRef).then(inventoryEventFromDoc);
      if (!isDoneEvent(presentEvent)) {
        throw new Error('Invalid update `InventoryEvent`: event has already started');
      }

      const newEvent: InventoryEventDoing = {
        inventoryBooks: [],
        status: InventoryEventStatus.Doing,
        date: new Date(),
      };
      tx.update(this.eventRef, newEvent);
      return;
    });
    return this.eventRef.get().then(inventoryEventFromDoc);
  };

  close = async () => {
    await this.db.runTransaction(async tx => {
      const presentEvent = await tx.get(this.eventRef).then(inventoryEventFromDoc);
      if (isDoneEvent(presentEvent)) {
        throw new Error('Invalid update `InventoryEvent`: inventory is already done');
      }
      // todo: throw if event.inventoryBooks's length is different from `books`

      // todo: insert eventlog and delete lost books
      tx.set(this.eventRef, { status: InventoryEventStatus.Done }, { merge: false });
      return;
    });
    return this.eventRef.get().then(inventoryEventFromDoc);
  };

  addInventoryBook = async (addition: InventoryBook | InventoryBook[]) => {
    await this.db.runTransaction(async tx => {
      const presentEvent = await tx.get(this.eventRef).then(inventoryEventFromDoc);
      if (isDoneEvent(presentEvent)) {
        throw new Error('Invalid update `InventoryEvent`: cannot add book when inventory is done');
      }
      // todo: throw if duplicate book id
      const inventoryBooks = [
        ...presentEvent.inventoryBooks,
        ...(Array.isArray(addition) ? addition : [addition]),
      ];
      const newEvent: Pick<InventoryEventDoing, 'inventoryBooks'> = {
        inventoryBooks,
      };
      tx.update(this.eventRef, newEvent);
      return;
    });
    return this.eventRef.get().then(inventoryEventFromDoc);
  };

  upsertInventoryBook = async (target: InventoryBook | InventoryBook[]) => {
    await this.db.runTransaction(async tx => {
      const presentEvent = await tx.get(this.eventRef).then(inventoryEventFromDoc);
      if (isDoneEvent(presentEvent)) {
        throw new Error('Invalid update `InventoryEvent`: cannot add book when inventory is done');
      }

      const targets = Array.isArray(target) ? target : [target];
      const addition = targets.filter(
        b => presentEvent.inventoryBooks.find(ib => ib.bookId === b.bookId) === undefined,
      );
      const updated = presentEvent.inventoryBooks.map(ib => {
        const t = targets.find(b => b.bookId === ib.bookId);
        if (t === undefined) {
          return ib;
        } else {
          return t;
        }
      });
      const inventoryBooks = [...updated, ...addition];
      const newEvent: Pick<InventoryEventDoing, 'inventoryBooks'> = {
        inventoryBooks,
      };
      tx.update(this.eventRef, newEvent);
      return;
    });
    return this.eventRef.get().then(inventoryEventFromDoc);
  };

  subscribeInventoryBooks = (observer: (event: InventoryEvent) => void) =>
    this.collection.onSnapshot(snapshot => {
      observer(snapshot.docs.map(inventoryEventFromDoc)[0]);
    });
}
