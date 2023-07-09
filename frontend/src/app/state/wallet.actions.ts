import { createActionGroup, props } from '@ngrx/store';

export const WalletActions = createActionGroup({
  source: 'Wallet',
  events: {
    'Retrieved Account': props<{ account: string }>(),
  },
});
