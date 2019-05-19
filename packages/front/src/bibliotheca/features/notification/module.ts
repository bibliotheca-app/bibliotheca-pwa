import * as Rx from 'bibliotheca/rx';
import { createEpic, createReducer, useModule } from 'typeless';
import { MODULE, NotificationActions, NotificationState } from './interface';

// --- Epic ---
export const epic = createEpic(MODULE).on(NotificationActions.notifyMessage, ({ message }) => {
  alert(message);
  return Rx.empty();
});

// --- Reducer ---
const initialState: NotificationState = {};

export const reducer = createReducer(initialState);

// --- Module ---
export const useNotificationModule = () => {
  useModule({
    epic,
    reducer,
    reducerPath: ['notification'],
    actions: NotificationActions,
  });
};
