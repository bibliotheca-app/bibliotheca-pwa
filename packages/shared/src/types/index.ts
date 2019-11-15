import { myFirestore } from 'firebase';

export interface Book {
  id: string;
  isbn: string | null;
  title: string;
  borrowedBy: string | null;
  updatedAt: Date;
  createdAt: Date;
}

export type BookData = Omit<Book, 'id'>;

export interface DeletedBook {
  id: string;
  isbn: string | null;
  title: string;
  updatedAt: Date;
  createdAt: Date;
  deletedAt: Date;
}
export interface DeletedBookEntry {
  isbn: string | null;
  title: string;
  updatedAt: myFirestore.Timestamp;
  createdAt: myFirestore.Timestamp;
  deletedAt: myFirestore.Timestamp;
}

export interface BookEditData {
  id: string;
  isbn: string;
  title: string;
}
