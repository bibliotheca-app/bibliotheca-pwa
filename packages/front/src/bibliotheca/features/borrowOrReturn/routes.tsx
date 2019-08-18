import { withAuthentication } from 'bibliotheca/routes';
import { mount, route } from 'navi';
import React from 'react';
import { BorrowOrReturnModule } from './module';
import { Dashboard } from 'bibliotheca/components/Dashboard';

// --- Routing ---
export default mount({
  '/': withAuthentication(
    route({
      title: '貸出/返却 - Bibliotheca',
      view: (
        <Dashboard>
          <BorrowOrReturnModule />
        </Dashboard>
      ),
    }),
  ),
});
