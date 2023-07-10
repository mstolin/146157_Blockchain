export default class Campaign {

  private _title: string;
  private _description: string;
  private _owner: string;

  constructor(title: string, description: string, owner: string) {
    this._title = title;
    this._description = description;
    this._owner = owner;
  }

  get title() {
    return this._title;
  }

  get description() {
    return this._description;
  }

  get owner() {
    return this._owner;
  }

}
