// @ts-nocheck

import { Injectable } from '@angular/core';
import { ContractAbi } from 'web3';

import Campaign from '../models/campaign';
import Crowdfunding from '../../assets/abi/Crowdfunding.json';
import BoxOffer from '../models/boxOffer';
import { CreateCampaignReq, BoxOfferReq } from '../models/requestModels';
import { BoxSellRefResp, CampaignResp } from '../models/responseModels';
import ContractService from './contract.service';
import Box from '../models/box';
import BoxSellRef from '../models/boxSellRef';

@Injectable({
  providedIn: 'root'
})
export class CrowdfundingService extends ContractService {

  private readonly _contractAddress: string = '0x72e3092661627bbA2B072130B522f2933fA85948';

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
              campaign.title,
              campaign.description,
              campaign.duration,
              campaign.owner,
              campaign.stakeholders,
              campaign.animal,
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
          let campaigns: CampaignResp[] = await contract
            .methods
            .getCampaigns()
            .call();
          campaigns = campaigns.map(resp => Campaign.fromResponse(resp));
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
      try {
        const campaigns = (await this.getCampaigns()).filter(campaign => campaign.id == campaignId);
        if (campaigns.length > 0) {
          resolve(campaigns[0]);
        } else {
          reject();
        }
      } catch(err) {
        reject(err);
      }
    });
  }

  getBoxes(campaignId: number): Promise<Box[]> {
    return new Promise(async (resolve, reject) => {
      const contract = this.getContract();
      if (contract) {
        try {
          let boxes: BoxResp[] = await contract
            .methods
            .getBoxes(campaignId)
            .call();
          boxes = boxes.map(resp => Box.fromResponse(resp));
          resolve(boxes);
        } catch (err) {
          reject(err);
        }
      } else {
        reject();
      }
    });
  }

  getBox(campaignId: number, boxId: number): Promise<Box> {
    return this.getBoxes(campaignId).then(boxes => {
      return boxes.filter(box => box.id == boxId)[0];
    });
  }

  getAvailableBoxes(campaignId: number): Promise<Box[]> {
    return this.getBoxes(campaignId).then(boxes => {
      return boxes.filter(box => box.available > 0);
    });
  }

  getSoldBoxes(campaignId: number): Promise<BoxSellRef[]> {
    return new Promise(async (resolve, reject) => {
      const contract = this.getContract();
      if (contract) {
        try {
          let boxes: BoxSellRefResp[] = await contract
            .methods
            .getSoldBoxes(campaignId)
            .call();
          boxes = boxes.map(resp => BoxSellRef.fromResponse(resp));
          resolve(boxes);
        } catch (err) {
          reject(err);
        }
      } else {
        reject();
      }
    });
  }

  getSoldBox(campaignId: number, boxId: number): Promise<BoxSellRef> {
    return this.getSoldBoxes(campaignId).then(boxes => {
      return boxes.filter(box => box.id == boxId)[0];
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

  async buyBox(campaignId: number, boxId: number, address: string, value: string) {
    const contract = this.getContract();
    if (contract) {
      await contract
        .methods
        .buyBox(campaignId, boxId, address)
        .send({ from: this.selectedAddress, value });
    } else {
      throw('');
    }
  }

  async payOut(campaignId: number) {
    const contract = this.getContract();
    if (contract) {
      await contract
        .methods
        .payOut(campaignId)
        .send({ from: this.selectedAddress });
    } else {
      throw('');
    }
  }

}
