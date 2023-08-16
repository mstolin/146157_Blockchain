import { BoxStatusResp } from "./responseModels";

export default class BoxStatus {

  private readonly _campaignRef: number;
  private readonly _boxId: number;
  private readonly _isProcessed: boolean;
  private readonly _isDistributedFromButcher: boolean;
  private readonly _isDistributedToDelivery: boolean;
  private readonly _isDelivered: boolean;

  constructor(
    campaignRef: number,
    boxId: number,
    isProcessed: boolean,
    isDistributedFromButcher: boolean,
    isDistributedToDelivery: boolean,
    isDelivered: boolean
  ) {
    this._campaignRef = campaignRef;
    this._boxId = boxId;
    this._isProcessed = isProcessed;
    this._isDistributedFromButcher = isDistributedFromButcher;
    this._isDistributedToDelivery = isDistributedToDelivery;
    this._isDelivered = isDelivered;
  }

  static fromResponse(resp: BoxStatusResp): BoxStatus {
    return new BoxStatus(
      resp.campaignRef,
      resp.boxId,
      resp.isProcessed,
      resp.isDistributedFromButcher,
      resp.isDistributedToDelivery,
      resp.isDelivered
    );
  }

  get campaignRef(): number {
    return this._campaignRef;
  }

  get boxId(): number {
    return this._boxId;
  }

  get isProcessed(): boolean {
    return this._isProcessed;
  }

  get isDistributed(): boolean {
    return this._isDistributedFromButcher && this._isDistributedToDelivery;
  }

  get isDistributedFromButcher(): boolean {
    return this._isDistributedFromButcher;
  }

  get isDistributedToDelivery(): boolean {
    return this._isDistributedToDelivery;
  }

  get isDelivered(): boolean {
    return this._isDelivered;
  }
}
