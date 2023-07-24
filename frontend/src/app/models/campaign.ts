import Stakeholder from "./stakeholder";

export default class Campaign {

  private readonly _id: number;
  private readonly _title: string;
  private readonly _description: string;
  private readonly _owner: string;
  private readonly _ownerPublicKey: string;
  private readonly _deadline: Date;
  private readonly _collectedAmount: number;
  private readonly _boxesLeft: number;
  private readonly _isStopped: boolean;
  private readonly _farmer: Stakeholder;
  private readonly _butcher: Stakeholder;
  private readonly _delivery: Stakeholder;

  constructor(
    id: number,
    title: string,
    description: string,
    owner: string,
    ownerPublicKey: string,
    deadline: Date,
    collectedAmount: number,
    boxesLeft: number,
    isStopped: boolean,
    farmer: Stakeholder,
    butcher: Stakeholder,
    delivery: Stakeholder
  ) {
    this._id = id;
    this._title = title;
    this._description = description;
    this._owner = owner;
    this._ownerPublicKey = ownerPublicKey;
    this._deadline = deadline;
    this._collectedAmount = collectedAmount;
    this._boxesLeft = boxesLeft;
    this._isStopped = isStopped;
    this._farmer = farmer;
    this._butcher = butcher;
    this._delivery = delivery;
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

  get ownerPublicKey() {
    return this._ownerPublicKey;
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

  get farmer() {
    return this._farmer;
  }

  get butcher() {
    return this._butcher;
  }

  get delivery() {
    return this._delivery;
  }

}
