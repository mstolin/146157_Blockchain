export default class Stakeholder {

  private readonly _owner: string;
  private readonly _share: number;

  constructor(owner: string, share: number) {
    this._owner = owner;
    this._share = share;
  }

  get owner() {
    return this._owner;
  }

  get share() {
    return this._share;
  }

}
