export type CreateCampaignReq = {
  owner: string,
  title: string;
  description: string;
  duration: number;
  farmer: StakeholderReq;
  butcher: StakeholderReq;
  delivery: StakeholderReq;
}
export type StakeholderReq = {
  address: string;
  share: number;
}
export type BoxReq = {
  title: string;
  description: string;
  price: number;
};
export type BoxOfferReq = {
  total: number;
  available: number;
  box: BoxReq
};
