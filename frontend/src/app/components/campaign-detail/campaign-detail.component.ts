import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Campaign from 'src/app/models/campaign';
import { CrowdfundingService } from 'src/app/service/crowdfunding.service';

@Component({
  selector: 'app-campaign-detail',
  templateUrl: './campaign-detail.component.html',
  styleUrls: ['./campaign-detail.component.css']
})
export class CampaignDetailComponent implements OnInit {

  campaignId!: number;
  campaign!: Campaign;

  constructor(private route: ActivatedRoute, private crowdfundingService: CrowdfundingService) { }

  ngOnInit(): void {
    this.campaignId = Number(this.route.snapshot.params['id']);
    this.crowdfundingService.getCampaign(this.campaignId).then(campaign => {
      this.campaign = campaign;
    }).catch(err => {
      console.log(err);
    });
  }

}
