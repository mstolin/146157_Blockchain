export type CreateCampaignReq = {
  owner: string,
  ownerPublicKey: string,
  title: string;
  description: string;
  duration: number;
  farmer: StakeholderReq;
  butcher: StakeholderReq;
  delivery: StakeholderReq;
}
export type StakeholderReq = {
  owner: string;
  share: number;
}
export type BoxReq = {
  title: string;
  description: string;
  price: number;
};
export type BoxOfferReq = {
  id: number;
  total: number;
  available: number;
  box: BoxReq
};
