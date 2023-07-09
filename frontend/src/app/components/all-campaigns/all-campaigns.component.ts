import { Component } from '@angular/core';

@Component({
  selector: 'app-all-campaigns',
  templateUrl: './all-campaigns.component.html',
  styleUrls: ['./all-campaigns.component.css']
})
export class AllCampaignsComponent {

  campaigns: { title: string, description: string }[] = [
    {
      'title': 'Campaign #1',
      'description': 'A description for #1'
    },
    {
      'title': 'Campaign #2',
      'description': 'A description for #2'
    },
  ];

  constructor() {}

}
