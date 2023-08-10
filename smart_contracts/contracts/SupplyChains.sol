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


  function StartSupplyChain(Campaign memory _campaign, BoxSellRef[] memory _boxes) public {
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
      preparedBoxes[_campaign.id][box.id];
      distributedBoxes[_campaign.id][box.id];
      deliveredBoxes[_campaign.id][box.id];
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
  * Mark the animal of a campaign as delivered (to the butcher)
  */
  function markAnimalAsDelivered(uint256 _campaignId) public {
    SupplyChain storage supplychain = supplychains[_campaignId];

    // verify that the sender is the farmer
    require(msg.sender == supplychain.stakeholders.farmer.owner);
    supplychain.isAnimalDelivered = true;
  }

  /*
  * Mark the animal as processed by the butcher
  */
  function markAnimalAsProcessed(uint256 _campaignId) public {
    SupplyChain storage supplychain = supplychains[_campaignId];

    // verify that the sender is the butcher
    require(msg.sender == supplychain.stakeholders.butcher.owner);
    supplychain.isAnimalProcessed = true;
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
  * Checl if all boxes are delivered by the customers
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
