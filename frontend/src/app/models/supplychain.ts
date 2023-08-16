import Stakeholder from './stakeholder';
import {
  AnimalDeliverStatus,
  AnimalProcessStatus,
  BoxDeliverStatus,
  BoxDistributionStatus,
  BoxProcessStatus, DeliveredBoxesCounter, DistributedBoxesCounter,
  ProcessedBoxesCounter
} from './supplychainStates';
import { SupplyChainResp } from "./responseModels";

type Stakeholders = {
    farmer: Stakeholder;
    butcher: Stakeholder;
    delivery: Stakeholder;
};

export default class SupplyChain {

    private readonly _campaignRef: number;
    private readonly _isStarted: boolean;
    private readonly _isAnimalDelivered: AnimalDeliverStatus;
    private readonly _isAnimalProcessed: AnimalProcessStatus;
    private readonly _areBoxesProcessed: BoxProcessStatus;
    private readonly _areBoxesDistributed: BoxDistributionStatus;
    private readonly _areBoxesDelivered: BoxDeliverStatus;
    private readonly _totalBoxes: number;
    private readonly _processedBoxes: ProcessedBoxesCounter;
    private readonly _distributedBoxes: DistributedBoxesCounter;
    private readonly _deliveredBoxes: DeliveredBoxesCounter;
    private readonly _stakeholders: Stakeholders;

    constructor(
        campaignRef: number,
        isStarted: boolean,
        isAnimalDelivered: AnimalDeliverStatus,
        isAnimalProcessed: AnimalProcessStatus,
        areBoxesProcessed: BoxProcessStatus,
        areBoxesDistributed: BoxDistributionStatus,
        areBoxesDelivered: BoxDeliverStatus,
        totalBoxes: number,
        processedBoxes: ProcessedBoxesCounter,
        distributedBoxes: DistributedBoxesCounter,
        deliveredBoxes: DeliveredBoxesCounter,
        stakeholders: Stakeholders
    ) {
        this._campaignRef = campaignRef;
        this._isStarted = isStarted;
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
        resp.isStarted,
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

    get campaignRef() {
        return this._campaignRef;
    }

    get isStarted() {
      return this._isStarted;
    }

    get isAnimalDelivered() {
        return (this._isAnimalDelivered.butcher && this._isAnimalDelivered.farmer);
    }

    get isAnimalDeliveredButcher() {
        return this._isAnimalDelivered.butcher;
    }

    get isAnimalDeliveredFarmer() {
        return this._isAnimalDelivered.farmer;
    }

    get isAnimalProcessed() {
        return this._isAnimalProcessed.butcher;
    }

    get areBoxesProcessed() {
        return this._areBoxesProcessed.butcher;
    }

    get areBoxesDistributed() {
        return (this._areBoxesDistributed.butcher && this._areBoxesDistributed.delivery);
    }

    get areBoxesDelivered() {
        return this._areBoxesDelivered.delivery;
    }

    get totalBoxes() {
        return this._totalBoxes;
    }

    get processedBoxes() {
      return this._processedBoxes.butcher;
    }

    get distributedBoxes() {
      if (this._distributedBoxes.butcher >= this._distributedBoxes.delivery) {
        return this._distributedBoxes.butcher;
      } else {
        return this._distributedBoxes.delivery;
      }
    }

    get deliveredBoxes() {
      return this._deliveredBoxes.delivery;
    }

    get stakeholders() {
        return this._stakeholders;
    }
}
