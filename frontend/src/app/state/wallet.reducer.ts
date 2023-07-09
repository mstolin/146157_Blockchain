import { createReducer, on } from '@ngrx/store';

import { WalletActions } from './wallet.actions';
import Wallet from '../models/wallet';

export const initialState: Wallet = { accounts: [], activeAccount: null };

export const walletReducer = createReducer(
  initialState,
  on(WalletActions.retrievedAccount, (_wallet, { account }) => {
    let accounts = [..._wallet.accounts, account];
    return { accounts , activeAccount: _wallet.activeAccount };
  }),
  on(WalletActions.setActiveAccount, (_wallet, { account }) => {
    return { accounts: _wallet.accounts, activeAccount: account }
  }),
);
