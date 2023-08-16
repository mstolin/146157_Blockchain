import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import Box from 'src/app/models/box';
import BoxSellRef from 'src/app/models/boxSellRef';
import Campaign from 'src/app/models/campaign';
import { CrowdfundingService } from 'src/app/service/crowdfunding.service';
import { selectWallet } from 'src/app/state/wallet.selectors';
import { utils } from 'web3';
import { SupplyChainService } from "../../service/supplychain.service";
import SupplyChain from "../../models/supplychain";

@Component({
  selector: 'app-campaign-detail',
  templateUrl: './campaign-detail.component.html',
  styleUrls: ['./campaign-detail.component.css']
})
export class CampaignDetailComponent implements OnInit {

  wallet$ = this.store.select(selectWallet);
  owner?: string;

  // campaign
  campaign!: Campaign;
  collectedEther!: string;
  availableBoxes: Box[] = [];
  soldBoxes: BoxSellRef[] = [];

  // supply chain
  supplychain!: SupplyChain;
  isSupplyChainCompleted!: boolean;
  isPaid: boolean = false;

  constructor(private store: Store, private route: ActivatedRoute, private crowdfundingService: CrowdfundingService, private supplychainService: SupplyChainService) {
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

    this.supplychainService.getSupplyChain(campaignId).then(supplychain => {
      this.supplychain = supplychain;
    }).catch(err => {
      console.log(err);
    });

    this.supplychainService.isSupplyChainCompleted(campaignId).then(isCompleted => {
      this.isSupplyChainCompleted = isCompleted;
    }).catch(err => {
      console.log(err);
    })
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

  onDelivered() : void {
    if (this.owner) {
      this.supplychainService.markAnimalAsDelivered(this.supplychain.campaignRef).then(() => {
        console.log("delivered");
      }).catch(err => {
        console.log("ERR" + err);
      });
    }
  }

  onProcessed() : void {
    if (this.owner) {
      this.supplychainService.markAnimalAsProcessed(this.supplychain.campaignRef).then(() => {
        console.log("processed");
      }).catch(err => {
        console.log("ERR" + err);
      })
    }
  }

  onPayOut() : void {
    if (this.owner) {
      this.crowdfundingService.payOut(this.campaign.id).then(() => {
        this.isPaid = true;
        console.log("payout");
      }).catch(err => {
        console.log("ERR" + err);
      })
    }
  }
}
