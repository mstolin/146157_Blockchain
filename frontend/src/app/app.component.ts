import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { WalletActions } from './state/wallet.actions';
import { selectWallet } from './state/wallet.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  links: { title: string, link: string }[] = [
    { 'title': 'Home', 'link': '' },
    { 'title': 'All Campaigns', 'link': 'all-campaigns' },
    { 'title': 'New Campaign', 'link': 'new-campaign' },
  ];

  wallet$ = this.store.select(selectWallet);

  ngOnInit(): void {
    this.wallet$.subscribe(wallet => {
      if (wallet.activeAccount == null && wallet.accounts.length > 0) {
        // set default active account
        const firstAccount = wallet.accounts[0];
        this.store.dispatch(WalletActions.setActiveAccount({ account: firstAccount }));
      }
    });
  }

  constructor(private store: Store) {}
}
