import { createActionGroup, props } from '@ngrx/store';

export const WalletActions = createActionGroup({
  source: 'Wallet',
  events: {
    'Retrieved Accounts': props<{ accounts: string[] }>(),
    'Retrieved Account': props<{ account: string }>(),
    'Set Active Account': props<{ account: string }>(),
  },
});
