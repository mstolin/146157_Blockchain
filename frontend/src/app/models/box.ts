export default class Box {
  private _title: string;
  private _description: string;
  private _price: number;

  constructor(title: string, description: string, price: number) {
    this._title = title;
    this._description = description;
    this._price = price;
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

}
