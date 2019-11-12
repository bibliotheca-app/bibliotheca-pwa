import * as functions from 'firebase-functions';
import { initOnBookListUpdateTime, initOnBookWrite } from './bookList';
import { onBookBorrowOrReturn } from './notify-slack';
import * as admin from 'firebase-admin';
import { BookRepositoryForBatch } from 'shared/src';

admin.initializeApp();
const db = admin.firestore();
const bookRepository = new BookRepositoryForBatch(db);

export const updateBookList = functions
  .region('asia-northeast1')
  .firestore.document('books/{bookId}')
  .onWrite(initOnBookWrite(bookRepository));

export const buildBookList = functions
  .region('asia-northeast1')
  .pubsub.schedule('0 5 * * *')
  .timeZone('Asia/Tokyo')
  .onRun(initOnBookListUpdateTime(bookRepository));

export const notifySlack = functions
  .region('asia-northeast1')
  .firestore.document('books/{bookId}')
  .onUpdate(onBookBorrowOrReturn);
