export type CampaignRefResp = {
  id: number;
  campaign: CampaignResp;
};

export type CampaignResp = {
  meta: CampaignMetaResp;
  stakeholders: CampaignStakeholderListResp;
  owner: CampaignOwnerResp;
  animal: CampaignAnimalResp;
};

export type CampaignOwnerResp = {
  owner: string;
  ownerPublicKey: string;
};

export type CampaignAnimalResp = {
  earTag: string;
  name: string;
  farm: string;
  age: number;
};

export type CampaignMetaResp = {
  title: string;
  description: string;
  deadline: string;
  collectedAmount: string;
  totalBoxes: number;
  boxesSold: number;
  isStopped: string;
};

export type CampaignStakeholderListResp = {
  farmer: StakeholderResp;
  butcher: StakeholderResp;
  delivery: StakeholderResp;
};

export type StakeholderResp = {
  owner: string;
  share: number;
}

export type BoxResp = {
  title: string;
  description: string;
  price: number;
};

export type BoxOfferResp = {
  id: number;
  available: number;
  total: number;
  box: BoxResp;
};

export type BoxSellRefResp = {
  id: number;
  owner: string;
  physAddress: string;
  box: BoxResp;
}
