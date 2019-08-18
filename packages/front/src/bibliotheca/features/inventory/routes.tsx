import { withAuthentication } from 'bibliotheca/routes';
import { mount, route } from 'navi';
import React from 'react';
import { InventoryEventModule } from './inventoryEvent/module';
import { RegisterInventoryBookModule } from './inventoryEvent/registerInventoryBook/module';
import { InventoryEventLogModule } from './inventoryEventLog/module';

// --- Routing ---
export default withAuthentication(
  mount({
    '/': route({
      title: '棚卸し - Bibliotheca',
      view: <InventoryEventModule />,
    }),
    '/logs': route({
      title: '棚卸し一覧 - Bibliotheca',
      view: <InventoryEventLogModule />,
    }),
    '/register-book': route({
      title: '棚卸し - Bibliotheca',
      view: <RegisterInventoryBookModule />,
    }),
  }),
);
