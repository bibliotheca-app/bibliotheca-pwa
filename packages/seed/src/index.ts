import * as admin from 'firebase-admin';
async function main() {
  const saPath = process.env.SEED_EXECUTOR_SA_PATH;
  if (!saPath) {
    throw new Error('`SEED_EXECUTOR_SA_PATH` must be set');
  }

  const serviceAccount = require(saPath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://bibliotheca-test.firebaseio.com',
  });
  const db = admin.firestore();
  await insertInventoryEvent(db);
  await insertBooks(db);
  // await read(db);
}

async function insertInventoryEvent(db: FirebaseFirestore.Firestore) {
  const ref = db.collection('inventoryEvent').doc('event');
  await ref.delete();
  await ref.set({ status: 'done' });
}

import { books } from './books-seed';

// for test
async function read(db: FirebaseFirestore.Firestore) {
  {
    const collection = db.collection('books');
    const booksSnapshot = await collection.get();
    const books = booksSnapshot.docs.map(d => {
      const data = d.data()!;
      return {
        id: d.id,
        ...data,
      };
    });
    console.log(JSON.stringify(books));
  }
  console.log('================================');
  {
    const collection = db.collection('bookLists');
    const bookListsSnapshot = await collection.doc('0').get();
    const books = bookListsSnapshot.data()!.entries.map((d: any) => {
      return {
        id: d.id,
        ...d.data,
      };
    });
    console.log(JSON.stringify(books));
  }
}
async function insertBooks(db: FirebaseFirestore.Firestore) {
  const collection = db.collection('books');
  {
    const batch = db.batch();
    const books = await collection.get();
    books.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  }

  const chunkedArray = <T>(array: T[], chunkSize: number): T[][] =>
    Array(Math.ceil(array.length / chunkSize))
      .fill(undefined)
      .map((_: any, index: number) => index * chunkSize)
      .map((begin: number) => array.slice(begin, begin + chunkSize));

  const promises = chunkedArray(books, 100).map(async books => {
    const batch = db.batch();

    books.forEach(book => batch.create(collection.doc(), book));

    await batch.commit();
  });
  await Promise.all(promises);
}

main().catch(e => console.log(e));
