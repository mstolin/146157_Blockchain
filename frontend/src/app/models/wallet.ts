/*export default class Wallet {

  private _accounts: string[] = [];

  set accounts(accounts: string[]) {
    this._accounts = accounts;
  }

  get accounts() {
    return this._accounts;
  }

}*/

export default interface Wallet {
  accounts: string[];
}
