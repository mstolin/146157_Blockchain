import Animal from "./animal";
import Stakeholder from "./stakeholder";

type Stakeholders = {
  farmer: Stakeholder;
  butcher: Stakeholder;
  delivery: Stakeholder;
};

type Owner = {
  address: string;
  publicKey: string;
}

export default class Campaign {

  private readonly _id: number;
  private readonly _title: string;
  private readonly _description: string;
  private readonly _deadline: Date;
  private readonly _collectedAmount: number;
  private readonly _totalBoxes: number;
  private readonly _boxesSold: number;
  private readonly _isStopped: boolean;
  private readonly _owner: Owner;
  private readonly _stakeholders: Stakeholders;
  private readonly _animal: Animal;

  constructor(
    id: number,
    title: string,
    description: string,
    deadline: Date,
    collectedAmount: number,
    totalBoxes: number,
    boxesSold: number,
    isStopped: boolean,
    owner: Owner,
    stakeholders: Stakeholders,
    animal: Animal
  ) {
    this._id = id;
    this._title = title;
    this._description = description;
    this._owner = owner;
    this._deadline = deadline;
    this._collectedAmount = collectedAmount;
    this._totalBoxes = totalBoxes;
    this._boxesSold = boxesSold;
    this._isStopped = isStopped;
    this._stakeholders = stakeholders;
    this._animal = animal;
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

  get totalBoxes() {
    return this._totalBoxes;
  }

  get boxesSold() {
    return this._boxesSold;
  }

  get isStopped() {
    return this._isStopped;
  }

  get stakeholders() {
    return this._stakeholders;
  }

  get animal() {
    return this._animal;
  }

}
