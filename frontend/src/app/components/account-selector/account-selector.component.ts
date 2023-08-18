import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import makeBlockiesUrl from 'blockies-base64-svg'
import { WalletActions } from 'src/app/state/wallet.actions';

@Component({
  selector: 'app-account-selector',
  templateUrl: './account-selector.component.html',
  styleUrls: ['./account-selector.component.css']
})
export class AccountSelectorComponent {

  @Input() activeAccount!: string;
  @Input() accounts!: string[];

  constructor(private store: Store) { }

  getBlockieFromAddress(address: string): string {
    return makeBlockiesUrl(address);
  }

  setActiveAccount(account: string) {
    this.store.dispatch(WalletActions.setActiveAccount({ account }));
  }

}
