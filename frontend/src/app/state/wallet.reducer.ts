import { createReducer, on } from '@ngrx/store';

import { WalletActions } from './wallet.actions';
import Wallet from '../models/wallet';

export const initialState: Wallet = { accounts: [] };

export const walletReducer = createReducer(
  initialState,
  on(WalletActions.retrievedAccount, (_wallet, { account }) => {
    let accounts = [..._wallet.accounts, account];
    return { accounts };
  })
);
