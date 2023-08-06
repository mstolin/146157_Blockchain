import { CampaignInfoResp } from "./responseModels";

export default class CampaignInfo {

  private readonly _title: string;
  private readonly _description: string;
  private readonly _deadline: Date;

  constructor(title: string, description: string, deadline: Date) {
    this._title = title;
    this._description = description;
    this._deadline = deadline;
  }

  static fromResponse(resp: CampaignInfoResp): CampaignInfo {
    const deadline = new Date(resp.deadline / 1000);
    return new CampaignInfo(resp.title, resp.description, deadline);
  }

  get title() {
    return this._title;
  }

  get description() {
    return this._description;
  }

  get deadline() {
    return this._deadline;
  }

};
