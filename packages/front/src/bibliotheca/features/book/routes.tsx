import { mount, route } from 'navi';
import React from 'react';
import { withAuthentication } from 'bibliotheca/routes';
import { BookListModule } from './bookList/module';
import { BookDetailModule } from './detail/module';
import { BookRegisterModule } from './register/module';
import { Dashboard } from 'bibliotheca/components/Dashboard';

// --- Routing ---
export default withAuthentication(
  mount({
    '/': route({
      title: '書籍一覧 - Bibliotheca',
      view: (
        <Dashboard>
          <BookListModule />
        </Dashboard>
      ),
    }),
    '/:bookId': route({
      title: '書籍詳細 - Bibliotheca',
      view: (
        <Dashboard>
          <BookDetailModule />
        </Dashboard>
      ),
    }),
    '/register': route({
      title: '書籍登録 - Bibliotheca',
      view: (
        <Dashboard>
          <BookRegisterModule />
        </Dashboard>
      ),
    }),
  }),
);
