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

  private encryptAddress(campaignId: number, address: string): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('TEST 1');
        const campaign = await this.crowdfundingService.getCampaign(campaignId);
        console.log('TEST 2');
        const publicKey = campaign.ownerPublicKey;
        const enc = encrypt({
          publicKey,
          data: 'TEst1234',
          version: 'x25519-xsalsa20-poly1305',
        });
        const buf = Buffer.concat([
          Buffer.from(enc.ephemPublicKey, 'base64'),
          Buffer.from(enc.nonce, 'base64'),
          Buffer.from(enc.ciphertext, 'base64'),
        ]);
        console.log('BUF', buf.toString('base64'));

        const structuredData = {
          version: 'x25519-xsalsa20-poly1305',
          ephemPublicKey: buf.slice(0, 32).toString('base64'),
          nonce: buf.slice(32, 56).toString('base64'),
          ciphertext: buf.slice(56).toString('base64'),
        };
        const ct = `0x${Buffer.from(JSON.stringify(structuredData), 'utf8').toString('hex')}`;

        console.log('ct', ct);

        const decrypt = await window.ethereum.request({
          method: 'eth_decrypt',
          params: [ct, this.owner!],
        });

        console.log('DEC', decrypt);

        resolve(Buffer.from(''));
      } catch(err) {
        reject(err);
      }
    });
    /*if (this.campaignId) {
      .then(campaign => {
        let publicKey = campaign.ownerPublicKey;
        let privateKey = '0x9796b9d00a95e375afd0e87094f92552bb029c1bb7020fbcd0f15063d5a06077';
        console.log('PUBLIC', publicKey);
        console.log('PRIVATE', privateKey);
        let cipher =
        console.log('CIPHER', cipher.toString('base64'));
        let decipher = privateDecrypt(privateKey, cipher);
        console.log('DECIPHER', decipher.toString('base64'));
      });
    }*/
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
        console.log('CIPHER', cipher.toString('base64'));
        /*try {
          await this.crowdfundingService.buyBox(campaignId, boxId, cipher.toString('base64'), `${box.price}`);
          console.log('SUCCESS');
        } catch(err) {
          console.log('ERR:', err);
        }*/
      }).catch(err => console.log(err));
    } else {
      console.log(this.campaignId, this.boxId, this.address);
    }
  }

}
