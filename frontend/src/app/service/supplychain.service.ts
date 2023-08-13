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

  private readonly _contractAddress: string = "0x4DD93311B0e6e3B641912A1FD8962B486146669C";

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
          let supplychain: SupplyChainResp[] = await contract.
            methods
            .getSupplyChains()
            .call();
            supplychain = supplychain.map(resp => SupplyChain.fromResponse(resp));
            resolve(supplychain);
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
        const supplychain = (await this.getSupplyChains()).filter(supplychain => supplychain.campaignRef == campaignRef);
        if (supplychain.length > 0) {
          resolve(supplychain[0]);
        } else {
          reject();
        }
      } catch(err) {
        reject(err);
      }
    });
  }

  markAnimalAsDelivered(campaignRef: number): Promise {
    return new Promise(async (resolve, reject) => {
      const contract = this.getContract();
      if (contract) {
        try {
          await contract
            .methods
            .markAnimalAsDelivered(campaignRef)
            .call();
          resolve();
        } catch (err) {
          reject(err);
        }
      } else {
        reject();
      }
    });
  }

  markAnimalAsProcessed(campaignRef: number): Promise {
    return new Promise(async (resolve, reject) => {
      const contract = this.getContract();
      if(contract) {
        try {
          await contract
            .methods
            .markAnimalAsProcessed(campaignRef)
            .call();
          resolve();
        } catch (err) {
          reject(err);
        }
      } else {
        reject();
      }
    });
  }

  markBoxAsProcessed(campaignRef: number, boxId: number): Promise {
    return new Promise(async (resolve, reject) => {
      const contract = this.getContract();
      if (contract) {
        try {
          await contract
              .methods
              .markBoxAsProcessed(campaignRef, boxId)
              .call();
          resolve();
        } catch (err) {
          reject(err);
        }
      } else {
        reject();
      }
    });
  }

  markBoxAsDistributed(campaignRef: number, boxId: number): Promise {
    return new Promise(async (resolve, reject) => {
      const contract = this.getContract();
      if (contract) {
        try {
          await contract
              .methods
              .markBoxAsDistributed(campaignRef, boxId)
              .call();
          resolve();
        } catch (err) {
          reject(err);
        }
      } else {
        reject();
      }
    });
  }

  markBoxAsDelivered(campaignRef: number, boxId: number): Promise {
    return new Promise( async (resolve, reject) => {
      const contract = this.getContract();
      if (contract) {
        try {
          await contract
              .methods
              .markBoxAsDelivered(campaignRef, boxId)
              .call();
          resolve();
        } catch(err) {
          reject(err);
        }
      } else {
        reject();
      }
    });
  }

}
