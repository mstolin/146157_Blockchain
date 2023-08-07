import { StakeholderResp } from "./responseModels";

export default class Stakeholder {

  private readonly _owner: string;
  private readonly _share: number;
  private readonly _info: string;

  constructor(owner: string, share: number, info: string) {
    this._owner = owner;
    this._share = share;
    this._info = info;
  }

  static fromResponse(resp: StakeholderResp): Stakeholder {
    return new Stakeholder(resp.owner, resp.share, resp.info);
  }

  get owner() {
    return this._owner;
  }

  get share() {
    return this._share;
  }

  get info() {
    return this._info;
  }

}
