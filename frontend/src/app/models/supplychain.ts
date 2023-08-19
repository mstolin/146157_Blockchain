import Stakeholder from './stakeholder';
import {
  AnimalDeliverStatus,
  AnimalProcessStatus,
  BoxesDeliverStatus,
  BoxesDistributionStatus,
  BoxesProcessStatus,
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
    private readonly _areBoxesProcessed: BoxesProcessStatus;
    private readonly _areBoxesDistributed: BoxesDistributionStatus;
    private readonly _areBoxesDelivered: BoxesDeliverStatus;
    private readonly _totalBoxes: number;
    private readonly _deliveredBoxes: number;
    private readonly _stakeholders: Stakeholders;

    constructor(
        campaignRef: number,
        isStarted: boolean,
        isAnimalDelivered: AnimalDeliverStatus,
        isAnimalProcessed: AnimalProcessStatus,
        areBoxesProcessed: BoxesProcessStatus,
        areBoxesDistributed: BoxesDistributionStatus,
        areBoxesDelivered: BoxesDeliverStatus,
        totalBoxes: number,
        deliveredBoxes: number,
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

    get isAnimalDeliveredFromFarmer() {
      return this._isAnimalDelivered.farmer;
    }

    get isAnimalDeliveredToButcher() {
        return this._isAnimalDelivered.butcher;
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

    get areBoxesDistributedFromButcher() {
      return this._areBoxesDistributed.butcher;
    }

    get areBoxesDistributedToDelivery() {
      return this._areBoxesDistributed.delivery;
    }

    get areBoxesDelivered() {
        return this._areBoxesDelivered.delivery;
    }

    get totalBoxes() {
        return this._totalBoxes;
    }

    get deliveredBoxes() {
      return this._deliveredBoxes;
    }

    get stakeholders() {
        return this._stakeholders;
    }
}
