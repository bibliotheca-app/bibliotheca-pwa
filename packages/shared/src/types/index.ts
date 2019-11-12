export interface Book {
  id: string;
  isbn: string | null;
  title: string;
  borrowedBy: string | null;
  updatedAt: Date;
  createdAt: Date;
  deletedAt?: Date;
}

export type BookData = Omit<Book, 'id'>;

export interface BookEditData {
  id: string;
  isbn: string;
  title: string;
}
