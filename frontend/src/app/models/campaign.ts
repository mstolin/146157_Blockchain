export default class Campaign {

  private readonly _id: number;
  private readonly _title: string;
  private readonly _description: string;
  private readonly _owner: string;
  private readonly _deadline: Date;
  private readonly _collectedAmount: number;
  private readonly _boxesLeft: number;
  private readonly _isStopped: boolean;

  constructor(id: number, title: string, description: string, owner: string, deadline: Date, collectedAmount: number, boxesLeft: number, isStopped: boolean) {
    this._id = id;
    this._title = title;
    this._description = description;
    this._owner = owner;
    this._deadline = deadline;
    this._collectedAmount = collectedAmount;
    this._boxesLeft = boxesLeft;
    this._isStopped = isStopped;
  }

  get id() {
    return this._id;
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

  get deadline() {
    return this._deadline;
  }

  get collectedAmount() {
    return this._collectedAmount;
  }

  get boxesLeft() {
    return this._boxesLeft;
  }

  get isStopped() {
    return this._isStopped;
  }

}
