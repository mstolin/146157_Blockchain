import {
  AnimalDeliverStatus,
  AnimalProcessStatus,
  BoxDeliverStatus,
  BoxDistributionStatus,
  BoxProcessStatus, DeliveredBoxesCounter, DistributedBoxesCounter,
  ProcessedBoxesCounter
} from "./supplychainStates";

export type CampaignResp = {
  id: number;
  info: CampaignInfoResp;
  meta: CampaignMetaResp;
  stakeholders: CampaignStakeholderListResp;
  owner: CampaignOwnerResp;
  animal: CampaignAnimalResp;
};

export type CampaignInfoResp = {
  title: string;
  description: string;
  deadline: number;
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
  collectedAmount: number;
  totalBoxes: number;
  boxesSold: number;
  createdAt: number;
  totalBoxTypes: number;
  isStopped: boolean;
};

export type CampaignStakeholderListResp = {
  farmer: StakeholderResp;
  butcher: StakeholderResp;
  delivery: StakeholderResp;
};

export type StakeholderResp = {
  owner: string;
  share: number;
  info: string;
}

export type BoxResp = {
  id: number;
  title: string;
  description: string;
  price: number;
  total: number;
  available: number;
};

export type BoxSellRefResp = {
  id: number;
  boxId: number;
  owner: string;
  physAddress: string;
  boughtAt: number;
}

export type SupplyChainResp = {
  campaignRef: number;
  isStarted: boolean;
  isAnimalDelivered: AnimalDeliverStatus;
  isAnimalProcessed: AnimalProcessStatus;
  areBoxesProcessed: BoxProcessStatus;
  areBoxesDistributed: BoxDistributionStatus;
  areBoxesDelivered: BoxDeliverStatus;
  totalBoxes: number;
  processedBoxes: ProcessedBoxesCounter;
  distributedBoxes: DistributedBoxesCounter;
  deliveredBoxes: DeliveredBoxesCounter;
  stakeholders: CampaignStakeholderListResp;
};

export type BoxStatusResp = {
  campaignRef: number;
  boxId: number;
  isProcessed: boolean;
  isDistributedFromButcher: boolean;
  isDistributedToDelivery: boolean;
  isDelivered: boolean;
}
