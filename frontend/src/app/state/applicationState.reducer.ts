import { createReducer, on } from '@ngrx/store';

import { ApplicationStateActions } from './applicationState.actions';
import Wallet from '../models/wallet';
import ApplicationState from '../models/applicationState';

export let initialState: ApplicationState = { 'wallet': new Wallet(), };

export const ApplicationStateReducer = createReducer(
  initialState,
  on(ApplicationStateActions.retrievedAccounts, (_state, { accounts }) => {
    _state.wallet.accounts = accounts;
    return _state;
  })
);
