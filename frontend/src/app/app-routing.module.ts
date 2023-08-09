import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllCampaignsComponent } from './components/all-campaigns/all-campaigns.component';
import { NewCampaignComponent } from './components/new-campaign/new-campaign.component';
import { CampaignDetailComponent } from './components/campaign-detail/campaign-detail.component';
import { BuyBoxComponent } from './components/buy-box/buy-box.component';
import { BoxDetailComponent } from './components/box-detail/box-detail.component';

const routes: Routes = [
  { path: '', component: AllCampaignsComponent },
  { path: 'new-campaign', component: NewCampaignComponent },
  { path: 'campaign/:id', component: CampaignDetailComponent },
  { path: 'campaign/:campaignId/buy/:boxId', component: BuyBoxComponent },
  { path: 'campaign/:campaignId/box/:boxId', component: BoxDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
