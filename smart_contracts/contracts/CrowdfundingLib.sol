// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.13;

import './Types.sol';

library CrowdfundingLib {

  function validateStakeholders(StakeholderList memory _stakeholders) internal pure {
    require(_stakeholders.farmer.share > 0 && _stakeholders.farmer.share <= 100, "Farmer share must be higher than 0% and can't be higher than 100%");
    require(_stakeholders.butcher.share > 0 && _stakeholders.butcher.share <= 100, "Butcher share must be higher than 0% and can't be higher than 100%");
    require(_stakeholders.delivery.share > 0 && _stakeholders.delivery.share <= 100, "Delivery Service share must be higher than 0% and can't be higher than 100%");
    uint8 totalShare = _stakeholders.farmer.share + _stakeholders.butcher.share + _stakeholders.delivery.share;
    require(totalShare == 100, "The total share of all stakeholders must be equal to 100%");
  }

  function validateBoxes(BoxOffer[] memory _boxes) internal pure {
    uint256 numberOfBoxes = 0;
    for (uint256 index = 0; index < _boxes.length; index++) {
      BoxOffer memory offer = _boxes[index];
      require(offer.total > 0, "There must be at least one box to sell");
      require(offer.total == offer.available, "Initially total number of boxes and available must be equal");
      numberOfBoxes += offer.total;

      Box memory box = offer.box;
      // A box requires a price
      require(
          box.price > 0,
          "A box requires a price higher than 0"
      );
    }
    require(numberOfBoxes > 0, "At least one box is required");
  }

  function getTotalNumberOfBoxes(BoxOffer[] memory _boxes) internal pure returns(uint256) {
    uint256 numberOfBoxes = 0;
    for (uint256 index = 0; index < _boxes.length; index++) {
      BoxOffer memory offer = _boxes[index];
      numberOfBoxes += offer.total;
    }
    return numberOfBoxes;
  }

  function getFarmerShare(Campaign storage _campaign) internal view returns(uint256) {
    return _campaign.meta.collectedAmount * _campaign.stakeholders.farmer.share;
  }

  function getButcherShare(Campaign storage _campaign) internal view returns(uint256) {
    return _campaign.meta.collectedAmount * _campaign.stakeholders.butcher.share;
  }

  function getDeliveryShare(Campaign storage _campaign) internal view returns(uint256) {
    return _campaign.meta.collectedAmount * _campaign.stakeholders.delivery.share;
  }
}
