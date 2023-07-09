import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import detectEthereumProvider from '@metamask/detect-provider'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  @Input() links!: { title: string, link: string }[];

  hasProvider = false;

  // TODO move to store
  wallet: { accounts: [] } = { 'accounts': [] };

  ngOnInit(): void {
    this.detectProvider();
  }

  constructor(public route: ActivatedRoute) {}

  private detectProvider() {
    detectEthereumProvider({ silent: true }).then(provider => {
      this.hasProvider = Boolean(provider);
    }).catch(() => {
      this.hasProvider = false;
    });
  }

  async connectWallet() {
    let accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    this.wallet.accounts = accounts;

    /*
    TODO now set store accounts to accounts
    this way we now if login was successful
    */
  }

}
