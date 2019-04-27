import { OpenBDBookResponse } from 'src/types';

class OpenBdRepository {
  private baseUrl = 'https://api.openbd.jp/v1';

  findBookByIsbn(isbn: string): Promise<OpenBDBookResponse> {
    const qs = `?isbn=${isbn}`;
    return fetch(`${this.baseUrl}/get${qs}`).then(r => r.json());
  }
}

export const openBdRepository = new OpenBdRepository();
