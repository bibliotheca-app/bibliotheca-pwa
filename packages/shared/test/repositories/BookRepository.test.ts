import { Book, BookRepository } from '../../src';
import { FirestoreTestProvider } from '../helpers';

let provider: FirestoreTestProvider = null!;
let bookRepository: BookRepository = null!;

beforeEach(async () => {
  provider = new FirestoreTestProvider('test');
  bookRepository = new BookRepository(
    provider.getFirestoreWithAuth({ uid: 'xx', email: 'a@opt.ne.jp' }),
  );
});
afterEach(async () => {
  await provider.cleanup();
});

function addBook(book: Partial<Book>) {
  return bookRepository.collection.add(book);
}

describe('findAllBooks', () => {
  it('should get all books', async () => {
    const b: Partial<Book> = {
      title: 't',
      updatedAt: new Date(),
      createdAt: new Date(),
      isbn: '1234',
    };
    await addBook(b);

    const actual = await bookRepository.findAllBooks();
    expect(actual).toMatchObject([b]);
  });
});
