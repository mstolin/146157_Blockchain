// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.13;

import "./SupplyChainsTypes.sol";
import "./CrowdfundingTypes.sol";
import "./Crowdfunding.sol";

contract SupplyChains {

  mapping(uint256 => SupplyChain) public supplychains;

  mapping(uint256 => mapping(uint256 => BoxStatus)) boxesStatus;

  uint256 public NumberOfSupplyChains = 0;

  function StartSupplyChain(Campaign memory _campaign, BoxSellRef[] memory _boxes) external {
    SupplyChain storage supplychain = supplychains[_campaign.id];

    supplychain.campaignRef = _campaign.id;
    supplychain.isAnimalDelivered.butcher = false;
    supplychain.isAnimalDelivered.farmer = false;
    supplychain.isAnimalProcessed.butcher = false;
    supplychain.areBoxesProcessed.butcher = false;
    supplychain.areBoxesDistributed.butcher = false;
    supplychain.areBoxesDistributed.delivery = false;
    supplychain.areBoxesDelivered.delivery = false;

    uint totalNumOfBoxes = 0;
    for (uint256 index = 0; index < _boxes.length; index++) {
      BoxSellRef memory box = _boxes[index];
      totalNumOfBoxes += 1;

      boxesStatus[_campaign.id][box.id].campaignRef = _campaign.id;
      boxesStatus[_campaign.id][box.id].boxId = box.id;
      boxesStatus[_campaign.id][box.id].isProcessed = false;
      boxesStatus[_campaign.id][box.id].isDistributedFromButcher = false;
      boxesStatus[_campaign.id][box.id].isDistributedToDelivery = false;
      boxesStatus[_campaign.id][box.id].isDelivered = false;
    }
    require(totalNumOfBoxes > 0, "There must be at least one box in total");

    supplychain.totalBoxes = totalNumOfBoxes;
    supplychain.processedBoxes = 0;
    supplychain.distributedBoxes = 0;
    supplychain.deliveredBoxes = 0;

    // import stakeholders from campaign
    supplychain.stakeholders = _campaign.stakeholders;

    NumberOfSupplyChains++;
  }

  /**
  * Returns all supply chains
  */
  function getSupplyChains() public view returns (SupplyChain[] memory) {
    SupplyChain[] memory allSupplychains = new SupplyChain[](NumberOfSupplyChains);
    for (uint256 index = 0; index < NumberOfSupplyChains; index++) {
      SupplyChain storage supplychain = supplychains[index];
      allSupplychains[index] = supplychain;
    }
    return allSupplychains;
  }

  /**
  * Returns all boxes status of a specific campaign
  */
  function getBoxesStatus(uint256 _campaignId) public view returns (BoxStatus[] memory) {
    SupplyChain memory supplychain = supplychains[_campaignId];
    BoxStatus[] memory boxesStatuses = new BoxStatus[](supplychain.totalBoxes);
    for (uint256 index = 0; index < supplychain.totalBoxes; index++) {
      boxesStatuses[index] = boxesStatus[_campaignId][index];
    }
    return boxesStatuses;
  }

  /**
  * Returns the total number of supply chains
  */
  function getNumberOfSupplyChains() public view returns (uint256) {
    return NumberOfSupplyChains;
  }

  /**
  * Mark the animal of a campaign as delivered (to the butcher)
  */
  function markAnimalAsDelivered(uint256 _campaignId) public {
    SupplyChain storage supplychain = supplychains[_campaignId];

    require(
      (msg.sender == supplychain.stakeholders.farmer.owner) || (msg.sender == supplychain.stakeholders.butcher.owner),
      "Only the farmer and the butcher can mark the animal as delivered"
    );
    require(!supplychain.isAnimalDelivered.farmer || !supplychain.isAnimalDelivered.butcher, "The animal is already delivered");

    if (msg.sender == supplychain.stakeholders.farmer.owner) {
      supplychain.isAnimalDelivered.farmer = true;
    }
    if (msg.sender == supplychain.stakeholders.butcher.owner) {
      supplychain.isAnimalDelivered.butcher = true;
    }
  }

  /**
  * Mark the animal as processed by the butcher
  */
  function markAnimalAsProcessed(uint256 _campaignId) public {
    SupplyChain storage supplychain = supplychains[_campaignId];

    require(msg.sender == supplychain.stakeholders.butcher.owner, "Only the butcher can mark the animal as processed");
    require((supplychain.isAnimalDelivered.butcher && supplychain.isAnimalDelivered.farmer), "The animal must be delivered before being processed");
    require(!supplychain.isAnimalProcessed.butcher, "The animal is already processed");

    supplychain.isAnimalProcessed.butcher = true;
  }

  /**
  * Mark a box as processed by the butcher
  */
  function markBoxAsProcessed(uint256 _campaignId, uint256 _boxId) public {
    SupplyChain storage supplychain = supplychains[_campaignId];

    require(msg.sender == supplychain.stakeholders.butcher.owner, "Only the butcher can mark a box as processed");
    require(supplychain.isAnimalProcessed.butcher, "The animal must be processed before preparing boxes");
    require(!boxesStatus[_campaignId][_boxId].isProcessed, "The box is already processed");

    boxesStatus[_campaignId][_boxId].isProcessed = true;

    supplychain.processedBoxes++;

    if(areBoxesProcessed(_campaignId)) {
      supplychain.areBoxesProcessed.butcher = true;
    }
  }

  /**
  * Mark a box as distributed by the delivery service
  */
  function markBoxAsDistributed(uint256 _campaignId, uint256 _boxId) public {
    SupplyChain storage supplychain = supplychains[_campaignId];

    require(
      (msg.sender == supplychain.stakeholders.delivery.owner) || (msg.sender == supplychain.stakeholders.butcher.owner),
      "Only the butcher and the delivery service can mark a box as distributed");
    require(supplychain.areBoxesProcessed.butcher, "Boxes must be prepared before being distributed");
    require(
      (!boxesStatus[_campaignId][_boxId].isDistributedFromButcher || !boxesStatus[_campaignId][_boxId].isDistributedToDelivery),
      "The box is already distributed");

    if (msg.sender == supplychain.stakeholders.butcher.owner) {
      boxesStatus[_campaignId][_boxId].isDistributedFromButcher = true;

      if(areBoxesDistributedFromButcher(_campaignId)) {
        supplychain.areBoxesDistributed.butcher = true;
      }
    }

    if (msg.sender == supplychain.stakeholders.delivery.owner) {
      boxesStatus[_campaignId][_boxId].isDistributedToDelivery = true;

      if (areBoxesDistributedToDelivery(_campaignId)) {
        supplychain.areBoxesDistributed.delivery = true;
      }
    }

    if (boxesStatus[_campaignId][_boxId].isDistributedFromButcher && boxesStatus[_campaignId][_boxId].isDistributedToDelivery) {
      supplychain.distributedBoxes++;
    }
  }

  /**
  * Mark a box as delivered by the delivery service
  */
  function markBoxAsDelivered(uint256 _campaignId, uint256 _boxId) public {
    SupplyChain storage supplychain = supplychains[_campaignId];

    require(msg.sender == supplychain.stakeholders.delivery.owner, "Only the delivery service can mark a box as delivered");
    require(
      supplychain.areBoxesDistributed.butcher || supplychain.areBoxesDistributed.delivery,
      "Boxes must be distributed before being delivered");
    require(!boxesStatus[_campaignId][_boxId].isDelivered, "The box is already delivered");

    boxesStatus[_campaignId][_boxId].isDelivered = true;

    supplychain.deliveredBoxes++;

    if(areBoxesDelivered(_campaignId)) {
      supplychain.areBoxesDelivered.delivery = true;
    }
  }

  /**
  * Check if the supply chain is completed
  */
  function isCompleted(uint256 _campaignId) external view returns (bool) {
    SupplyChain memory supplychain = supplychains[_campaignId];
    return (
      supplychain.isAnimalDelivered.farmer &&
      supplychain.isAnimalDelivered.butcher &&
      supplychain.isAnimalProcessed.butcher &&
      supplychain.areBoxesProcessed.butcher &&
      supplychain.areBoxesDistributed.butcher &&
      supplychain.areBoxesDistributed.delivery &&
      supplychain.areBoxesDelivered.delivery);
  }

  // ----- HELPER METHODS -----

  /**
  * Check if all boxes are processed by the butcher
  */
  function areBoxesProcessed(uint256 _campaignId) public view returns (bool) {
    SupplyChain memory supplychain = supplychains[_campaignId];

    for (uint256 index = 0; index < supplychain.totalBoxes; index++) {
      if (!boxesStatus[_campaignId][index].isProcessed) {
        return false;
      }
    }
    return true;
  }

  /**
  * Check if all boxes are distributed from the butcher
  */
  function areBoxesDistributedFromButcher(uint256 _campaignId) public view returns (bool) {
    SupplyChain memory supplychain = supplychains[_campaignId];

    for (uint256 index = 0; index < supplychain.totalBoxes; index++) {
      if (!boxesStatus[_campaignId][index].isDistributedFromButcher) {
        return false;
      }
    }
    return true;
  }

  /**
  * Check if all boxes are distributed to the delivery service
  */
  function areBoxesDistributedToDelivery(uint256 _campaignId) public view returns (bool) {
    SupplyChain memory supplychain = supplychains[_campaignId];

    for (uint256 index = 0; index < supplychain.totalBoxes; index++) {
      if (!boxesStatus[_campaignId][index].isDistributedToDelivery) {
        return false;
      }
    }
    return true;
  }

  /**
  * Check if all boxes are delivered by the delivery service
  */
  function areBoxesDelivered(uint256 _campaignId) public view returns (bool) {
    SupplyChain memory supplychain = supplychains[_campaignId];

    for (uint256 index = 0; index < supplychain.totalBoxes; index++) {
      if(!boxesStatus[_campaignId][index].isDelivered) {
        return false;
      }
    }
    return true;
  }
}