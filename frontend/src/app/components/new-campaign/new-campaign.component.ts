import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { selectWallet } from '../../state/wallet.selectors';
import Campaign from 'src/app/models/campaign';
import BoxOffer from 'src/app/models/boxOffer';
import Box from 'src/app/models/box';
import { CrowdfundingService } from 'src/app/service/crowdfunding.service';
import Web3 from 'web3';

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
      // 6 weeks from now
      const campaign = {
        title: this.title,
        description: this.description,
        owner: this.owner,
        duration: 3600
      };
      const boxes = [
        {
          total: 2,
          available: 2,
          box: {
            title: 'Very nice box',
            description: 'This is a great box',
            price: 2
          }
        }
      ];

      this.crowdfundingService.createCampaign(campaign, boxes).then(() => {
        console.log("OKIDOKI");
      }).catch(error => {
        console.log("ERR:" + error);
      });
    } else {
      console.log("SOMETHING MISSING");
    }
  }

}
