// @ts-nocheck

import { Injectable } from '@angular/core';
import { Web3, Web3EthInterface, eth } from 'web3';

import Campaign from '../models/campaign';
import Crowdfunding from '../../assets/abi/Crowdfunding.json';
import BoxOffer from '../models/boxOffer';
import Box from '../models/box';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrowdfundingService {

  private web3?: Web3;
  private selectedAddress?: string;
  private contract?: Web3EthInterface.Contract;

  constructor() {

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

  async getCampaigns(): Observable<Campaign> {
    const { ethereum } = window as any;
    const web3 = new Web3(ethereum);

    const contract = new web3.eth.Contract(
      Crowdfunding.abi,
      '0xb9d1f4d6878d22aa50c1da31f40b8c3a88b31b5e',
    );

    contract
      .methods
      .getCampaigns()
      .call()
      .then(res => console.log("RES", res))
      .catch(err => console.log("ERR", err));
  }

}
