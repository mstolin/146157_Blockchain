import { createReducer, on } from '@ngrx/store';

import { WalletActions } from './wallet.actions';
import Wallet from '../models/wallet';

export const initialState: Wallet = { accounts: [], activeAccount: null, publicKey: null };

export const walletReducer = createReducer(
  initialState,
  on(WalletActions.retrievedAccounts, (_wallet, { accounts }) => {
    return { accounts , activeAccount: _wallet.activeAccount, publicKey: _wallet.publicKey };
  }),
  on(WalletActions.retrievedAccount, (_wallet, { account }) => {
    const accounts = [..._wallet.accounts, account];
    return { accounts , activeAccount: _wallet.activeAccount, publicKey: _wallet.publicKey };
  }),
  on(WalletActions.setActiveAccount, (_wallet, { account }) => {
    return { accounts: _wallet.accounts, activeAccount: account, publicKey: _wallet.publicKey }
  }),
  on(WalletActions.setOwnerPublicKey, (_wallet, { publicKey }) => {
    return { accounts: _wallet.accounts, activeAccount: _wallet.activeAccount, publicKey }
  }),
);
