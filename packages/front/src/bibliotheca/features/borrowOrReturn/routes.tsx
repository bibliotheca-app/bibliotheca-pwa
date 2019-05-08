import { mount, route } from 'navi';
import React from 'react';
import { withAuthentication } from 'bibliotheca/routes';
import { AppContext } from 'bibliotheca/types';
import { BorrowOrReturnModule } from './module';

// --- Routing ---
export default mount<AppContext>({
  '/': withAuthentication(
    route({
      title: '貸出/返却 - Bibliotheca',
      view: <BorrowOrReturnModule />,
    }),
  ),
});
