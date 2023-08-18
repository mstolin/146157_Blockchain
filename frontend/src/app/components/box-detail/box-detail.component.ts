import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrowdfundingService } from '../../service/crowdfunding.service';
import { Store } from '@ngrx/store';
import { selectWallet } from '../../state/wallet.selectors';
import BoxSellRef from 'src/app/models/boxSellRef';
import Box from 'src/app/models/box';
import {SupplyChainService} from "../../service/supplychain.service";
import BoxStatus from "../../models/boxStatus";

@Component({
  selector: 'app-box-detail',
  templateUrl: './box-detail.component.html',
  styleUrls: ['./box-detail.component.css']
})
export class BoxDetailComponent implements OnInit {

  wallet$ = this.store.select(selectWallet);

  owner?: string;
  sellRef!: BoxSellRef;
  box!: Box;
  privateKey?: string;
  address?: string;

  boxesDistributionStatus!: boolean;
  boxStatus!: BoxStatus;

  constructor(
      private store: Store,
      private route: ActivatedRoute,
      private crowdfundingService: CrowdfundingService,
      private supplychainService: SupplyChainService
  ) {
    this.wallet$.subscribe(wallet => {
      if (wallet.activeAccount) {
        this.owner = wallet.activeAccount;
      }
    });
  }

  private loadData(campaignId: number, boxId: number) {
    this.crowdfundingService.getSoldBox(campaignId, boxId)
      .then(sellRef => {
        this.sellRef = sellRef;
        this.crowdfundingService.getBox(campaignId, sellRef.boxId)
          .then(box => this.box = box)
          .catch(err => console.log('ERR', err));
      })
      .catch(err => console.log('ERR:', err));

    this.loadBoxStatus(campaignId, boxId);

    this.supplychainService.getSupplyChain(campaignId)
      .then(supplychain => {
        this.boxesDistributionStatus = supplychain.areBoxesDistributed;
      })
      .catch(err => console.log('ERR:', err));
  }

  private loadBoxStatus(campaignId: number, boxId: number) {
    this.supplychainService.getBoxStatus(campaignId, boxId)
      .then(boxStatus => {
        this.boxStatus = boxStatus;
      })
      .catch(err => console.log('ERR:', err));
  }

  private decrypt(cipher: Buffer, owner: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const structuredData = {
          version: 'x25519-xsalsa20-poly1305',
          ephemPublicKey: cipher.slice(0, 32).toString('base64'),
          nonce: cipher.slice(32, 56).toString('base64'),
          ciphertext: cipher.slice(56).toString('base64'),
        };
        const ct = `0x${Buffer.from(JSON.stringify(structuredData), 'utf8').toString('hex')}`;

        const decrypt = await window.ethereum.request({
          method: 'eth_decrypt',
          params: [ct, owner],
        });

        resolve(Buffer.from(decrypt, 'base64').toString('utf-8'))
      } catch (err) {
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
          const campaignId = Number(campaignIdParam);
          const boxId = Number(boxIdParam);
          this.loadData(campaignId, boxId);
        } catch(err) {
          console.log(err);
        }
      }
    });
  }

  decryptAddress() {
    if (this.privateKey && this.sellRef && this.owner) {
      this.decrypt(Buffer.from(this.sellRef.physAddress, 'base64'), this.owner).then(address => {
        this.address = address;
      }).catch(err => console.log('ERR', err));
    }
  }

  onDelivered() : void {
    if (this.owner) {
      this.supplychainService.markBoxAsDelivered(this.boxStatus.campaignRef, this.boxStatus.boxId).then(() => {
        console.log("delivered");
        this.loadBoxStatus(this.boxStatus.campaignRef, this.boxStatus.boxId);
      }).catch(err => {
        console.log("ERR" + err);
      });
    }
  }

}
