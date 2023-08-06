export type CreateCampaignReq = {
  title: string;
  description: string;
  duration: number;
  owner: CampaignOwnerReq;
  stakeholders: StakeholderListReq;
  animal: CampaignAnimalReq;
};
export type CampaignOwnerReq = {
  owner: string;
  ownerPublicKey: string;
};
export type CampaignAnimalReq = {
  earTag: string;
  name: string;
  farm: string;
  age: number;
};
export type StakeholderListReq = {
  farmer: StakeholderReq;
  butcher: StakeholderReq;
  delivery: StakeholderReq;
};
export type StakeholderReq = {
  owner: string;
  share: number;
  info: string;
};
export type BoxReq = {
  id: number;
  title: string;
  description: string;
  price: string;
  total: number;
  available: number;
};
