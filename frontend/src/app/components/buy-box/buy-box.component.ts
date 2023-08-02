import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { selectWallet } from '../../state/wallet.selectors';
import Box from 'src/app/models/box';
import { CrowdfundingService } from 'src/app/service/crowdfunding.service';
import { encrypt, decrypt } from '@metamask/eth-sig-util';

@Component({
  selector: 'app-buy-box',
  templateUrl: './buy-box.component.html',
  styleUrls: ['./buy-box.component.css']
})
export class BuyBoxComponent implements OnInit {

  wallet$ = this.store.select(selectWallet);

  owner?: string;
  address?: string;
  campaignId?: number;
  boxId?: number;
  box?: Box;

  constructor(private store: Store, private route: ActivatedRoute, private crowdfundingService: CrowdfundingService) {
    this.wallet$.subscribe(wallet => {
      if (wallet.activeAccount) {
        this.owner = wallet.activeAccount;
      }
    });
  }

  private loadData(campaignId: number, boxId: number) {
    this.crowdfundingService.getBox(campaignId, boxId)
      .then(box => this.box = box)
      .catch(err => console.log('ERR:', err));
  }

  private encryptAddress(campaignId: number, address: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const campaign = await this.crowdfundingService.getCampaign(campaignId);
        const publicKey = campaign.ownerPublicKey;
        const enc = encrypt({
          publicKey,
          data: Buffer.from(address, 'utf-8').toString('base64'),
          version: 'x25519-xsalsa20-poly1305',
        });
        const buf = Buffer.concat([
          Buffer.from(enc.ephemPublicKey, 'base64'),
          Buffer.from(enc.nonce, 'base64'),
          Buffer.from(enc.ciphertext, 'base64'),
        ]);
        resolve(buf.toString('base64'))
      } catch(err) {
        reject(err);
      }
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const campaignIdParam = params.get('campaignId');
      const boxIdParam = params.get('boxId');
      if (campaignIdParam && boxIdParam) {
        try {
          this.campaignId = Number(campaignIdParam);
          this.boxId = Number(boxIdParam);
          this.loadData(this.campaignId, this.boxId);
        } catch(err) {
          console.log(err);
        }
      }
    });
  }

  async onSubmit() {
    if (this.address && this.campaignId != undefined && this.boxId != undefined && this.box) {
      const campaignId = this.campaignId;
      const boxId = this.boxId;
      const address = this.address;
      const box = this.box;
      this.encryptAddress(campaignId, address).then(async cipher => {
        try {
          await this.crowdfundingService.buyBox(campaignId, boxId, cipher, `${box.price}`);
        } catch(err) {
          console.log('ERR:', err);
        }
      }).catch(err => console.log(err));
    } else {
      console.log(this.campaignId, this.boxId, this.address);
    }
  }

}
