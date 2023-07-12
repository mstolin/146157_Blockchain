// @ts-nocheck

import { Injectable } from '@angular/core';
import { ContractAbi } from 'web3';

import Campaign from '../models/campaign';
import Crowdfunding from '../../assets/abi/Crowdfunding.json';
import BoxOffer from '../models/boxOffer';
import Box from '../models/box';
import ContractService from './contract.service';

type CampaignRes = {
  title: string;
  description: string;
  owner: string;
  progress: number;
  deadline: bigint;
  collectedAmount: bigint;
};

@Injectable({
  providedIn: 'root'
})
export class CrowdfundingService extends ContractService {

  private readonly _contractAddress: string = '0xb9d1f4d6878d22aa50c1da31f40b8c3a88b31b5e';

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

  async createCampaign(campaign: Campaign): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const contract = this.getContract();
      if (contract) {
        try {
          const boxes = [
            new BoxOffer(new Box('Super box', 'very nice', 100, 2), 1, 1),
          ];

          await contract
            .methods.createCampaign(campaign.owner, campaign.title, campaign.description, 1000000000, boxes)
            .send({ 'from': this.selectedAddress });

          resolve(true);
        } catch(err) {
          reject(false);
        }
      } else {
        reject(false);
      }
    });
  }

  async getCampaigns(): Promise<Campaign[]> {
    return new Promise(async (resolve, reject) => {
      const contract = this.getContract();
      if (contract) {
        try {
          let campaigns: CampaignRes[] = await contract
            .methods
            .getCampaigns()
            .call();
          campaigns = campaigns.map(campaign => {
            const deadline = new Date(Number(campaign.deadline) * 1000);
            return new Campaign(
              campaign.title,
              campaign.description,
              campaign.owner,
              campaign.progress,
              deadline,
              campaign.collectedAmount);
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

}
