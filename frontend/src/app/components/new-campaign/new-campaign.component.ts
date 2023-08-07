import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { selectWallet } from '../../state/wallet.selectors';
import { CrowdfundingService } from 'src/app/service/crowdfunding.service';
import { BoxReq, CampaignAnimalReq, CreateCampaignReq, StakeholderReq } from 'src/app/models/requestModels';
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
  duration?: number;
  owner?: string;

  animal: CampaignAnimalReq = { earTag: '', name: '', farm: '', age: 2 };

  farmer: StakeholderReq = { owner: '', share: 40, info: '' };
  butcher: StakeholderReq = { owner: '', share: 30, info: '' };
  delivery: StakeholderReq = { owner: '', share: 30, info: '' };

  firstBox: BoxReq = { id: 0, total: 1, available: 1, title: 'Box #1', description: 'Nice Box #1', price: '11964130000000000' };
  secondBox: BoxReq = { id: 1, total: 1, available: 1, title: 'Box #2', description: 'Nice Box #1', price: '11964130000000000' };
  thirdBox: BoxReq = { id: 2, total: 1, available: 1, title: 'Box #3', description: 'Nice Box #1', price: '11964130000000000' };

  constructor(private store: Store, private crowdfundingService: CrowdfundingService, private walletService: WalletService) {
    this.wallet$.subscribe(wallet => {
      if (wallet.activeAccount) {
        this.owner = wallet.activeAccount;
      }
    });
  }

  private getBoxes(): BoxReq[] {
    return [this.firstBox, this.secondBox, this.thirdBox].map(box => {
      box.available = box.total
      return box;
    });
  }

  private createNewCampaign(publicKey: string) {
    if (this.title && this.description && this.owner && this.duration && this.farmer && this.butcher && this.delivery) {
      const campaign: CreateCampaignReq = {
        title: this.title,
        description: this.description,
        owner: {
          owner: this.owner,
          ownerPublicKey: publicKey
        },
        duration: this.duration * 86400,
        stakeholders: {
          butcher: this.butcher,
          delivery: this.delivery,
          farmer: this.farmer,
        },
        animal: this.animal
      };
      const boxes = this.getBoxes();

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
        this.createNewCampaign(publicKey.toString('base64'));
      }).catch(err => {
        console.log(err);
      });
    }
  }

}
