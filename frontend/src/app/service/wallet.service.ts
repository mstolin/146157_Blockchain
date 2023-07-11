import { Injectable } from '@angular/core';
import Web3 from 'web3';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor() { }

  getAccounts(): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          let accounts: string[] = await ethereum.request({
            method: "eth_requestAccounts",
          });
          accounts = accounts.map(account => Web3.utils.toChecksumAddress(account));
          resolve(accounts);
        } else {
          reject();
        }
      } catch (err) {
        reject(err);
      }
    });
  }

}
