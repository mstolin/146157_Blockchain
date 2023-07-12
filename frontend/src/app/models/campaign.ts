export default class Campaign {

  private readonly _title: string;
  private readonly _description: string;
  private readonly _owner: string;
  private readonly _progress: number;
  private readonly _deadline: Date;
  private readonly _collectedAmount: bigint;

  constructor(title: string, description: string, owner: string, progress: number, deadline: Date, collectedAmount: bigint) {
    this._title = title;
    this._description = description;
    this._owner = owner;
    this._progress = progress;
    this._deadline = deadline;
    this._collectedAmount = collectedAmount;
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

  get progress() {
    return this._progress;
  }

  get deadline() {
    return this._deadline;
  }

  get collectedAmount() {
    return this._collectedAmount;
  }

}
