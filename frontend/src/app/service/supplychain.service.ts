// @ts-nocheck

import { ContractAbi } from 'web3';
import { Injectable } from '@angular/core';

import SupplyChains from '../../assets/abi/SupplyChains.json';
import { SupplyChainResp } from '../models/responseModels';
import SupplyChain from "../models/supplychain";
import ContractService from "./contract.service";
import BoxStatus from "../models/boxStatus";

@Injectable({
  providedIn: 'root'
})
export class SupplyChainService extends ContractService {

  private readonly _contractAddress: string = "0xb25c4D54D426AAfF78DFE940f387f0a4C4eeaDED";

  constructor() {
    super();
  }

  override getContract(): Contract<ContractAbi> | undefined {
    if (this.web3) {
      return new this.web3.eth.Contract(
        SupplyChains.abi,
        this._contractAddress,
      );
    } else {
      return undefined;
    }
  }

  getSupplyChains(): Promise<SupplyChain[]> {
    return new Promise(async (resolve, reject) => {
      const contract = this.getContract();
      if (contract) {
        try {
          let supplychains: SupplyChainResp[] = await contract
              .methods
              .getSupplyChains()
              .call();
          supplychains = supplychains.map(resp => SupplyChain.fromResponse(resp));
          resolve(supplychains);
        } catch (err) {
          reject(err);
        }
      } else {
        reject();
      }
    });
  }

  getSupplyChain(campaignRef: number): Promise<SupplyChain> {
    return new Promise(async (resolve, reject) => {
      try {
        const supplychains = (await this.getSupplyChains()).filter(supplychain => supplychain.campaignRef == campaignRef);
        if (supplychains.length > 0) {
          resolve(supplychains[0]);
        } else {
          reject();
        }
      } catch(err) {
        reject(err);
      }
    });
  }

  getBoxesStatus(campaignRef: number): Promise<BoxStatus[]> {
    return new Promise(async (resolve, reject) => {
      const contract = this.getContract();
      if (contract) {
        try {
          let boxesStatus: BoxStatusResp[] = await contract
              .methods
              .getBoxesStatus(campaignRef)
              .call();
          boxesStatus = boxesStatus.map(resp => BoxStatus.fromResponse(resp));
          resolve(boxesStatus);
        } catch (err) {
          reject(err);
        }
      } else {
        reject();
      }
    });
  }

  getBoxStatus(campaignRef: number, boxId: number): Promise<BoxStatus> {
    return new Promise(async (resolve, reject) => {
      try {
        const boxesStatus = (await this.getBoxesStatus(campaignRef)).filter(boxStatus => boxStatus.boxId == boxId);
        if (boxesStatus.length > 0) {
          resolve(boxesStatus[0]);
        } else {
          reject();
        }
      } catch(err) {
        reject(err);
      }
    });
  }

  isSupplyChainCompleted(campaignRef: number): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const contract = this.getContract();
      if (contract) {
        try {
          const isCompleted = await contract
              .methods
              .isCompleted(campaignRef)
              .call();
          resolve(isCompleted);
        } catch (err) {
          reject(err);
        }
      } else {
        reject();
      }
    });
  }

  async markAnimalAsDelivered(campaignRef: number) {
    const contract = this.getContract();
    if (contract) {
      await contract
        .methods
        .markAnimalAsDelivered(campaignRef)
        .send({ 'from': this.selectedAddress });
    } else {
      throw('');
    }
  }

  async markAnimalAsProcessed(campaignRef: number) {
    const contract = this.getContract();
    if (contract) {
      await contract
        .methods
        .markAnimalAsProcessed(campaignRef)
        .send({'from': this.selectedAddress});
    } else {
      throw('');
    }
  }

  async markBoxesAsProcessed(campaignRef: number) {
    const contract = this.getContract();
    if (contract) {
      await contract
        .methods
        .markBoxesAsProcessed(campaignRef)
        .send({'from': this.selectedAddress});
    } else {
      throw('');
    }
  }

  async markBoxesAsDistributed(campaignRef: number) {
    const contract = this.getContract();
    if (contract) {
      await contract
        .methods
        .markBoxesAsDistributed(campaignRef)
        .send({'from': this.selectedAddress});
    } else {
      throw('');
    }
  }

  async markBoxAsDelivered(campaignRef: number, boxId: number) {
    const contract = this.getContract();
    if (contract) {
      await contract
        .methods
        .markBoxAsDelivered(campaignRef, boxId)
        .send({'from': this.selectedAddress});
    } else {
      throw('');
    }
  }
}
