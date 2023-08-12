// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.13;

import "./Types.sol";
import "./Crowdfunding.sol";

contract SupplyChains {

  mapping(uint256 => SupplyChain) public supplychains;

  mapping(uint256 => mapping(uint256 => BoxProcessStatus)) processedBoxes;
  mapping(uint256 => mapping(uint256 => BoxDistributionStatus)) distributedBoxes;
  mapping(uint256 => mapping(uint256 => BoxDeliveryStatus)) deliveredBoxes;

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
      processedBoxes[_campaign.id][box.id].butcher = false;
      distributedBoxes[_campaign.id][box.id].butcher = false;
      distributedBoxes[_campaign.id][box.id].delivery = false;
      deliveredBoxes[_campaign.id][box.id].delivery = false;
    }
    require(totalNumOfBoxes > 0, "There must be at least one box in total");

    supplychain.totalBoxes = totalNumOfBoxes;
    supplychain.preparedBoxes = 0;
    supplychain.deliveredBoxes = 0;
    supplychain.receivedBoxes = 0;

    // import stakeholders from campaign
    supplychain.stakeholders = _campaign.stakeholders;

    NumberOfSupplyChains++;
  }

  /*
  * Mark the animal of a campaign as delivered (to the butcher)
  */
  function markAnimalAsDelivered(uint256 _campaignId) public {
    SupplyChain storage supplychain = supplychains[_campaignId];

    require(
      (msg.sender == supplychain.stakeholders.farmer.owner) || (msg.sender == supplychain.stakeholders.butcher.owner), 
      "Only the farmer and the butcher can mark the animal as delivered"
    );

    if (msg.sender == supplychain.stakeholders.farmer.owner) {
      supplychain.isAnimalDelivered.farmer = true;
    } else if (msg.sender == supplychain.stakeholders.butcher.owner) {
      supplychain.isAnimalDelivered.butcher = true;
    }
  }

  /*
  * Mark the animal as processed by the butcher
  */
  function markAnimalAsProcessed(uint256 _campaignId) public {
    SupplyChain storage supplychain = supplychains[_campaignId];

    require(msg.sender == supplychain.stakeholders.butcher.owner, "Only the butcher can mark the animal as processed");
    require(supplychain.isAnimalDelivered.butcher && supplychain.isAnimalDelivered.farmer, "The animal must be delivered before being processed");
    supplychain.isAnimalProcessed.butcher = true;
  }

  /*
  * Mark a box as processed by the butcher
  */
  function markBoxAsProcessed(uint256 _campaignId, uint256 _boxId) public {
    SupplyChain storage supplychain = supplychains[_campaignId];

    require(msg.sender == supplychain.stakeholders.butcher.owner, "Only the butcher can mark a box as processed");
    require(supplychain.isAnimalProcessed.butcher, "The animal must be processed before preparing boxes");
    processedBoxes[_campaignId][_boxId].butcher = true;

    if(areBoxesProcessed(_campaignId)) {
      supplychain.areBoxesProcessed.butcher = true;
    }
  }

  /*
  * Mark a box as distributed by the delivery service
  */
  function markBoxAsDistributed(uint256 _campaignId, uint256 _boxId) public {
    SupplyChain storage supplychain = supplychains[_campaignId];

    require(
      (msg.sender == supplychain.stakeholders.delivery.owner) || (msg.sender == supplychain.stakeholders.butcher.owner), 
      "Only the delivery service can mark a box as distributed");
    require(supplychain.areBoxesProcessed.butcher, "Boxes must be prepared before being distributed");

    if (msg.sender == supplychain.stakeholders.butcher.owner) {
      distributedBoxes[_campaignId][_boxId].butcher = true;
      if(areBoxesDistributedFromButcher(_campaignId)) {
        supplychain.areBoxesDistributed.butcher = true;
      }
    } else if (msg.sender == supplychain.stakeholders.delivery.owner) {
      distributedBoxes[_campaignId][_boxId].delivery = true;
      if (areBoxesDistributedToDelivery(_campaignId)) {
        supplychain.areBoxesDistributed.delivery = true;
      }
    }
  }

  /*
  * Mark a box as delivered by the delivery service
  */
  function markBoxAsDelivered(uint256 _campaignId, uint256 _boxId) public {
    SupplyChain storage supplychain = supplychains[_campaignId];

    require(msg.sender == supplychain.stakeholders.delivery.owner, "Only the delivery service can mark a box as delivered");
    require(
      supplychain.areBoxesDistributed.butcher || supplychain.areBoxesDistributed.delivery, 
      "Boxes must be distributed before being delivered");
    
    deliveredBoxes[_campaignId][_boxId].delivery = true;

    if(areBoxesDelivered(_campaignId)) {
      supplychain.areBoxesDelivered.delivery = true;
    }
  }

  /*
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

  /*
  * Check if all boxes are processed by the butcher
  */
  function areBoxesProcessed(uint256 _campaignId) public view returns (bool) {
    SupplyChain memory supplychain = supplychains[_campaignId];

    for (uint256 index = 0; index < supplychain.totalBoxes; index++) {
      if (!processedBoxes[_campaignId][index].butcher) {
        return false;
      }
    }
    return true;
  }

  /*
  * Check if all boxes are distributed from the butcher
  */
  function areBoxesDistributedFromButcher(uint256 _campaignId) public view returns (bool) {
    SupplyChain memory supplychain = supplychains[_campaignId];

    for (uint256 index = 0; index < supplychain.totalBoxes; index++) {
      if (!distributedBoxes[_campaignId][index].butcher) {
        return false;
      }
    }
    return true;
  }

  /*
  * Check if all boxes are distributed to the delivery service
  */
  function areBoxesDistributedToDelivery(uint256 _campaignId) public view returns (bool) {
    SupplyChain memory supplychain = supplychains[_campaignId];

    for (uint256 index = 0; index < supplychain.totalBoxes; index++) {
      if (!distributedBoxes[_campaignId][index].delivery) {
        return false;
      }
    }
    return true;
  }

  /*
  * Check if all boxes are delivered by the delivery service
  */
  function areBoxesDelivered(uint256 _campaignId) public view returns (bool) {
    SupplyChain memory supplychain = supplychains[_campaignId];

    for (uint256 index = 0; index < supplychain.totalBoxes; index++) {
      if (!deliveredBoxes[_campaignId][index].delivery) {
        return false;
      }
    }
    return true;
  }

  // ----- TESTING -----

  /*
  * Retrieve a supplychain by campaign id
  */
  function getSupplyChainById(uint256 _campaignId) public view returns (SupplyChain memory) {
    return supplychains[_campaignId];
  }

  /*
  * getBoxStatus: 0 = processed, 1 = distributed, 2 = delivered
  */
  function getBoxesStatus(uint256 _campaignId, uint8 mode) public view returns (bool[] memory) {
    require(mode >= 0 && mode <= 2, "Mode must be between 0 and 2");
    SupplyChain memory supplychain = supplychains[_campaignId];
    bool[] memory boxesStatus = new bool[](supplychain.totalBoxes);
    for (uint256 index = 0; index < supplychain.totalBoxes; index++) {
      if (mode == 0) {
        boxesStatus[index] = processedBoxes[_campaignId][index].butcher;
      } else if (mode == 1) {
        boxesStatus[index] = (distributedBoxes[_campaignId][index].butcher && distributedBoxes[_campaignId][index].delivery);
      } else if (mode == 2) {
        boxesStatus[index] = deliveredBoxes[_campaignId][index].delivery;
      }
    }
    return boxesStatus;
  }
}
