// @ts-nocheck

import { Injectable } from '@angular/core';
import { ContractAbi, Web3 } from 'web3';

import Campaign from '../models/campaign';
import Crowdfunding from '../../assets/abi/Crowdfunding.json';
import BoxOffer from '../models/boxOffer';
import Box from '../models/box';
import ContractService from './contract.service';

type CampaignRes = {
  title: string;
  description: string;
  owner: string;
  progress: bigint;
  deadline: bigint;
  collectedAmount: bigint;
};

@Injectable({
  providedIn: 'root'
})
export class CrowdfundingService extends ContractService {

  /*private web3?: Web3;
  private selectedAddress?: string;
  private contract?: Web3EthInterface.Contract;*/

  /*constructor() {
    const { ethereum } = window as any;
    if (ethereum) {
      this.web3 = new Web3(ethereum);
      this.selectedAddress = Web3.utils.toChecksumAddress(ethereum.selectedAddress);
      this.contract = new this.web3.eth.Contract(
        Crowdfunding.abi,
        '0xb9d1f4d6878d22aa50c1da31f40b8c3a88b31b5e',
      );
    }
  }*/

  private readonly _contractAddress: string = '0xb9d1f4d6878d22aa50c1da31f40b8c3a88b31b5e';

  constructor() {
    super();
  }

  override getContract(): Contract<ContractAbi> | undefined {
    return new this.web3.eth.Contract(
      Crowdfunding.abi,
      this._contractAddress,
    );
  }

  async createCampaign(campaign: Campaign): Promise<boolean> {
    const { ethereum } = window as any;
    const web3 = new Web3(ethereum);
    const selectedAddress = Web3.utils.toChecksumAddress(ethereum.selectedAddress);

    /*
    TODO PROBIER MAL OB WEB3 mit ethereum provider klappt
    */


    web3.eth.defaultAccount = selectedAddress;
    //const contract = new web3.eth.Contract(Crowdfunding.abi);

    const contract = new web3.eth.Contract(
      Crowdfunding.abi,
      '0xb9d1f4d6878d22aa50c1da31f40b8c3a88b31b5e',
    );

    const boxes = [
      new BoxOffer(new Box('Super box', 'very nice', 100, 2), 1, 1),
    ];

    await contract
      .methods.createCampaign(campaign.owner, campaign.title, campaign.description, 1000000000, boxes)
      .send({ 'from': selectedAddress });
  }

  async getCampaigns(): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      const contract = this.getContract();
      if (contract) {
        try {
          let campaigns: CampaignRes[] = await contract
            .methods
            .getCampaigns()
            .call();
          campaigns = campaigns.map(campaign => new Date(Number(campaign.deadline) * 1000));

          resolve(campaigns);
        } catch(err) {
          reject(err);
        }
      } else {
        reject();
      }
    });
  }

}
