import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { selectWallet } from '../../state/wallet.selectors';
import Campaign from 'src/app/models/campaign';
import { CrowdfundingService } from 'src/app/service/crowdfunding.service';

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

  constructor(private store: Store, private crowdfundingService: CrowdfundingService) {
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

      /*this.crowdfundingService.createCampaign(campaign).then(() => {
        console.log("OK OKOK");
      }).catch(error => {
        console.log("ERR:" + error);
      });*/

      /*this.crowdfundingService.getCampaigns().then(() => {
        console.log("OK OKOK");
      }).catch(error => {
        console.log("ERR:" + error);
      });*/
    } else {
      console.log("SOMETHING MISSING");
    }
  }

}
