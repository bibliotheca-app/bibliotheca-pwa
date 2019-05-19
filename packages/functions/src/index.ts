import * as functions from 'firebase-functions';
import { initOnBookListUpdateTime, initOnBookWrite } from './bookList';
import { onBookBorrowOrReturn } from './notify-slack';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export const updateBookList = functions
  .region('asia-northeast1')
  .firestore.document('books/{bookId}')
  .onWrite(initOnBookWrite(db));

export const buildBookList = functions
  .region('asia-northeast1')
  .pubsub.schedule('0 5 * * *')
  .timeZone('Asia/Tokyo')
  .onRun(initOnBookListUpdateTime(db));

export const notifySlack = functions
  .region('asia-northeast1')
  .firestore.document('books/{bookId}')
  .onUpdate(onBookBorrowOrReturn);
