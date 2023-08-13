import { Component, OnInit } from '@angular/core';
import Campaign from 'src/app/models/campaign';
import { CrowdfundingService } from 'src/app/service/crowdfunding.service';

@Component({
  selector: 'app-all-campaigns',
  templateUrl: './all-campaigns.component.html',
  styleUrls: ['./all-campaigns.component.css']
})
export class AllCampaignsComponent implements OnInit {

  activeCampaigns: Campaign[] = [];
  stoppedCampaigns: Campaign[] = [];

  constructor(private crowdfundingService: CrowdfundingService) {}

  ngOnInit():void {
    this.crowdfundingService.getActiveCampaigns().then(campaigns => {
      this.activeCampaigns = campaigns;
    }).catch(err => {
      console.log("ERR", err);
    });

    this.crowdfundingService.getStoppedCampaigns().then(campaigns => {
      this.stoppedCampaigns = campaigns;
    }).catch(err => {
      console.log("ERR", err);
    });
  }

}
