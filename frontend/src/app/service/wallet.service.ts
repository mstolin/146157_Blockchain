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

  getPublicKey(account: string): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          const keyB64 = await window.ethereum.request({
            method: 'eth_getEncryptionPublicKey',
            params: [account],
          }) as string;
          const publicKey = Buffer.from(keyB64, 'base64');
          resolve(publicKey);
        } else {
          reject();
        }
      } catch (err) {
        reject(err);
      }
    });
  }

}
