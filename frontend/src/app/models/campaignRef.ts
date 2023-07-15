import Campaign from "./campaign";

export default class CampaignRef {

  private readonly _campaign: Campaign;
  private readonly _id: number;

  constructor(id: number, campaign: Campaign) {
    this._id = id;
    this._campaign = campaign;
  }

  get id() {
    return this._id;
  }

  get campaign() {
    return this._campaign;
  }

}
