import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CampaignThumbnailComponent } from './components/campaign-thumbnail/campaign-thumbnail.component';
import { HomeComponent } from './components/home/home.component';
import { AllCampaignsComponent } from './components/all-campaigns/all-campaigns.component';
import { NewCampaignComponent } from './components/new-campaign/new-campaign.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CampaignThumbnailComponent,
    HomeComponent,
    AllCampaignsComponent,
    NewCampaignComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
