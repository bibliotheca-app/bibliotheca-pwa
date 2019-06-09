import { mount, route } from 'navi';
import React from 'react';
import { withAuthentication } from 'bibliotheca/routes';
import { AppContext } from 'bibliotheca/types';
import { BookListModule } from './bookList/module';
import { BookDetailModule } from './detail/module';
import { BookRegisterModule } from './register/module';

// --- Routing ---
export default withAuthentication(
  mount<AppContext>({
    '/': route({
      title: '書籍一覧 - Bibliotheca',
      view: <BookListModule />,
    }),
    '/:bookId': route({
      title: '書籍詳細 - Bibliotheca',
      view: <BookDetailModule />,
    }),
    '/register': route({
      title: '書籍登録 - Bibliotheca',
      view: <BookRegisterModule />,
    }),
  }),
);
