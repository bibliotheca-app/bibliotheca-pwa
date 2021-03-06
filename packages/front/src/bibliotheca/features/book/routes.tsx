import { Dashboard } from 'bibliotheca/components/Dashboard';
import { withAuthentication } from 'bibliotheca/routes';
import { AppContext } from 'bibliotheca/types';
import { mount, route } from 'navi';
import { BookListModule } from './bookList/module';
import { BookDetailModule } from './detail/module';
import { BookRegisterModule } from './register/module';

// --- Routing ---
export default withAuthentication(
  mount<AppContext>({
    '/': route({
      title: '書籍一覧 - Bibliotheca',
      view: (
        <Dashboard>
          <BookListModule />
        </Dashboard>
      ),
    }),
    '/:bookId': route(async req => {
      return {
        title: '書籍詳細 - Bibliotheca',
        view: (
          <Dashboard>
            <BookDetailModule bookId={req.params.bookId} />
          </Dashboard>
        ),
      };
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
