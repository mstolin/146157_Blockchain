// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.13;

struct Box {
  /// Id of the Box
  uint256 id;
  /// Title of a box
  string title;
  /// Description of a box
  string description;
  /// The price of this box in wei
  uint256 price;
  /// Overall total number of boxes
  uint32 total;
  /// Number of available boxes
  uint32 available;
}

struct BoxSellRef {
  /// The id of the specific sell
  uint256 id;
  /// ID of the box
  uint256 boxId;
  /// Address of the owner
  address owner;
  /// Date of soll
  uint256 boughtAt;
  /// Physical address of the box owner
  string physAddress;
}

struct CampaignInfo {
  /// The campaigns title
  string title;
  /// The campaigns description
  string description;
  /// The deadline of this campaign
  uint256 deadline;
}

struct CampaignMeta {
  /// Total amount collected in eth
  uint256 collectedAmount;
  /// Creation date
  uint256 createdAt;
  /// Total number of boxes
  uint256 totalBoxes;
  /// Number of sold boxes
  uint256 boxesSold;
  /// Number of box types
  uint256 totalBoxTypes;
  /// Is it already stopped
  bool isStopped;
}

struct CampaignAnimalData {
  /// Animal ear tag
  string earTag;
  /// Animal name
  string name;
  /// Farm name
  string farm;
  /// Animal age
  uint8 age;
}

struct CampaignOwner {
  /// Owner of this campaign
  address owner;
  /// Owners public key
  string ownerPublicKey;
}

struct Stakeholder {
  /// Address of the stakeholder
  address payable owner;
  /// Share in %
  uint8 share;
  // Can include name, address, website
  string info;
}

struct StakeholderList {
  /// Responsible farmer
  Stakeholder farmer;
  /// Resonsible butcher
  Stakeholder butcher;
  /// Responsible delivery service
  Stakeholder delivery;
}

struct Campaign {
  /// The campaign ID
  uint256 id;
  /// Info about the campaign
  CampaignInfo info;
  /// Campaign meta info
  CampaignMeta meta;
  /// Info about the campaign owner
  CampaignOwner owner;
  /// Info about the animal
  CampaignAnimalData animal;
  /// Stakeholders involved in the process
  StakeholderList stakeholders;
}

/*
struct SupplyChain {
  uint256 campaignRef;
  /// if the animal is ready and delivered to the butcher
  bool isAnimalDelivered;
  /// if the animal is ready to be processed in boxes
  bool isAnimalProcessed;
  /// if the boxes are ready for deliver to the delivery service
  bool areBoxesPrepared;
  /// if the boxes are distributed by the delivery service
  bool areBoxesDistributed;
  /// if the boxes are delivered to the customers
  bool areBoxesDelivered;
  /// total number of boxes
  uint256 totalBoxes;
  /// total number of prepared boxes
  uint256 preparedBoxes;
  /// total number of delivered boxes
  uint256 deliveredBoxes;
  /// total number of received boxes
  uint256 receivedBoxes;
  // Stakeholder involved in the process
  StakeholderList stakeholders;
}
*/

struct SupplyChain {
  uint256 campaignRef;
  /// if the animal is ready and delivered to the butcher
  AnimalDeliverStatus isAnimalDelivered;
  /// if the animal is ready to be processed in boxes
  AnimalProcessStatus isAnimalProcessed;
  /// if the boxes are ready for deliver to the delivery service
  BoxProcessStatus areBoxesProcessed;
  /// if the boxes are distributed by the delivery service
  BoxDistributionStatus areBoxesDistributed;
  /// if the boxes are delivered to the customers
  BoxDeliveryStatus areBoxesDelivered;
  /// total number of boxes
  uint256 totalBoxes;
  /// total number of prepared boxes
  uint256 preparedBoxes;
  /// total number of delivered boxes
  uint256 deliveredBoxes;
  /// total number of received boxes
  uint256 receivedBoxes;
  // Stakeholder involved in the process
  StakeholderList stakeholders;
}


struct AnimalDeliverStatus {
  bool farmer;
  bool butcher;
}

struct AnimalProcessStatus {
  bool butcher;
}

struct BoxProcessStatus {
  bool butcher;
}

struct BoxDistributionStatus {
  bool butcher;
  bool delivery;
}

struct BoxDeliveryStatus {
  bool delivery;
}
