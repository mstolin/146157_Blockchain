import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AllCampaignsComponent } from './components/all-campaigns/all-campaigns.component';
import { NewCampaignComponent } from './components/new-campaign/new-campaign.component';
import { CampaignDetailComponent } from './components/campaign-detail/campaign-detail.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'all-campaigns', component: AllCampaignsComponent },
  { path: 'new-campaign', component: NewCampaignComponent },
  { path: 'campaign/:id', component: CampaignDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
