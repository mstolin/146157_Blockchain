import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import Box from 'src/app/models/box';
import BoxSellRef from 'src/app/models/boxSellRef';
import Campaign from 'src/app/models/campaign';
import { CrowdfundingService } from 'src/app/service/crowdfunding.service';
import { selectWallet } from 'src/app/state/wallet.selectors';
import { utils } from 'web3';

@Component({
  selector: 'app-campaign-detail',
  templateUrl: './campaign-detail.component.html',
  styleUrls: ['./campaign-detail.component.css']
})
export class CampaignDetailComponent implements OnInit {

  wallet$ = this.store.select(selectWallet);
  owner?: string;
  campaign!: Campaign;
  collectedEther!: string;
  availableBoxes: Box[] = [];
  soldBoxes: BoxSellRef[] = [];

  constructor(private store: Store, private route: ActivatedRoute, private crowdfundingService: CrowdfundingService) {
    this.wallet$.subscribe(wallet => {
      if (wallet.activeAccount) {
        this.owner = wallet.activeAccount;
      }
    });
  }

  stopCampaign() {
    this.crowdfundingService.stopCampaign(this.campaign.id).catch(err => console.log('Err', err));
  }

  private loadData(campaignId: number) {
    this.crowdfundingService.getCampaign(campaignId).then(campaign => {
      this.campaign = campaign;
      this.collectedEther = utils.fromWei(campaign.meta.collectedAmount, 'ether');
    }).catch(err => {
      console.log(err);
    });

    this.crowdfundingService.getAvailableBoxes(campaignId).then(boxes => {
      this.availableBoxes = boxes;
    }).catch(err => {
      console.log(err);
    });

    this.crowdfundingService.getSoldBoxes(campaignId).then(boxes => {
      this.soldBoxes = boxes;
    }).catch(err => {
      console.log(err);
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const campaignIdParam = params.get('id');
      if (campaignIdParam) {
        try {
          const campaignId = Number(campaignIdParam);
          this.loadData(campaignId);
        } catch(err) {
          console.log(err);
        }
      }
    });
  }

}
