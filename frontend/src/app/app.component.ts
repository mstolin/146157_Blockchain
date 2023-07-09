import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

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

  constructor(private store: Store) {}
}
