// @ts-nocheck

import { ContractAbi } from 'web3';
import { Injectable } from '@angular/core';

import SupplyChains from '../../assets/abi/SupplyChains.json';
import { SupplyChainResp } from '../models/responseModels';
import SupplyChain from "../models/supplychain";
import ContractService from "./contract.service";

@Injectable({
  providedIn: 'root'
})
export class SupplyChainService extends ContractService {

  private readonly _contractAddress: string = "0x276E6C96BE4962791f3161f2c6Acf6c49C146C4a";

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

  async markBoxAsProcessed(campaignRef: number, boxId: number) {
    const contract = this.getContract();
    if (contract) {
      await contract
        .methods
        .markBoxAsProcessed(campaignRef, boxId)
        .send({'from': this.selectedAddress});
    } else {
      throw('');
    }
  }

  async markBoxAsDistributed(campaignRef: number, boxId: number) {
    const contract = this.getContract();
    if (contract) {
      await contract
        .methods
        .markBoxAsDistributed(campaignRef, boxId)
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

  getProcessedBoxesStatus(campaignRef: number): Promise<boolean[]> {
    return new Promise(async (resolve, reject) => {
      const contract = this.getContract();
      if (contract) {
        try {
          let processedBoxesStatus: boolean[] = await contract
              .methods
              .getBoxesStatus(campaignRef, 0)
              .call();
          resolve(processedBoxesStatus);
        } catch (err) {
          reject(err);
        }
      } else {
        reject();
      }
    });
  }

  getDistributedBoxesStatus(campaignRef: number): Promise<boolean[]> {
    return new Promise(async (resolve, reject) => {
      const contract = this.getContract();
      if (contract) {
        try {
          let distributedBoxesStatus: boolean[] = await contract
              .methods
              .getBoxesStatus(campaignRef, 1)
              .call();
          resolve(distributedBoxesStatus);
        } catch (err) {
          reject(err);
        }
      } else {
        reject();
      }
    });
  }

  getDeliveredBoxesStatus(campaignRef: number): Promise<boolean[]> {
    return new Promise(async (resolve, reject) => {
      const contract = this.getContract();
      if (contract) {
        try {
          let deliveredBoxesStatus: boolean[] = await contract
              .methods
              .getBoxesStatus(campaignRef, 2)
              .call();
          resolve(deliveredBoxesStatus);
        } catch (err) {
          reject(err);
        }
      } else {
        reject();
      }
    });
  }
}
