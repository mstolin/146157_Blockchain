import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Box from 'src/app/models/box';
import Campaign from 'src/app/models/campaign';
import { BoxSellRefResp } from 'src/app/models/responseModels';
import { CrowdfundingService } from 'src/app/service/crowdfunding.service';
import { utils } from 'web3';

@Component({
  selector: 'app-campaign-detail',
  templateUrl: './campaign-detail.component.html',
  styleUrls: ['./campaign-detail.component.css']
})
export class CampaignDetailComponent implements OnInit {

  campaignId!: number;
  campaign!: Campaign;
  collectedEther!: string;
  availableBoxes: Box[] = [];
  soldBoxes: BoxSellRefResp[] = [];

  constructor(private route: ActivatedRoute, private crowdfundingService: CrowdfundingService) { }

  ngOnInit(): void {
    this.crowdfundingService.getCampaign(this.campaignId).then(campaign => {
      this.campaign = campaign;
      this.collectedEther = utils.fromWei(campaign.collectedAmount, 'ether');
    }).catch(err => {
      console.log(err);
    });

    this.crowdfundingService.getAvailableBoxes(this.campaignId).then(boxes => {
      this.availableBoxes = boxes;
    }).catch(err => {
      console.log(err);
    });

    this.crowdfundingService.getSoldBoxes(this.campaignId).then(boxes => {
      this.soldBoxes = boxes;
    }).catch(err => {
      console.log(err);
    });
  }

}
