import { Component, Input } from '@angular/core';
import Campaign from 'src/app/models/campaign';
import makeBlockiesUrl from 'blockies-base64-svg'

@Component({
  selector: 'app-campaign-thumbnail',
  templateUrl: './campaign-thumbnail.component.html',
  styleUrls: ['./campaign-thumbnail.component.css']
})
export class CampaignThumbnailComponent {

  @Input() campaign!: Campaign;

  getBlockieFromId(id: number): string {
    return makeBlockiesUrl(`${id}`);
  }

}
