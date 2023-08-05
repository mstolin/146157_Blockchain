// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.13;

import './CrowdfundingLib.sol';
import './Types.sol';

contract Crowdfunding {

    // all campaigns
    mapping(uint256 => Campaign) public campaigns;
    // available boxes for specific campaigns
    mapping(uint256 => BoxOffer[]) public boxOffers;
    // sold boxes for specific campaigns (campginId => sellId => BoxSellRef)
    mapping(uint256 => mapping(uint256 => BoxSellRef)) public soldBoxesCampaign;

    uint256 public numberOfCampaigns = 0;

    /**
     * Adds a buyer
     */
    function addBuyer(uint256 _campaignId, address _buyer, Box memory _box, string memory _physAddress) private {
      Campaign storage campaign = campaigns[_campaignId];
      // Make sure boxesSold has not been increased yet
      uint256 boxId = campaign.meta.boxesSold;

      BoxSellRef storage soldBox = soldBoxesCampaign[_campaignId][boxId];
      soldBox.id = boxId;
      soldBox.owner = _buyer;
      soldBox.box = _box;
      soldBox.physAddress = _physAddress;
    }

    /**
     * Adds a box to the boxOffers
     */
    function addBoxOffers(BoxOffer[] memory _boxes) private {
      BoxOffer[] storage _offers = boxOffers[numberOfCampaigns];
        for (uint256 index = 0; index < _boxes.length; index++) {
            BoxOffer memory offer = _boxes[index];
            _offers.push(offer);
        }
    }

    /**
     * Creates a new campaign
     */
    function createCampaign(
        string memory _title,
        string memory _description,
        uint32 _duration,
        CampaignOwner memory _campaignOwner,
        StakeholderList memory _stakeholders,
        CampaignAnimalData memory _animal,
        BoxOffer[] memory _boxes
    ) public returns (uint256) {
        // check crowdfunding duration
        require(_duration > 0, "Duration must be higher than 0");
        require(_duration <= 6 weeks, "Duration can't be higher than 6 weeks");

        // create deadline by adding the duration to the current timestamp
        uint256 current = block.timestamp;
        uint256 deadline = current + _duration;

        // validate
        require(
            deadline > current,
            "Deadline must be in the future"
        );
        CrowdfundingLib.validateStakeholders(_stakeholders);
        CrowdfundingLib.validateBoxes(_boxes);

        // Create campaign
        uint256 totalBoxes = CrowdfundingLib.getTotalNumberOfBoxes(_boxes);
        Campaign storage campaign = campaigns[numberOfCampaigns];
        campaign.owner = _campaignOwner;
        campaign.meta.title = _title;
        campaign.meta.description = _description;
        campaign.meta.collectedAmount = 0;
        campaign.meta.deadline = deadline;
        campaign.meta.isStopped = false;
        campaign.meta.totalBoxes = totalBoxes;
        campaign.meta.boxesSold = 0;
        campaign.animal = _animal;
        campaign.stakeholders = _stakeholders;

        // add boxes
        addBoxOffers(_boxes);

        // increase total num of campaigns
        numberOfCampaigns++;

        // return the most recent campaign index
        return numberOfCampaigns - 1;
    }

    /**
    * Returns the total number of campaigns
    */
    function getNumberOfCampaigns() public view returns (uint256) {
      return numberOfCampaigns;
    }

    /**
     * Returns the public key of a campaign
     */
    function getPublicKey(uint256 _campaignId) public view returns (string memory) {
      Campaign storage campaign = campaigns[_campaignId];
      return campaign.owner.ownerPublicKey;
    }

    /**
     * Removes a campaign
     */
    function stopCampaign(uint256 _campaignId) public returns (bool) {
      Campaign storage campaign = campaigns[_campaignId];
      require(!campaign.meta.isStopped, "Campaign already stopped");
      require(campaign.meta.deadline > block.timestamp, "This campaign is over");
      require(msg.sender == campaign.owner.owner, "Only the owner can stop a campaign");

      campaign.meta.isStopped = true;

      return true;
    }

    /**
     * Buys a box
     */
    function buyBox(uint256 _campaignId, uint256 _boxId, string memory _physAddress) public payable {
        // get campaign ref
        Campaign storage campaign = campaigns[_campaignId];

        // check if this is an ongoing campaign
        require(!campaign.meta.isStopped, "This campaign has stopped");
        require(campaign.meta.deadline > block.timestamp, "This campaign is over");

        // check if this campaign still has available boxes for the requested kind
        BoxOffer storage boxOffer = boxOffers[_campaignId][_boxId];
        require(boxOffer.id == _boxId, "The box ID is invalid");
        require(boxOffer.available > 0, "All boxes of this type have been sold");

        // check if the offer is valid
        Box memory box = boxOffer.box;
        uint256 amount = msg.value;
        require(amount >= box.price, "Given amount is below box price");

        // Add buyer
        addBuyer(_campaignId, msg.sender, box, _physAddress);

        // Updates available boxes by one
        boxOffer.available-=1;
        campaign.meta.boxesSold+=1;
        // Add to total collected amount
        campaign.meta.collectedAmount+=amount;

        if (campaign.meta.boxesSold == campaign.meta.totalBoxes) {
          // Mark campaign as stopped
          campaign.meta.isStopped = true;
          // TODO Start Supply Chain
        }
    }

    /**
     * Returns a specific campaign
     */
    function getCampaign(uint256 _campaignId) public view returns (CampaignRef memory) {
        Campaign storage campaign = campaigns[_campaignId];
        CampaignRef memory ref = CampaignRef({ id: _campaignId, campaign: campaign });
        return ref;
    }

    /**
     * Returns all campaigns
     */
    function getCampaigns() public view returns (CampaignRef[] memory) {
        CampaignRef[] memory allCampaigns = new CampaignRef[](numberOfCampaigns);

        for (uint256 index = 0; index < numberOfCampaigns; index++) {
            Campaign storage campaign = campaigns[index];
            CampaignRef memory ref = CampaignRef({ id: index, campaign: campaign });
            allCampaigns[index] = ref;
        }

        return allCampaigns;
    }

    /**
     * Returns all ongoing campaigns
     */
    function getOngoingCampaigns() public view returns (CampaignRef[] memory) {
        CampaignRef[] memory allCampaigns = new CampaignRef[](numberOfCampaigns);

        for (uint256 index = 0; index < numberOfCampaigns; index++) {
            Campaign storage campaign = campaigns[index];
            if (!campaign.meta.isStopped) {
              CampaignRef memory ref = CampaignRef({ id: index, campaign: campaign });
              allCampaigns[index] = ref;
            }
        }

        return allCampaigns;
    }

    /**
     * Returns all boxes of a specific campaign
     */
    function getBoxes(uint256 _campaignId) public view returns (BoxOffer[] memory) {
        BoxOffer[] storage boxOffer = boxOffers[_campaignId];
        return boxOffer;
    }

    /**
     * Returns a list of all sold boxes for a specific campaign
     */
    function getSoldBoxes(uint256 _campaignId) public view returns(BoxSellRef[] memory) {
      Campaign storage campaign = campaigns[_campaignId];
      BoxSellRef[] memory boxSells = new BoxSellRef[](campaign.meta.boxesSold);

      for (uint256 index = 0; index < boxSells.length; index++) {
        boxSells[index] = soldBoxesCampaign[_campaignId][index];
      }

      return boxSells;
    }

    /**
     * Pay-out all stakeholders of the campaign
     */
    function payOut(uint256 _campaignId) public {
      Campaign storage campaign = campaigns[_campaignId];
      require(campaign.meta.isStopped, "The campaign must be finished");
      require(campaign.meta.boxesSold == campaign.meta.totalBoxes, "There can't be any boxes left");

      // TODO Check if supply chain has been completed
      // e.g. require(campaign.supplyChain.isCompleted);

      // Generate shares
      uint256 farmerShare = CrowdfundingLib.getFarmerShare(campaign);
      uint256 butcherShare = CrowdfundingLib.getButcherShare(campaign);
      uint256 deliveryShare = CrowdfundingLib.getDeliveryShare(campaign);

      // payout stakeholders
      payable(campaign.stakeholders.farmer.owner).transfer(farmerShare);
      payable(campaign.stakeholders.butcher.owner).transfer(butcherShare);
      payable(campaign.stakeholders.delivery.owner).transfer(deliveryShare);
    }

}
