// @ts-nocheck

import { Injectable } from '@angular/core';
import Web3, { ContractAbi } from 'web3';

import Campaign from '../models/campaign';
import Crowdfunding from '../../assets/abi/Crowdfunding.json';
import BoxOffer from '../models/boxOffer';
import ContractService from './contract.service';
import CampaignRef from '../models/campaignRef';

type CampaignResp = {
  title: string;
  description: string;
  owner: string;
  deadline: string;
  collectedAmount: string;
  boxesLeft: string;
  isStopped: string;
};
type CreateCampaignReq = {
  owner: string,
  title: string;
  description: string;
  duration: number;
}
type BoxReq = {
  title: string;
  description: string;
  price: number;
};
type BoxOfferReq = {
  total: number;
  available: number;
  box: BoxReq
};

@Injectable({
  providedIn: 'root'
})
export class CrowdfundingService extends ContractService {

  private readonly _contractAddress: string = '0x5Ecc3617a452fa0341C374085b963CAA39c9f699';

  constructor() {
    super();
  }

  override getContract(): Contract<ContractAbi> | undefined {
    if (this.web3) {
      return new this.web3.eth.Contract(
        Crowdfunding.abi,
        this._contractAddress,
      );
    } else {
      return undefined;
    }
  }

  createCampaign(campaign: CreateCampaignReq, boxes: BoxOfferReq[]): Promise<[Campaign, BoxOffer[]]> {
    return new Promise(async (resolve, reject) => {
      const contract = this.getContract();
      if (contract) {
        try {
          await contract
            .methods.createCampaign(campaign.owner, campaign.title, campaign.description, Number(campaign.duration), boxes)
            .send({ 'from': this.selectedAddress });

          resolve([campaign, boxes]);
        } catch(err) {
          reject(err);
        }
      } else {
        reject();
      }
    });
  }

  getCampaigns(): Promise<Campaign[]> {
    return new Promise(async (resolve, reject) => {
      const contract = this.getContract();
      if (contract) {
        try {
          let campaigns: CampaignResp[] = await contract
            .methods
            .getCampaigns()
            .call();
          campaigns = campaigns.map(res => res.campaign).map(campaign => {
            const deadline = new Date(Number(campaign.deadline) * 1000);
            return new Campaign(
              campaign.title,
              campaign.description,
              campaign.owner,
              deadline,
              Number(campaign.collectedAmount),
              Number(campaign.boxesLeft),
              campaign.isStopped
            );
          });
          resolve(campaigns);
        } catch (err) {
          reject(err);
        }
      } else {
        reject();
      }
    });
  }

  getCampaign(campaignId: number): Promise<Campaign> {
    return new Promise(async (resolve, reject) => {
      const contract = this.getContract();
      if (contract) {
        try {
          let campaign: CampaignResp = await contract
            .methods
            .getCampaign(campaignId)
            .call();

          const deadline = new Date(Number(campaign.deadline) * 1000);
          campaign = Campaign(
            campaign.title,
            campaign.description,
            campaign.owner,
            deadline,
            BigInt(campaign.collectedAmount),
            BigInt(campaign.boxesLeft),
            campaign.isStopped
          );

          resolve(campaign);
        } catch (err) {
          reject(err);
        }
      } else {
        reject();
      }
    });
  }

  getBoxes(campaignId: number): Promise<BoxOffer[]> {
    return new Promise(async (resolve, reject) => {
      const contract = this.getContract();
      if (contract) {
        try {
          let boxes: BoxOffer[] = await contract
            .methods
            .getBoxes(campaignId)
            .call();
          resolve(boxes);
        } catch (err) {
          reject(err);
        }
      } else {
        reject();
      }
    });
  }

  stopCampaign(campaignId: number): Promise {
    return new Promise(async (resolve, reject) => {
      const contract = this.getContract();
      if (contract) {
        try {
          await contract
            .methods
            .stopCampaign(campaignId)
            .send({ 'from': this.selectedAddress });
          resolve();
        } catch (err) {
          reject(err);
        }
      } else {
        reject();
      }
    });
  }

  buyBox(campaignId: number, boxId: number): Promise {
    return new Promise(async (resolve, reject) => {
      const contract = this.getContract();
      if (contract) {
        try {
          await contract
            .methods
            .buyBox(campaignId, boxId)
            .send({ 'from': this.selectedAddress });
          resolve();
        } catch (err) {
          reject(err);
        }
      } else {
        reject();
      }
    });
  }

}
