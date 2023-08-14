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

struct SupplyChain {
  /// The campaign ID
  uint256 campaignRef;
  /// Delivery status of the animal
  AnimalDeliverStatus isAnimalDelivered;
  /// Process status of the animal
  AnimalProcessStatus isAnimalProcessed;
  /// Process status of the boxes
  BoxProcessStatus areBoxesProcessed;
  /// Distribution status of the boxes
  BoxDistributionStatus areBoxesDistributed;
  /// Delivery status of the boxes
  BoxDeliverStatus areBoxesDelivered;
  /// Total number of boxes
  uint256 totalBoxes;
  /// Total number of prepared boxes
  uint256 processedBoxes;
  /// Total number of delivered boxes
  uint256 distributedBoxes;
  /// Total number of received boxes
  uint256 deliveredBoxes;
  // Stakeholder involved in the process
  StakeholderList stakeholders;
}

struct BoxStatus {
  /// The campaign ID
  uint256 campaignRef;
  /// The box sell ID
  uint256 boxId;
  /// Process status of the box
  bool isProcessed;
  /// Distribution status of the box (marked by the butcher)
  bool isDistributedFromButcher;
  /// Distribution status of the box (marked by the delivery service)
  bool isDistributedToDelivery;
  /// Delivery status of the box
  bool isDelivered;
}

struct AnimalDeliverStatus {
  /// Delivery status of the animal (marked by the farmer)
  bool farmer;
  /// Delivery status of the animal (marked by the butcher)
  bool butcher;
}

struct AnimalProcessStatus {
  /// Process status of the animal (marked by the butcher)
  bool butcher;
}

struct BoxProcessStatus {
  /// Process status of the boxes (marked by the butcher)
  bool butcher;
}

struct BoxDistributionStatus {
  /// Distribution status of the boxes (marked by the butcher)
  bool butcher;
  /// Distribution status of the boxes (marked by the delivery service)
  bool delivery;
}

struct BoxDeliverStatus {
  /// Delivery status of the boxes (marked by the delivery service)
  bool delivery;
}