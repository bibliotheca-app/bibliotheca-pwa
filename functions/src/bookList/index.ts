import * as admin from 'firebase-admin';
import { DocumentSnapshot } from '@google-cloud/firestore';
import { Change, EventContext } from 'firebase-functions';

type Book = { createdAt: Date };
type BookEntry = { id: string; data: Book };

const fetchFreshBookEntriesAsync = async (
  db: FirebaseFirestore.Firestore,
): Promise<BookEntry[]> => {
  const qs = await db
    .collection('books')
    .orderBy('createdAt')
    .get();
  return qs.docs.map(doc => ({ id: doc.id, data: doc.data() as any }));
};

const fetchCachedBookEntriesMapAsync = async (
  db: FirebaseFirestore.Firestore,
): Promise<BookEntry[]> => {
  const doc = await db
    .collection('bookLists')
    .doc('0') // 未来でページングするかも
    .get();
  const data = doc.data();
  return !data ? [] : (data as any).entries;
};

const writeBookEntries = async (db: FirebaseFirestore.Firestore, bookEntries: BookEntry[]) => {
  return db
    .collection('bookLists')
    .doc('0')
    .set({ entries: bookEntries || [] });
};
export const writeAllBook = async (db: FirebaseFirestore.Firestore) => {
  const bookEntries = await fetchFreshBookEntriesAsync(db);
  return writeBookEntries(db, bookEntries);
};

export async function onBookWrite(
  change: Change<DocumentSnapshot>,
  context: EventContext,
): Promise<void> {
  admin.initializeApp();
  const db = admin.firestore();
  const bookId: string = context.params.bookId;

  // console.log(`change: ${JSON.stringify(change)}`);
  // console.log(`context: ${JSON.stringify(context)}`);

  // https://firebase.google.com/docs/firestore/quotas
  // max document size: 1,048,576 bytes

  const cachedBookEntries = await fetchCachedBookEntriesMapAsync(db);

  if (!change.before.exists) {
    console.log(`作成: ${bookId}`);
    await writeBookEntries(db, [
      ...cachedBookEntries,
      { id: bookId, data: change.after.data() as any },
    ]);
  } else if (!change.after.exists) {
    console.log(`削除: ${bookId}`);
    await writeBookEntries(
      db,
      cachedBookEntries.filter(entry => {
        return entry.id !== bookId;
      }),
    );
  } else {
    console.log(`更新/上書き: ${bookId}`);
    await writeBookEntries(
      db,
      cachedBookEntries.map(entry => {
        if (entry.id !== bookId) {
          return entry;
        }
        return { id: bookId, data: change.after.data() as any };
      }),
    );
  }
}

export async function onBookListUpdateTime(_: EventContext): Promise<void> {
  admin.initializeApp();
  const db = admin.firestore();
  console.log('bookLists更新');
  await writeAllBook(db);
}
