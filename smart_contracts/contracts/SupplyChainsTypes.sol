// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.13;

import "./Types.sol";

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