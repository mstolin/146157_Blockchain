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

  private readonly _contractAddress: string = "0x47A26CF68D09CbbcF1cCE3Ce6D324012c8f749c1";

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

  getProcessedBoxesStatus(campaignRef: number): Promise<boolean[]> {
    return new Promise(async (resolve, reject) => {
      const contract = this.getContract();
      if (contract) {
        try {
          let processedBoxesStatus: boolean[] = await contract
              .methods
              .getProcessedBoxStatus(campaignRef)
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
              .getDistributedBoxStatus(campaignRef)
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
              .getDeliveredBoxStatus(campaignRef)
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
