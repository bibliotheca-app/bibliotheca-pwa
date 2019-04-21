import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

type Book = { createdAt: Date };
type BookEntry = { id: string; data: Book };

const fetchFreshBookEntriesAsync = async (): Promise<BookEntry[]> => {
  const qs = await db
    .collection('books')
    .orderBy('createdAt')
    .get();
  return qs.docs.map(doc => ({ id: doc.id, data: doc.data() as any }));
};

const fetchCachedBookEntriesMapAsync = async (): Promise<BookEntry[]> => {
  const doc = await db
    .collection('bookLists')
    .doc('0') // 未来でページングするかも
    .get();
  const data = doc.data();
  return !data ? [] : (data as any).entries;
};

const writeBookEntries = async (bookEntries: BookEntry[]) => {
  return db
    .collection('bookLists')
    .doc('0')
    .set({ entries: bookEntries || [] });
};

export const updateBookList = functions
  .region('asia-northeast1')
  .firestore.document('books/{bookId}')
  .onWrite(async (change, context) => {
    const bookId: string = context.params.bookId;

    // console.log(`change: ${JSON.stringify(change)}`);
    // console.log(`context: ${JSON.stringify(context)}`);

    // https://firebase.google.com/docs/firestore/quotas
    // max document size: 1,048,576 bytes

    const cachedBookEntries = await fetchCachedBookEntriesMapAsync();

    if (!change.before.exists) {
      console.log(`作成: ${bookId}`);
      return writeBookEntries([
        ...cachedBookEntries,
        { id: bookId, data: change.after.data() as any },
      ]);
    } else if (!change.after.exists) {
      console.log(`削除: ${bookId}`);
      return writeBookEntries(
        cachedBookEntries.filter(entry => {
          return entry.id !== bookId;
        }),
      );
    } else {
      console.log(`更新/上書き: ${bookId}`);
      return writeBookEntries(
        cachedBookEntries.map(entry => {
          if (entry.id !== bookId) {
            return entry;
          }
          return { id: bookId, data: change.after.data() as any };
        }),
      );
    }
  });

export const buildBookList = functions
  .region('asia-northeast1')
  .pubsub.schedule('0 5 * * *')
  .timeZone('Asia/Tokyo')
  .onRun(async _context => {
    console.log('bookLists更新');
    const bookEntries = await fetchFreshBookEntriesAsync();
    return writeBookEntries(bookEntries);
  });
