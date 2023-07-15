import Box from "./box";

export default class BoxOffer {

  private _box: Box;
  private _total: number;
  private _available: number;

  constructor(box: Box, total: number, available: number) {
    this._box = box;
    this._total = total;
    this._available = available;
  }

  get box() {
    return this._box;
  }

  get total() {
    return this._total;
  }

  get available() {
    return this._available;
  }

}
