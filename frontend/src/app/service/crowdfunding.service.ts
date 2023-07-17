// @ts-nocheck

import { Injectable } from '@angular/core';
import { ContractAbi } from 'web3';

import Campaign from '../models/campaign';
import Crowdfunding from '../../assets/abi/Crowdfunding.json';
import BoxOffer from '../models/boxOffer';
import { CreateCampaignReq, BoxOfferReq } from '../models/requestModels';
import { CampaignRefResp } from '../models/responseModels';
import ContractService from './contract.service';

@Injectable({
  providedIn: 'root'
})
export class CrowdfundingService extends ContractService {

  private readonly _contractAddress: string = '0x5e3163C42DF556Be7E2A0fb555f686fCccdE0aa8';

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
            .methods.createCampaign(
              campaign.owner,
              campaign.title,
              campaign.description,
              Number(campaign.duration),
              campaign.farmer,
              campaign.butcher,
              campaign.delivery,
              boxes
            )
            .send({ 'from': this.selectedAddress });

          resolve([campaign, boxes]);
        } catch (err) {
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
          let campaigns: CampaignRefResp[] = await contract
            .methods
            .getCampaigns()
            .call();
          campaigns = campaigns.map(ref => {
            const campaign = ref.campaign;
            const deadline = new Date(Number(campaign.deadline) * 1000);
            return new Campaign(
              ref.id,
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
          let ref: CampaignRefResp = await contract
            .methods
            .getCampaign(campaignId)
            .call();

          const campaign = ref.campaign;
          const deadline = new Date(Number(campaign.deadline) * 1000);

          resolve(new Campaign(
            ref.id,
            campaign.title,
            campaign.description,
            campaign.owner,
            deadline,
            Number(campaign.collectedAmount),
            Number(campaign.boxesLeft),
            campaign.isStopped
          ));
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
