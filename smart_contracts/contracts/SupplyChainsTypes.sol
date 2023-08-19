// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.13;

import "./CrowdfundingTypes.sol";

struct SupplyChain {
  /// The campaign ID
  uint256 campaignRef;
  /// Is the supply chain started
  bool isStarted;
  /// Delivery status of the animal
  AnimalDeliverStatus isAnimalDelivered;
  /// Process status of the animal
  AnimalProcessStatus isAnimalProcessed;
  /// Process status of the boxes
  BoxesProcessStatus areBoxesProcessed;
  /// Distribution status of the boxes
  BoxesDistributionStatus areBoxesDistributed;
  /// Delivery status of the boxes
  BoxesDeliverStatus areBoxesDelivered;
  /// Total number of boxes
  uint16 totalBoxes;
  /// Total number of received boxes
  uint16 deliveredBoxes;
  // Stakeholder involved in the process
  StakeholderList stakeholders;
}

struct BoxStatus {
  /// The campaign ID
  uint256 campaignRef;
  /// The box sell ID
  uint16 boxId;
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

struct BoxesProcessStatus {
  /// Process status of the boxes (marked by the butcher)
  bool butcher;
}

struct BoxesDistributionStatus {
  /// Distribution status of the boxes (marked by the butcher)
  bool butcher;
  /// Distribution status of the boxes (marked by the delivery service)
  bool delivery;
}

struct BoxesDeliverStatus {
  /// Delivery status of the boxes (marked by the delivery service)
  bool delivery;
}
