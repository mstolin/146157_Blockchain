// @ts-nocheck

import { Injectable } from '@angular/core';
import { ContractAbi } from 'web3';

import Campaign from '../models/campaign';
import Crowdfunding from '../../assets/abi/Crowdfunding.json';
import BoxOffer from '../models/boxOffer';
import { CreateCampaignReq, BoxOfferReq } from '../models/requestModels';
import { BoxOfferResp, BoxSellRefResp, CampaignRefResp } from '../models/responseModels';
import ContractService from './contract.service';
import Stakeholder from '../models/stakeholder';
import Box from '../models/box';

@Injectable({
  providedIn: 'root'
})
export class CrowdfundingService extends ContractService {

  private readonly _contractAddress: string = '0x53F6419b0E262d7e25b14e319Cff819C0Bb5E5FC';

  constructor() {
    super();
  }

  private mapCampaign(ref: CampaignRefResp): Campaign {
    const campaign = ref.campaign;
    const deadline = new Date(Number(campaign.deadline) * 1000);
    return new Campaign(
      ref.id,
      campaign.title,
      campaign.description,
      campaign.owner,
      campaign.ownerPublicKey,
      deadline,
      Number(campaign.collectedAmount),
      Number(campaign.boxesLeft),
      campaign.isStopped,
      new Stakeholder(campaign.farmer.owner, campaign.farmer.share),
      new Stakeholder(campaign.butcher.owner, campaign.butcher.share),
      new Stakeholder(campaign.delivery.owner, campaign.delivery.share)
    );
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
              campaign.ownerPublicKey,
              campaign.title,
              campaign.description,
              campaign.duration,
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
          campaigns = campaigns.map(ref => this.mapCampaign(ref));
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
          const campaign = this.mapCampaign(ref);
          resolve(campaign);
        } catch (err) {
          reject(err);
        }
      } else {
        reject();
      }
    });
  }

  getBoxes(campaignId: number): Promise<Box[]> {
    return new Promise(async (resolve, reject) => {
      const contract = this.getContract();
      if (contract) {
        try {
          let boxes: BoxOfferResp[] = await contract
            .methods
            .getBoxes(campaignId)
            .call();
          console.log('BOXES', boxes);
          boxes = boxes.map(offer => {
            const box = offer.box;
            return new Box(offer.id, box.title, box.description, box.price, offer.total, offer.available);
          });
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
      console.log(boxes);
      return boxes.filter(box => box.available > 0);
    });
  }

  getSoldBoxes(campaignId: number): Promise<BoxSellRefResp[]> {
    return new Promise(async (resolve, reject) => {
      const contract = this.getContract();
      if (contract) {
        try {
          let boxes: BoxSellRefResp[] = await contract
            .methods
            .getSoldBoxes(campaignId)
            .call();
          /*boxes = boxes.map(offer => {
            const box = offer.box;
            return new Box(offer.id, box.title, box.description, box.price, offer.total, offer.available);
          });*/
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

}
