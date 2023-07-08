import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  links: { title: string, fragment: string }[] = [
    { 'title': 'Home', 'fragment': '' },
    { 'title': 'All Campaigns', 'fragment': 'all-campaigns' },
    { 'title': 'New Campaign', 'fragment': 'new-campaign' },
  ];
}
