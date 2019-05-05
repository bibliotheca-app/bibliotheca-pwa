import * as functions from 'firebase-functions';
import { onBookListUpdateTime, onBookWrite } from './bookList';
import { onBookBorrowOrReturn } from './notify-slack';

export const updateBookList = functions
  .region('asia-northeast1')
  .firestore.document('books/{bookId}')
  .onWrite(onBookWrite);

export const buildBookList = functions
  .region('asia-northeast1')
  .pubsub.schedule('0 5 * * *')
  .timeZone('Asia/Tokyo')
  .onRun(onBookListUpdateTime);

export const notifySlack = functions
  .region('asia-northeast1')
  .firestore.document('books/{bookId}')
  .onUpdate(onBookBorrowOrReturn);
