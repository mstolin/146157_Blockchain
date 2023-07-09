import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import detectEthereumProvider from '@metamask/detect-provider';
import { WalletService } from 'src/app/service/wallet.service';
import Wallet from 'src/app/models/wallet';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  @Input() links!: { title: string, link: string }[];
  @Input() wallet!: Wallet;

  hasProvider = false;

  ngOnInit(): void {
    this.detectProvider();
  }

  constructor(public route: ActivatedRoute, private walletService: WalletService, private store: Store) {}

  private detectProvider() {
    detectEthereumProvider({ silent: true }).then(provider => {
      this.hasProvider = Boolean(provider);
    }).catch(() => {
      this.hasProvider = false;
    });
  }

  connectWallet() {
    this.walletService.getAccounts().subscribe((account) => {

    });
  }

}
