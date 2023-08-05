// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.13;

struct Box {
  /// Title of a box
  string title;
  /// Description of a box
  string description;
  /// The price of this box in wei
  uint256 price;
}

struct BoxOffer {
  /// Id of the Offer
  uint256 id;
  /// The box to sell
  Box box;
  /// Total number of boxes
  uint32 total;
  /// Number of available boxes
  uint32 available;
}

struct BoxSellRef {
  /// The id of the specific sell
  uint256 id;
  /// The box
  Box box;
  /// Address of the owner
  address owner;
  /// Physical address of the box owner
  string physAddress;
}

struct CampaignMeta {
  /// The campaigns title
  string title;
  /// The campaigns description
  string description;
  /// Total amount collected in eth
  uint256 collectedAmount;
  /// The deadline of this campaign
  uint256 deadline;
  /// Total number of boxes
  uint256 totalBoxes;
  /// Number of sold boxes
  uint256 boxesSold;
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
  CampaignMeta meta;
  CampaignOwner owner;
  CampaignAnimalData animal;
  StakeholderList stakeholders;
}

struct CampaignRef {
  /// Campaign id
  uint256 id;
  /// reference to the campaign
  Campaign campaign;
}
