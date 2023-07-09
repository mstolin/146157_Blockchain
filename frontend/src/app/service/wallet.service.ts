import { Injectable } from '@angular/core';
import { EMPTY, Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor() { }

  getAccounts(): Observable<string> {
    const accounts: string[] = window.ethereum.request({
      method: "eth_requestAccounts",
    }).catch(() => {
      return EMPTY;
    });

    return from(accounts);
  }

}
