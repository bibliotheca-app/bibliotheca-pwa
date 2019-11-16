import { firestore } from 'firebase-admin';
import { Change, EventContext } from 'firebase-functions';
import { BookRepositoryForBatch } from '../../../shared/lib/cjs';

/**
 * NOTE: max document size: 1,048,576 bytes
 * https://firebase.google.com/docs/firestore/quotas
 */
export function initOnBookWrite(bookRepository: BookRepositoryForBatch) {
  return async function onBookWrite(
    change: Change<firestore.DocumentSnapshot>,
    context: EventContext,
  ): Promise<void> {
    const bookId: string = context.params.bookId;

    if (!change.before.exists) {
      console.log(`作成: ${bookId}`);
      await bookRepository.addBookToCache({ id: bookId, data: change.after.data() as any });
    } else if (!change.after.exists) {
      console.log(`削除: ${bookId}`);
      await bookRepository.deleteBookFromCache(bookId);
    } else {
      console.log(`更新/上書き: ${bookId}`);
      await bookRepository.editBookInCache({ id: bookId, data: change.after.data() as any });
    }
  };
}

export function initOnBookListUpdateTime(bookRepository: BookRepositoryForBatch) {
  return async function onBookListUpdateTime(_: EventContext): Promise<void> {
    console.log('bookLists更新');
    await bookRepository.writeAllBook();
  };
}
