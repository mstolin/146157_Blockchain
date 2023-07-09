import { createFeatureSelector } from '@ngrx/store';
import Wallet from '../models/wallet';

export const selectWallet = createFeatureSelector<Wallet>('wallet');
