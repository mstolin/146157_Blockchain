import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { Store } from '@ngrx/store';

import { selectWallet } from '../../state/wallet.selectors';
import Campaign from 'src/app/models/campaign';

@Component({
  selector: 'app-new-campaign',
  templateUrl: './new-campaign.component.html',
  styleUrls: ['./new-campaign.component.css']
})
export class NewCampaignComponent {

  wallet$ = this.store.select(selectWallet);

  title?: string;
  description?: string;
  owner?: string;

  constructor(private store: Store) {
    this.wallet$.subscribe(wallet => {
      if (wallet.activeAccount) {
        this.owner = wallet.activeAccount;
      }
    });
  }

  onSubmit() {
    if (this.title && this.description && this.owner) {
      const campaign = new Campaign(this.title, this.description, this.owner);
      console.log(campaign);
    } else {
      console.log("SOMETHING MISSING");
    }
  }

}
