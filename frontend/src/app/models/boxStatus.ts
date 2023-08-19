import { BoxStatusResp } from "./responseModels";

export default class BoxStatus {

  private readonly _campaignRef: number;
  private readonly _boxId: number;
  private readonly _isDelivered: boolean;

  constructor(
    campaignRef: number,
    boxId: number,
    isDelivered: boolean
  ) {
    this._campaignRef = campaignRef;
    this._boxId = boxId;
    this._isDelivered = isDelivered;
  }

  static fromResponse(resp: BoxStatusResp): BoxStatus {
    return new BoxStatus(
      resp.campaignRef,
      resp.boxId,
      resp.isDelivered
    );
  }

  get campaignRef(): number {
    return this._campaignRef;
  }

  get boxId(): number {
    return this._boxId;
  }

  get isDelivered(): boolean {
    return this._isDelivered;
  }
}
