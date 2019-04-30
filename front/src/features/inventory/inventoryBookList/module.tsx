import React from 'react';
import { RouterActions } from 'src/features/router/interface';
import { createEpic, createReducer, useModule } from 'typeless';
import * as Rx from 'typeless/rx';
import { InventoryBookModuleActions } from '../inventoryBookModule/interface';
import { useInventoryBookModule } from '../inventoryBookModule/module';
import { InventoryBookListView } from './components/InventoryBookListView';
import { InventoryBookListActions, InventoryBookListState, MODULE } from './interface';

// --- Epic ---
export const epic = createEpic(MODULE).on(InventoryBookListActions.$mounted, (_, { getState }) => {
  const location = getState().router.location!;
  const param = new URLSearchParams(location.search);
  const eventId = param.get('eventId');
  return !eventId
    ? Rx.of(RouterActions.locationChange({ ...location, pathname: '/' }))
    : Rx.of(InventoryBookModuleActions.setEventId(eventId));
});

// --- Reducer ---
const initialState: InventoryBookListState = {
  viewType: 'checkedOnly',
};

export const reducer = createReducer(initialState).on(
  InventoryBookListActions.changeView,
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
    reducerPath: ['inventoryBookList'],
    actions: InventoryBookListActions,
  });
  return <InventoryBookListView />;
};
