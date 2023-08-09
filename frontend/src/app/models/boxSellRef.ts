import { BoxSellRefResp } from "./responseModels";

export default class BoxSellRef {

  private readonly _id: number;
  private readonly _boxId: number;
  private readonly _owner: string;
  private readonly _boughtAt: Date;
  private readonly _physAddress: string;

  constructor(id: number, boxId: number, owner: string, boughtAt: Date, physAddress: string) {
    this._id = id;
    this._boxId = boxId;
    this._owner = owner;
    this._boughtAt = boughtAt;
    this._physAddress = physAddress;
  }

  static fromResponse(resp: BoxSellRefResp): BoxSellRef {
    const boughtAt = new Date(Number(resp.boughtAt) * 1000);
    return new BoxSellRef(resp.id, resp.boxId, resp.owner, boughtAt, resp.physAddress);
  }

  get id() {
    return this._id;
  }

  get boxId() {
    return this._boxId;
  }

  get owner() {
    return this._owner;
  }

  get boughtAt() {
    return this._boughtAt;
  }

  get physAddress() {
    return this._physAddress;
  }

};
