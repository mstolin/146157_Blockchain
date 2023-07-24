import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AllCampaignsComponent } from './components/all-campaigns/all-campaigns.component';
import { NewCampaignComponent } from './components/new-campaign/new-campaign.component';
import { CampaignDetailComponent } from './components/campaign-detail/campaign-detail.component';
import { BuyBoxComponent } from './components/buy-box/buy-box.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'all-campaigns', component: AllCampaignsComponent },
  { path: 'new-campaign', component: NewCampaignComponent },
  { path: 'campaign/:id', component: CampaignDetailComponent },
  { path: 'campaign/:campaignId/buy/:boxId', component: BuyBoxComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
