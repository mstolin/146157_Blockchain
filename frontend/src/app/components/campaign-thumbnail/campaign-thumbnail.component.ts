import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-campaign-thumbnail',
  templateUrl: './campaign-thumbnail.component.html',
  styleUrls: ['./campaign-thumbnail.component.css']
})
export class CampaignThumbnailComponent {

  @Input() title!: string;
  @Input() description!: string;

}
