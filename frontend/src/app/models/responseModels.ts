export type CampaignRefResp = {
  id: number;
  campaign: CampaignResp;
};

export type StakeholderResp = {
  owner: string;
  share: number;
}

export type CampaignResp = {
  title: string;
  description: string;
  owner: string;
  deadline: string;
  collectedAmount: string;
  boxesLeft: string;
  isStopped: string;
  farmer: StakeholderResp;
  butcher: StakeholderResp;
  delivery: StakeholderResp;
};

export type BoxResp = {
  title: string;
  description: string;
  price: number;
};

export type BoxOfferResp = {
  available: number;
  total: number;
  box: BoxResp;
};
