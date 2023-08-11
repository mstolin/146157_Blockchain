// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.13;

struct Box {
  /// Id of the Box
  uint8 id;
  /// Title of a box
  string title;
  /// Description of a box
  string description;
  /// The price of this box in wei
  uint256 price;
  /// Overall total number of boxes
  uint8 total;
  /// Number of available boxes
  uint8 available;
}

struct BoxSellRef {
  /// The id of the specific sell
  uint16 id;
  /// ID of the box
  uint8 boxId;
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
  uint16 totalBoxes;
  /// Number of sold boxes
  uint16 boxesSold;
  /// Number of box types
  uint8 totalBoxTypes;
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
