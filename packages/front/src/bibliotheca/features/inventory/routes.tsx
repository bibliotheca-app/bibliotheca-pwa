import { Dashboard } from 'bibliotheca/components/Dashboard';
import { withAuthentication } from 'bibliotheca/routes';
import { AppContext } from 'bibliotheca/types';
import { mount, route } from 'navi';
import React from 'react';
import { InventoryEventModule } from './inventoryEvent/module';
import { RegisterInventoryBookModule } from './inventoryEvent/registerInventoryBook/module';
import { InventoryEventLogModule } from './inventoryEventLog/module';

// --- Routing ---
export default withAuthentication(
  mount<AppContext>({
    '/': route({
      title: '棚卸し - Bibliotheca',
      view: (
        <Dashboard>
          <InventoryEventModule />
        </Dashboard>
      ),
    }),
    '/logs': route({
      title: '棚卸し一覧 - Bibliotheca',
      view: (
        <Dashboard>
          <InventoryEventLogModule />
        </Dashboard>
      ),
    }),
    '/register-book': route({
      title: '棚卸し - Bibliotheca',
      view: (
        <Dashboard>
          <RegisterInventoryBookModule />
        </Dashboard>
      ),
    }),
  }),
);
