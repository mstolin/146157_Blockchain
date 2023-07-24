import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Box from 'src/app/models/box';
import { CrowdfundingService } from 'src/app/service/crowdfunding.service';

@Component({
  selector: 'app-buy-box',
  templateUrl: './buy-box.component.html',
  styleUrls: ['./buy-box.component.css']
})
export class BuyBoxComponent implements OnInit {

  address?: string;
  campaignId?: number;
  boxId?: number;
  box?: Box;

  constructor(private route: ActivatedRoute, private crowdfundingService: CrowdfundingService) { }

  ngOnInit(): void {
    console.log('BOX IS', this.route.data);
    this.campaignId = Number(this.route.snapshot.params['campaignId']);
    this.boxId = Number(this.route.snapshot.params['boxId']);
    this.crowdfundingService.getBox(this.campaignId, this.boxId)
      .then(box => this.box = box)
      .catch(err => console.log('ERR:', err));
    /*this.crowdfundingService.getCampaign(this.campaignId).then(campaign => {
      this.publicKey = Buffer.from(campaign.ownerPublicKey, 'base64');
    });*/
  }

  async onSubmit() {
    if (this.address && this.campaignId != undefined && this.boxId != undefined && this.box) {
      try {
        await this.crowdfundingService.buyBox(this.campaignId, this.boxId, this.address, `${this.box.price}`);
        console.log('SUCCESS');
      } catch(err) {
        console.log('ERR:', err);
      }
    } else {
      console.log(this.campaignId, this.boxId, this.address);
    }
  }

}
