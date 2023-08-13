import Stakeholder from './stakeholder';
import { AnimalDeliverStatus, AnimalProcessStatus, BoxDeliverStatus, BoxDistributionStatus, BoxProcessStatus } from './supplychainStates';
import {SupplyChainResp} from "./responseModels";

type Stakeholders = {
    farmer: Stakeholder;
    butcher: Stakeholder;
    delivery: Stakeholder;
};

export default class SupplyChain {

    private readonly _campaignRef: number;
    private readonly _isAnimalDelivered: AnimalDeliverStatus;
    private readonly _isAnimalProcessed: AnimalProcessStatus;
    private readonly _areBoxesProcessed: BoxProcessStatus;
    private readonly _areBoxesDistributed: BoxDistributionStatus;
    private readonly _areBoxesDelivered: BoxDeliverStatus;
    private readonly _totalBoxes: number;
    private readonly _processedBoxes: number;
    private readonly _distributedBoxes: number;
    private readonly _deliveredBoxes: number;
    private readonly _stakeholders: Stakeholders;

    constructor(
        campaignRef: number,
        isAnimalDelivered: AnimalDeliverStatus,
        isAnimalProcessed: AnimalProcessStatus,
        areBoxesProcessed: BoxProcessStatus,
        areBoxesDistributed: BoxDistributionStatus,
        areBoxesDelivered: BoxDeliverStatus,
        totalBoxes: number,
        processedBoxes: number,
        distributedBoxes: number,
        deliveredBoxes: number,
        stakeholders: Stakeholders
    ) {
        this._campaignRef = campaignRef;
        this._isAnimalDelivered = isAnimalDelivered;
        this._isAnimalProcessed = isAnimalProcessed;
        this._areBoxesProcessed = areBoxesProcessed;
        this._areBoxesDistributed = areBoxesDistributed;
        this._areBoxesDelivered = areBoxesDelivered;
        this._totalBoxes = totalBoxes;
        this._processedBoxes = processedBoxes;
        this._distributedBoxes = distributedBoxes;
        this._deliveredBoxes = deliveredBoxes;
        this._stakeholders = stakeholders;
    }

    static fromResponse(resp: SupplyChainResp): SupplyChain {
      return new SupplyChain(
        resp.campaignRef,
        resp.isAnimalDelivered,
        resp.isAnimalProcessed,
        resp.areBoxesProcessed,
        resp.areBoxesDistributed,
        resp.areBoxesDelivered,
        resp.totalBoxes,
        resp.processedBoxes,
        resp.distributedBoxes,
        resp.deliveredBoxes,
        {
          farmer: Stakeholder.fromResponse(resp.stakeholders.farmer),
          butcher: Stakeholder.fromResponse(resp.stakeholders.butcher),
          delivery: Stakeholder.fromResponse(resp.stakeholders.delivery)
        }
      );
    }

    get id() {
        return this._campaignRef;
    }

    get isAnimalDelivered() {
        return this._isAnimalDelivered.butcher && this._isAnimalDelivered.farmer;
    }

    get isAnimalProcessed() {
        return this._isAnimalProcessed.butcher;
    }

    get areBoxesProcessed() {
        return this._areBoxesProcessed.butcher;
    }

    get areBoxesDistributed() {
        return this._areBoxesDistributed.butcher && this._areBoxesDistributed.delivery;
    }

    get areBoxesDelivered() {
        return this._areBoxesDelivered.delivery;
    }

    get totalBoxes() {
        return this._totalBoxes;
    }

    get processedBoxes() {
      return this._processedBoxes;
    }

    get distributedBoxes() {
      return this._distributedBoxes;
    }

    get deliveredBoxes() {
      return this._deliveredBoxes;
    }

    get stakeholders() {
        return this._stakeholders;
    }
}
