// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.13;

import "./SupplyChainsTypes.sol";
import "./CrowdfundingTypes.sol";
import "./Crowdfunding.sol";

contract SupplyChains {
  // address of the crowdfunding contract
  address public crowdfundingAddress;

  mapping(uint256 => SupplyChain) supplychains;

  mapping(uint256 => mapping(uint16 => BoxStatus)) boxesStatus;

  uint256 NumberOfSupplyChains = 0;

  // Add the address of the crowdfunding contract
  function setCrowdfundingAddress(address _crowdfundingAddress) public {
    crowdfundingAddress = _crowdfundingAddress;
  }

  /**
  * Create a supply chain related to a campaign
  */
  function createSupplyChain(Campaign memory _campaign) external {
    SupplyChain storage supplychain = supplychains[_campaign.id];

    supplychain.campaignRef = _campaign.id;
    supplychain.isStarted = false;
    supplychain.isAnimalDelivered.butcher = false;
    supplychain.isAnimalDelivered.farmer = false;
    supplychain.isAnimalProcessed.butcher = false;
    supplychain.areBoxesProcessed.butcher = false;
    supplychain.areBoxesDistributed.butcher = false;
    supplychain.areBoxesDistributed.delivery = false;
    supplychain.areBoxesDelivered.delivery = false;
    supplychain.totalBoxes = 0;
    supplychain.deliveredBoxes = 0;

    // import stakeholders from campaign
    supplychain.stakeholders = _campaign.stakeholders;

    NumberOfSupplyChains++;
  }

  /**
  * Add a sold box to a supply chain
  */
  function addBox(uint256 _campaignId, BoxSellRef memory _box) external {
    SupplyChain storage supplychain = supplychains[_campaignId];

    boxesStatus[_campaignId][_box.id].campaignRef = _campaignId;
    boxesStatus[_campaignId][_box.id].boxId = _box.id;
    boxesStatus[_campaignId][_box.id].isDelivered = false;

    supplychain.totalBoxes++;
  }
  
  /**
  * Mark a supply chain as started
  */
  function startSupplyChain(uint256 _campaignRef) external {
    SupplyChain storage supplychain = supplychains[_campaignRef];

    require(!supplychain.isStarted, "The supply chain is already started");
    supplychain.isStarted = true;
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
    for (uint16 index = 0; index < supplychain.totalBoxes; index++) {
      boxesStatuses[index] = boxesStatus[_campaignId][index];
    }
    return boxesStatuses;
  }

  /**
  * Mark the animal of a campaign as delivered (to the butcher)
  */
  function markAnimalAsDelivered(uint256 _campaignId) public {
    SupplyChain storage supplychain = supplychains[_campaignId];
    require(supplychain.isStarted, "The supply chain must be started before marking the animal as delivered");
    require(
      (msg.sender == supplychain.stakeholders.farmer.owner) || (msg.sender == supplychain.stakeholders.butcher.owner),
      "Only the farmer and the butcher can mark the animal as delivered"
    );
    require(!supplychain.isAnimalDelivered.farmer || !supplychain.isAnimalDelivered.butcher, "The animal is already delivered");

    if (msg.sender == supplychain.stakeholders.farmer.owner) {
      require(!supplychain.isAnimalDelivered.farmer, "The animal is already marked as delivered from the farmer");

      supplychain.isAnimalDelivered.farmer = true;
    }
    if (msg.sender == supplychain.stakeholders.butcher.owner) {
      require(!supplychain.isAnimalDelivered.butcher, "The animal is already marked as delivered from the butcher");
      supplychain.isAnimalDelivered.butcher = true;
    }
  }

  /**
  * Mark the animal as processed by the butcher
  */
  function markAnimalAsProcessed(uint256 _campaignId) public {
    SupplyChain storage supplychain = supplychains[_campaignId];

    require(supplychain.isStarted, "The supply chain must be started before marking the animal as processed");
    require(msg.sender == supplychain.stakeholders.butcher.owner, "Only the butcher can mark the animal as processed");
    require((supplychain.isAnimalDelivered.butcher && supplychain.isAnimalDelivered.farmer), "The animal must be delivered before being processed");
    require(!supplychain.isAnimalProcessed.butcher, "The animal is already processed");

    supplychain.isAnimalProcessed.butcher = true;
  }

  /**
  * Mark boxes as processed by the butcher
  */
  function markBoxesAsProcessed(uint256 _campaignId) public {
    SupplyChain storage supplychain = supplychains[_campaignId];

    require(supplychain.isStarted, "The supply chain must be started before marking a box as processed");
    require(msg.sender == supplychain.stakeholders.butcher.owner, "Only the butcher can mark a box as processed");
    require(supplychain.isAnimalProcessed.butcher, "The animal must be processed before preparing boxes");
    require(!supplychain.areBoxesProcessed.butcher, "The boxes are already processed");

    supplychain.areBoxesProcessed.butcher = true;
  }

  /**
  * Mark boxes as distributed from the butcher to the delivery service
  */
  function markBoxesAsDistributed(uint256 _campaignId) public {
    SupplyChain storage supplychain = supplychains[_campaignId];

    require(supplychain.isStarted, "The supply chain must be started before marking a box as distributed");
    require(
      (msg.sender == supplychain.stakeholders.delivery.owner) || (msg.sender == supplychain.stakeholders.butcher.owner),
      "Only the butcher and the delivery service can mark a box as distributed");
    require(supplychain.areBoxesProcessed.butcher, "Boxes must be prepared before being distributed");
    require(
      (!supplychain.areBoxesDistributed.butcher || !supplychain.areBoxesDistributed.delivery),
      "The boxes are already distributed");

    if (msg.sender == supplychain.stakeholders.butcher.owner) {
      require(!supplychain.areBoxesDistributed.butcher, "The boxes are already marked as distributed from the butcher");

      supplychain.areBoxesDistributed.butcher = true;
    }

    if (msg.sender == supplychain.stakeholders.delivery.owner) {
      require(!supplychain.areBoxesDistributed.delivery, "The boxes are already marked as distributed from the delivery service");

      supplychain.areBoxesDistributed.delivery = true;
    }
  }

  /**
  * Mark a box as delivered by the delivery service
  */
  function markBoxAsDelivered(uint256 _campaignId, uint16 _boxId) public {
    SupplyChain storage supplychain = supplychains[_campaignId];

    require(supplychain.isStarted, "The supply chain must be started before marking a box as delivered");
    require(msg.sender == supplychain.stakeholders.delivery.owner, "Only the delivery service can mark a box as delivered");
    require(
      supplychain.areBoxesDistributed.butcher && supplychain.areBoxesDistributed.delivery,
      "Boxes must be distributed before being delivered");
    require(!boxesStatus[_campaignId][_boxId].isDelivered, "The box is already delivered");

    boxesStatus[_campaignId][_boxId].isDelivered = true;

    supplychain.deliveredBoxes++;

    if(supplychain.totalBoxes == supplychain.deliveredBoxes) {
      supplychain.areBoxesDelivered.delivery = true;
      Crowdfunding(crowdfundingAddress).payOut(_campaignId);
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
}
