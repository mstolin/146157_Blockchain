import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CampaignThumbnailComponent } from './components/campaign-thumbnail/campaign-thumbnail.component';
import { HomeComponent } from './components/home/home.component';
import { AllCampaignsComponent } from './components/all-campaigns/all-campaigns.component';
import { NewCampaignComponent } from './components/new-campaign/new-campaign.component';

import { walletReducer } from './state/wallet.reducer';
import { AccountSelectorComponent } from './components/account-selector/account-selector.component';
import { CampaignDetailComponent } from './components/campaign-detail/campaign-detail.component';
import { StakeholderInputComponent } from './components/stakeholder-input/stakeholder-input.component';
import { BoxInputComponent } from './components/box-input/box-input.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CampaignThumbnailComponent,
    HomeComponent,
    AllCampaignsComponent,
    NewCampaignComponent,
    AccountSelectorComponent,
    CampaignDetailComponent,
    StakeholderInputComponent,
    BoxInputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    StoreModule.forRoot({ wallet: walletReducer }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
