import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { selectWallet } from '../../state/wallet.selectors';

@Component({
  selector: 'app-new-campaign',
  templateUrl: './new-campaign.component.html',
  styleUrls: ['./new-campaign.component.css']
})
export class NewCampaignComponent {

  wallet$ = this.store.select(selectWallet);

  activeAccount?: string;

  constructor(private store: Store) {
    this.wallet$.subscribe(wallet => {
      if (wallet.activeAccount) {
        this.activeAccount = wallet.activeAccount;
      }
    });
  }

}
