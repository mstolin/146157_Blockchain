import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { selectWallet } from '../../state/wallet.selectors';
import { CrowdfundingService } from 'src/app/service/crowdfunding.service';
import { BoxOfferReq, StakeholderReq } from 'src/app/models/requestModels';
import { WalletService } from 'src/app/service/wallet.service';

@Component({
  selector: 'app-new-campaign',
  templateUrl: './new-campaign.component.html',
  styleUrls: ['./new-campaign.component.css']
})
export class NewCampaignComponent {

  wallet$ = this.store.select(selectWallet);

  numberOfBoxes = 1;
  title?: string;
  description?: string;
  owner?: string;
  duration?: number;

  farmer: StakeholderReq = { owner: '', share: 40 };
  butcher: StakeholderReq = { owner: '', share: 30 };
  delivery: StakeholderReq = { owner: '', share: 30 };

  firstBox: BoxOfferReq = { id: 0, total: 1, available: 1, box: { title: 'Box #1', description: 'Nice Box #1', price: 20 } };
  secondBox: BoxOfferReq = { id: 1, total: 1, available: 1, box: { title: 'Box #2', description: 'Nice Box #1', price: 20 } };
  thirdBox: BoxOfferReq = { id: 2, total: 1, available: 1, box: { title: 'Box #3', description: 'Nice Box #1', price: 20 } };

  constructor(private store: Store, private crowdfundingService: CrowdfundingService, private walletService: WalletService) {
    this.wallet$.subscribe(wallet => {
      if (wallet.activeAccount) {
        this.owner = wallet.activeAccount;
      }
    });
  }

  private getBoxes(): BoxOfferReq[] {
    return [this.firstBox, this.secondBox, this.thirdBox];
  }

  private createNewCampaign(publicKey: string) {
    if (this.title && this.description && this.owner && this.duration && this.farmer && this.butcher && this.delivery) {
      const campaign = {
        title: this.title,
        description: this.description,
        owner: this.owner,
        ownerPublicKey: publicKey,
        duration: this.duration * 86400,
        farmer: this.farmer,
        butcher: this.butcher,
        delivery: this.delivery,
      };
      const boxes = this.getBoxes();

      console.log('CAMPAIGN', campaign);
      console.log('BOXES', boxes);

      this.crowdfundingService.createCampaign(campaign, boxes).then(() => {
        console.log("OKIDOKI");
      }).catch(error => {
        console.log("ERR:" + error);
      });
    } else {
      console.log("SOMETHING MISSING");
    }
  }

  onSubmit() {
    if (this.owner) {
      this.walletService.getPublicKey(this.owner).then((publicKey) => {
        this.createNewCampaign(publicKey);
      }).catch(err => {
        console.log(err);
      });
    }
  }

}
