export default class Box {
  private readonly _title: string;
  private readonly _description: string;
  private readonly _price: number;
  private readonly _available: number;
  private readonly _total: number;

  constructor(title: string, description: string, price: number, total: number, available: number) {
    this._title = title;
    this._description = description;
    this._price = price;
    this._total = total;
    this._available = available;
  }

  get title() {
    return this._title;
  }

  get description() {
    return this._description;
  }

  get price() {
    return this._price;
  }

  get available() {
    return this._available;
  }

  get total() {
    return this._total;
  }

}
