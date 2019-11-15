import * as admin from 'firebase-admin';
import { BookRepositoryForBatch } from 'shared/lib/cjs';
import { execSync } from 'child_process';

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

  console.log(execSync('yarn firebase firestore:delete --all-collections -y').toString());

  const db = admin.firestore();
  const bookRepository = new BookRepositoryForBatch(db);
  await insertInventoryEvent(db);
  await insertBooks(db);
  // await read(db);
  await bookRepository.writeAllBook();
  await insertInventoryEventLogs(db);
}

async function insertInventoryEvent(db: FirebaseFirestore.Firestore) {
  const ref = db.collection('inventoryEvent').doc('event');
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

async function insertInventoryEventLogs(db: FirebaseFirestore.Firestore) {
  // todo: insert seed data
  const collection = db.collection('inventoryEventLogs');
}

main().catch(e => console.log(e));
