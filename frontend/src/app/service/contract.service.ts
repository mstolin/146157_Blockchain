import { Contract, ContractAbi, Web3 } from 'web3';

abstract class ContractService {

  private readonly _web3?: Web3;

  constructor() {
    const { ethereum } = window as any;
    if (ethereum) {
      this._web3 = new Web3(ethereum);
    }
  }

  get web3(): Web3 | undefined {
    return this._web3;
  }

  get selectedAddress(): string | undefined {
    const { ethereum } = window as any;
    if (ethereum) {
      return Web3.utils.toChecksumAddress(ethereum.selectedAddress);
    } else {
      return undefined;
    }
  }

  abstract getContract(): Contract<ContractAbi> | undefined;

}

export default ContractService;
