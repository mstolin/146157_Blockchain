export type CampaignRefResp = {
  id: number;
  campaign: CampaignResp;
};

export type CampaignResp = {
  title: string;
  description: string;
  owner: string;
  deadline: string;
  collectedAmount: string;
  boxesLeft: string;
  isStopped: string;
};
