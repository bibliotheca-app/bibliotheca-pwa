import { OpenBDBookResponse } from 'bibliotheca/types';
import { Isbn } from './Isbn';

class OpenBdRepository {
  private baseUrl = 'https://api.openbd.jp/v1';

  findBookByIsbn(isbn: string): Promise<OpenBDBookResponse> {
    return fetch(`${this.baseUrl}/get?isbn=${isbn}`).then(r => r.json());
  }

  coverUrl(isbn: string | null): string {
    const isbn13 = isbn === null ? null : Isbn.normalize(isbn);
    return isbn13 === null ? '' : `https://cover.openbd.jp/${isbn13}.jpg`;
  }
}

export const openBdRepository = new OpenBdRepository();
