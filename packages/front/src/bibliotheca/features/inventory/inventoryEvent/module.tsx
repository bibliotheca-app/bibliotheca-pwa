import React from 'react';
import { createEpic, createReducer, useModule } from 'typeless';
import { useInventoryBookModule } from '../inventoryBookModule/module';
import { InventoryEventView } from './components/InventoryEventView';
import { InventoryEventActions, InventoryEventState, MODULE } from './interface';

// --- Epic ---
export const epic = createEpic(MODULE);
// --- Reducer ---
const initialState: InventoryEventState = {
  viewType: 'checkedOnly',
};

export const reducer = createReducer(initialState).on(
  InventoryEventActions.changeView,
  (state, { type }) => {
    state.viewType = type;
  },
);

// --- Module ---
export default () => {
  useInventoryBookModule();
  useModule({
    epic,
    reducer,
    reducerPath: ['InventoryEvent'],
    actions: InventoryEventActions,
  });
  return <InventoryEventView />;
};
