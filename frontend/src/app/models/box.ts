export default class Box {
  private _title: string;
  private _description: string;
  private _percentage: number;
  private _price: number;

  constructor(title: string, description: string, percentage: number, price: number) {
    this._title = title;
    this._description = description;
    this._percentage = percentage;
    this._price = price;
  }

  get title() {
    return this._title;
  }

  get description() {
    return this._description;
  }

  get percentage() {
    return this._percentage;
  }

  get price() {
    return this._price;
  }

}
