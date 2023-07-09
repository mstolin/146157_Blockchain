import { createActionGroup, props } from '@ngrx/store';

export const ApplicationStateActions = createActionGroup({
  source: 'ApplicationState',
  events: {
    'Retrieved Accounts': props<{ accounts: string[] }>(),
  },
});
