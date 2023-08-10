// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.13;

import "./Types.sol";
import "./Crowdfunding.sol";

contract SupplyChains {

  mapping(uint256 => SupplyChain) public supplychains;

  mapping(uint256 => mapping(uint256 => bool)) preparedBoxes;
  mapping(uint256 => mapping(uint256 => bool)) distributedBoxes;
  mapping(uint256 => mapping(uint256 => bool)) deliveredBoxes;

  uint256 public NumberOfSupplyChains = 0;


  function StartSupplyChain(Campaign memory _campaign, BoxSellRef[] memory _boxes) external {
    // get the supplychain related to campaign id
    SupplyChain storage supplychain = supplychains[_campaign.id];

    supplychain.campaignRef = _campaign.id;
    supplychain.isAnimalDelivered = false;
    supplychain.isAnimalProcessed = false;
    supplychain.areBoxesPrepared = false;
    supplychain.areBoxesDistributed = false;
    supplychain.areBoxesDelivered = false;

    uint totalNumOfBoxes = 0;
    for (uint256 index = 0; index < _boxes.length; index++) {
      BoxSellRef memory box = _boxes[index];
      totalNumOfBoxes += 1;
      preparedBoxes[_campaign.id][box.id] = false;
      distributedBoxes[_campaign.id][box.id] = false;
      deliveredBoxes[_campaign.id][box.id] = false;
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
  * Retrieve a supplychain by campaign id
  */
  function getSupplyChainById(uint256 _campaignId) public view returns (SupplyChain memory) {
    return supplychains[_campaignId];
  }

  /*
  * Get an array of bool from the preparedBoxes mapping
  */
  function getPreparedBoxesStatus(uint256 _campaignId) public view returns (bool[] memory) {
    SupplyChain memory supplychain = supplychains[_campaignId];
    bool[] memory preparedBoxesStatus = new bool[](supplychain.totalBoxes);
    for (uint256 index = 0; index < supplychain.totalBoxes; index++) {
      preparedBoxesStatus[index] = preparedBoxes[_campaignId][index];
    }
    return preparedBoxesStatus;
  }

  /* 
  * Get an array of bool from the distributedBoxes mapping
  */
  function getDistributedBoxesStatus(uint256 _campaignId) public view returns (bool[] memory) {
    SupplyChain memory supplychain = supplychains[_campaignId];
    bool[] memory distributedBoxesStatus = new bool[](supplychain.totalBoxes);
    for (uint256 index = 0; index < supplychain.totalBoxes; index++) {
      distributedBoxesStatus[index] = distributedBoxes[_campaignId][index];
    }
    return distributedBoxesStatus;
  }
  /*
  * Get an array of bool from the deliveredBoxes mapping
  */
  function getDeliveredBoxesStatus(uint256 _campaignId) public view returns (bool[] memory) {
    SupplyChain memory supplychain = supplychains[_campaignId];
    bool[] memory deliveredBoxesStatus = new bool[](supplychain.totalBoxes);
    for (uint256 index = 0; index < supplychain.totalBoxes; index++) {
      deliveredBoxesStatus[index] = deliveredBoxes[_campaignId][index];
    }
    return deliveredBoxesStatus;
  }

  /*
  * Mark the animal of a campaign as delivered (to the butcher)
  */
  function markAnimalAsDelivered(uint256 _campaignId) public {
    SupplyChain storage supplychain = supplychains[_campaignId];

    require(msg.sender == supplychain.stakeholders.farmer.owner, "Only the farmer can mark the animal as delivered");
    supplychain.isAnimalDelivered = true;
  }

  /*
  * Mark the animal as processed by the butcher
  */
  function markAnimalAsProcessed(uint256 _campaignId) public {
    SupplyChain storage supplychain = supplychains[_campaignId];

    require(msg.sender == supplychain.stakeholders.butcher.owner, "Only the butcher can mark the animal as processed");
    require(supplychain.isAnimalDelivered, "The animal must be delivered before being processed");
    supplychain.isAnimalProcessed = true;
  }

  /*
  * Mark a box as prepared by the butcher
  */
  function markBoxAsPrepared(uint256 _campaignId, uint256 _boxId) public {
    SupplyChain storage supplychain = supplychains[_campaignId];

    require(msg.sender == supplychain.stakeholders.butcher.owner, "Only the butcher can mark a box as prepared");
    require(supplychain.isAnimalProcessed, "The animal must be processed before preparing boxes");
    preparedBoxes[_campaignId][_boxId] = true;

    if(areAllBoxesPrepared(_campaignId)) {
      supplychain.areBoxesPrepared = true;
    }
  }

  /*
  * Mark a box as distributed by the delivery service
  */
  function markBoxAsDistributed(uint256 _campaignId, uint256 _boxId) public {
    SupplyChain storage supplychain = supplychains[_campaignId];

    require(msg.sender == supplychain.stakeholders.delivery.owner, "Only the delivery service can mark a box as distributed");
    require(supplychain.areBoxesPrepared, "Boxes must be prepared before being distributed");
    distributedBoxes[_campaignId][_boxId] = true;

    if(areAllBoxesDistributed(_campaignId)) {
      supplychain.areBoxesDistributed = true;
    }
  }

  /*
  * Mark a box as delivered by the delivery service
  */
  function markBoxAsDelivered(uint256 _campaignId, uint256 _boxId) public {
    SupplyChain storage supplychain = supplychains[_campaignId];

    require(msg.sender == supplychain.stakeholders.delivery.owner, "Only the delivery service can mark a box as delivered");
    require(supplychain.areBoxesDistributed, "Boxes must be distributed before being delivered");
    deliveredBoxes[_campaignId][_boxId] = true;

    if(areAllBoxesDelivered(_campaignId)) {
      supplychain.areBoxesDelivered = true;
    }
  }

  /*
  * Check if all boxes are prepared by the butcher
  */
  function areAllBoxesPrepared(uint256 _campaignId) public view returns (bool) {
    SupplyChain memory supplychain = supplychains[_campaignId];

    for (uint256 index = 0; index < supplychain.totalBoxes; index++) {
      if (!preparedBoxes[_campaignId][index]) {
        return false;
      }
    }
    return true;
  }

  /*
  * Check if all boxes are distributed by the delivery service
  */
  function areAllBoxesDistributed(uint256 _campaignId) public view returns (bool) {
    SupplyChain memory supplychain = supplychains[_campaignId];

    for (uint256 index = 0; index < supplychain.totalBoxes; index++) {
      if (!distributedBoxes[_campaignId][index]) {
        return false;
      }
    }
    return true;
  }

  /*
  * Check if all boxes are delivered by the delivery service
  */
  function areAllBoxesDelivered(uint256 _campaignId) public view returns (bool) {
    SupplyChain memory supplychain = supplychains[_campaignId];

    for (uint256 index = 0; index < supplychain.totalBoxes; index++) {
      if (!deliveredBoxes[_campaignId][index]) {
        return false;
      }
    }
    return true;
  }

  /*
  * Check if the supply chain is completed
  */
  function isCompleted(uint256 _campaignId) external view returns (bool) {
    SupplyChain memory supplychain = supplychains[_campaignId];
    return (supplychain.isAnimalDelivered && supplychain.isAnimalProcessed && supplychain.areBoxesPrepared && supplychain.areBoxesDistributed && supplychain.areBoxesDelivered);
  }
}
