import { CampaignMetaResp } from "./responseModels";

export default class CampaignMeta {

  private readonly _collectedAmount: number;
  private readonly _createdAt: Date;
  private readonly _totalBoxes: number;
  private readonly _boxesSold: number;
  private readonly _totalBoxTypes: number;
  private readonly _isStopped: boolean;

  constructor(collectedAmount: number, createdAt: Date, totalBoxes: number, boxesSold: number, totalBoxTypes: number, isStopped: boolean) {
    this._collectedAmount = collectedAmount;
    this._createdAt = createdAt;
    this._totalBoxes = totalBoxes;
    this._boxesSold = boxesSold;
    this._totalBoxTypes = totalBoxTypes;
    this._isStopped = isStopped;
  }

  static fromResponse(resp: CampaignMetaResp): CampaignMeta {
    const createdAt = new Date(Number(resp.createdAt) * 1000);
    return new CampaignMeta(resp.collectedAmount, createdAt, resp.totalBoxes, resp.boxesSold, resp.totalBoxTypes, resp.isStopped);
  }

  get collectedAmount() {
    return this._collectedAmount;
  }

  get createdAt() {
    return this._createdAt;
  }

  get totalBoxes() {
    return this._totalBoxes;
  }

  get boxesSold() {
    return this._boxesSold;
  }

  get totalBoxTypes() {
    return this._totalBoxTypes;
  }

  get isStopped() {
    return this._isStopped;
  }

}
