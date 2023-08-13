// @ts-nocheck

import { ContractAbi } from 'web3';
import { Injectable } from '@angular/core';

import { SupplyChainResp } from '../models/responseModels';
import { AnimalDeliverStatus, AnimalProcessStatus, BoxProcessStatus, BoxDistributionStatus, BoxDeliverStatus } from '../models/supplychainStates';

@Injectable({
  providedIn: 'root'
})
export class SupplychainService {

  private readonly _contractAddress: string = "";

  constructor() {
    super();
  }

  override getContract(): Contract<ContractAbi> | undefined {
    if (this.web3) {
      return new this.web3.eth.Contract(
        SupplyChain.abi,
        this._contractAddress,
      );
    } else {
      return undefined;
    }
  }

  getSupplyChains(): Promise<SupplyChain> {
    return new Promise(async (resolve, reject) => {
      const contract = this.getContract();
      if (contract) {
        try {
          let supplychains: SupplyChainResp[] = await contract.
            methods
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


}
