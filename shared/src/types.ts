export interface Book {
  id: string;
  isbn: string | null;
  title: string;
  borrowedBy: string | null;
  updatedAt: Date;
  createdAt: Date;
  hoge: string;
}
