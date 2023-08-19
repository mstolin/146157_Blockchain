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
  allBoxes: Box[] = [];
  availableBoxes: Box[] = [];
  soldBoxes: BoxSellRef[] = [];

  // supply chain
  supplychain!: SupplyChain;
  isSupplyChainCompleted!: boolean;
  isDeliveredByFarmer!: string;
  isDeliveredToButcher!: string;
  areDistributedByButcher!: string;
  areDistributedToDelivery!: string;

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

    this.crowdfundingService.getBoxes(campaignId).then(boxes => this.allBoxes = boxes).catch(err => console.log(err));

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

    this.loadSupplyChainStatus(campaignId);

    this.supplychainService.isSupplyChainCompleted(campaignId).then(isCompleted => {
      this.isSupplyChainCompleted = isCompleted;
    }).catch(err => {
      console.log(err);
    });
  }

  private loadSupplyChainStatus(campaignId: number) {
    this.supplychainService.getSupplyChain(campaignId).then(supplychain => {
      this.supplychain = supplychain;
      this.supplychain.isAnimalDeliveredFromFarmer ? this.isDeliveredByFarmer = "Yes" : this.isDeliveredByFarmer = "No";
      this.supplychain.isAnimalDeliveredToButcher ? this.isDeliveredToButcher = "Yes" : this.isDeliveredToButcher = "No";
      this.supplychain.areBoxesDistributedFromButcher ? this.areDistributedByButcher = "Yes" : this.areDistributedByButcher = "No";
      this.supplychain.areBoxesDistributedToDelivery ? this.areDistributedToDelivery = "Yes" : this.areDistributedToDelivery = "No";
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

  getBox(id: number): Box | undefined {
    return this.allBoxes.find(box => box.id == id);
  }

  onDelivered() : void {
    if (this.owner) {
      this.supplychainService.markAnimalAsDelivered(this.supplychain.campaignRef).then(() => {
        console.log("delivered");
        this.loadSupplyChainStatus(this.supplychain.campaignRef);
      }).catch(err => {
        console.log("ERR" + err);
      });
    }
  }

  onProcessed() : void {
    if (this.owner) {
      this.supplychainService.markAnimalAsProcessed(this.supplychain.campaignRef).then(() => {
        console.log("processed");
        this.loadSupplyChainStatus(this.supplychain.campaignRef);
      }).catch(err => {
        console.log("ERR" + err);
      })
    }
  }

  onBoxesProcessed() : void {
    if (this.owner) {
      this.supplychainService.markBoxesAsProcessed(this.supplychain.campaignRef).then(() => {
        console.log("boxes processed");
        this.loadSupplyChainStatus(this.supplychain.campaignRef);
      }).catch(err => {
        console.log("ERR" + err);
      })
    }
  }

  onBoxesDistributed() : void {
    if (this.owner) {
      this.supplychainService.markBoxesAsDistributed(this.supplychain.campaignRef).then(() => {
        console.log("boxes distributed");
        this.loadSupplyChainStatus(this.supplychain.campaignRef);
      }).catch(err => {
        console.log("ERR" + err);
      })
    }
  }

}
