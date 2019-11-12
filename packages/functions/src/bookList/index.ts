import { DocumentSnapshot } from '@google-cloud/firestore';
import { Change, EventContext } from 'firebase-functions';
import { BookRepositoryForBatch } from 'shared/lib/cjs';

export function initOnBookWrite(bookRepository: BookRepositoryForBatch) {
  return async function onBookWrite(
    change: Change<DocumentSnapshot>,
    context: EventContext,
  ): Promise<void> {
    const bookId: string = context.params.bookId;

    // console.log(`change: ${JSON.stringify(change)}`);
    // console.log(`context: ${JSON.stringify(context)}`);

    // https://firebase.google.com/docs/firestore/quotas
    // max document size: 1,048,576 bytes

    const cachedBookEntries = await bookRepository.fetchCachedBookEntriesMapAsync();

    if (!change.before.exists) {
      console.log(`作成: ${bookId}`);
      await bookRepository.writeBookEntries([
        ...cachedBookEntries,
        { id: bookId, data: change.after.data() as any },
      ]);
    } else if (!change.after.exists) {
      console.log(`削除: ${bookId}`);
      await bookRepository.writeBookEntries(
        cachedBookEntries.filter(entry => {
          return entry.id !== bookId;
        }),
      );
    } else {
      console.log(`更新/上書き: ${bookId}`);
      await bookRepository.writeBookEntries(
        cachedBookEntries.map(entry => {
          if (entry.id !== bookId) {
            return entry;
          }
          return { id: bookId, data: change.after.data() as any };
        }),
      );
    }
  };
}

export function initOnBookListUpdateTime(bookRepository: BookRepositoryForBatch) {
  return async function onBookListUpdateTime(_: EventContext): Promise<void> {
    console.log('bookLists更新');
    await bookRepository.writeAllBook();
  };
}
