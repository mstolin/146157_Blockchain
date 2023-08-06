import Animal from "./animal";
import CampaignInfo from "./campaignInfo";
import CampaignMeta from "./campaignMeta";
import { CampaignResp } from "./responseModels";
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
  private readonly _info: CampaignInfo;
  private readonly _meta: CampaignMeta;
  private readonly _owner: Owner;
  private readonly _stakeholders: Stakeholders;
  private readonly _animal: Animal;

  constructor(
    id: number,
    info: CampaignInfo,
    meta: CampaignMeta,
    owner: Owner,
    stakeholders: Stakeholders,
    animal: Animal
  ) {
    this._id = id;
    this._info = info
    this._owner = owner;
    this._meta = meta;
    this._stakeholders = stakeholders;
    this._animal = animal;
  }

  static fromResponse(resp: CampaignResp): Campaign {
    return new Campaign(
      resp.id,
      CampaignInfo.fromResponse(resp.info),
      CampaignMeta.fromResponse(resp.meta),
      {
        address: resp.owner.owner,
        publicKey: resp.owner.ownerPublicKey,
      },
      {
        farmer: Stakeholder.fromResponse(resp.stakeholders.farmer),
        butcher: Stakeholder.fromResponse(resp.stakeholders.butcher),
        delivery: Stakeholder.fromResponse(resp.stakeholders.delivery)
      },
      Animal.fromResponse(resp.animal)
    );
  }

  get id() {
    return this._id;
  }

  get info() {
    return this._info;
  }

  get meta() {
    return this._meta;
  }

  get owner() {
    return this._owner;
  }

  get stakeholders() {
    return this._stakeholders;
  }

  get animal() {
    return this._animal;
  }

}
