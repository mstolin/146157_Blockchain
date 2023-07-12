// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.13;

contract Crowdfunding {
    struct Box {
        /// Title of a box
        string title;
        /// Description of a box
        string description;
        /// The price of this box in eth
        uint16 price;
    }

    struct BoxOffer {
        /// The box to sell
        Box box;
        /// Number of available boxes
        uint8 available;
    }

    struct Campaign {
        /// Owner of this campaign
        address owner;
        /// The campaigns title
        string title;
        /// The campaigns description
        string description;
        /// Total amount collected in eth
        uint256 collectedAmount;
        /// The deadline of this campaign
        uint256 deadline;
        /// Is it already stopped
        bool isStopped;
    }

    struct CampaignRef {
      /// Campaign id
      uint256 id;
      /// reference to the campaign
      Campaign campaign;
    }

    // all campaigns
    mapping(uint256 => Campaign) public campaigns;
    // available boxes for specific campaigns
    mapping(uint256 => BoxOffer[]) public boxOffers;
    // sold boxes for specific campaigns
    mapping(uint256 => mapping(address => Box[])) public soldBoxesCampaign;
    // sold boxes for specific addresses
    mapping(address => mapping(uint => Box[])) public soldBoxesAddress;

    uint256 public numberOfCampaigns = 0;

    /**
     * Determines of a campaign has been sold out
     */
    function isCampaignSoldOut(uint256 _campaignId) private view returns (bool) {
      BoxOffer[] storage offers = boxOffers[_campaignId];
      uint256 availableBoxes = 0;

      for (uint256 index = 0; index < offers.length; index++) {
        BoxOffer memory offer = offers[index];
        availableBoxes += offer.available;
      }

      return availableBoxes == 0;
    }

    /**
     * Adds a buyer
     */
    function addBuyer(uint256 _campaignId, address _buyer, Box memory _box) private {
      Box[] storage _soldBoxesCampaign = soldBoxesCampaign[_campaignId][_buyer];
      Box[] storage _soldBoxesAddress = soldBoxesAddress[_buyer][_campaignId];
      _soldBoxesCampaign.push(_box);
      _soldBoxesAddress.push(_box);
    }

    /**
     * Creates a new campaign
     */
    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint32 _duration,
        BoxOffer[] memory _boxes
    ) public returns (uint256) {
        // check crowdfunding duration
        require(_duration <= 6 weeks, "Duration can't be higher than 6 weeks");

        // create deadline by adding the duration to the current timestamp
        uint256 current = block.timestamp;
        uint256 deadline = current + _duration;

        // deadline can't be in the past
        require(
            deadline > current,
            "Deadline must be in the future"
        );

        // validate boxes
        require(_boxes.length > 0, "At least one box is required");
        for (uint256 index = 0; index < _boxes.length; index++) {
            BoxOffer memory offer = _boxes[index];
            require(offer.available > 0, "There must be at least one box to sell");

            Box memory box = offer.box;
            // A box requires a price
            require(
                box.price > 0,
                "A box requires a price higher than 0"
            );
        }

        // Create campaign
        Campaign storage campaign = campaigns[numberOfCampaigns];
        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.collectedAmount = 0;
        campaign.deadline = deadline;
        campaign.isStopped = false;

        // add boxes
        BoxOffer[] storage _offers = boxOffers[numberOfCampaigns];
        for (uint256 index = 0; index < _boxes.length; index++) {
            BoxOffer memory offer = _boxes[index];
            _offers.push(offer);
        }

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
     * Removes a campaign
     */
    function stopCampaign(uint256 _campaignId) public returns (bool) {
      Campaign storage campaign = campaigns[_campaignId];
      require(!campaign.isStopped, "Campaign already stopped");
      require(campaign.deadline > block.timestamp, "This campaign is over");
      require(msg.sender == campaign.owner, "Only the owner can stop a campaign");

      campaign.isStopped = true;

      return true;
    }

    /**
     * Buys a box
     */
    function buyBox(uint256 _campaignId, uint256 _boxId) public payable {
        // get campaign ref
        Campaign storage campaign = campaigns[_campaignId];

        // check if this is an ongoing campaign
        require(!campaign.isStopped, "This campaign has stopped");
        require(campaign.deadline > block.timestamp, "This campaign is over");

        // check if this campaign still has available boxes for the requested kind
        BoxOffer storage boxOffer = boxOffers[_campaignId][_boxId];
        require(boxOffer.available > 0, "All boxes of this type have been sold");

        // check if the offer is valid
        Box memory box = boxOffer.box;
        uint256 amount = msg.value;
        require(amount >= box.price, "Given amount is below box price");

        // Add buyer
        addBuyer(_campaignId, msg.sender, box);

        // Reduce available boxes by one
        boxOffer.available = boxOffer.available - 1;
        // Add to total collected amount
        campaign.collectedAmount+=amount;

        bool isSoldOut = isCampaignSoldOut(_campaignId);
        if (isSoldOut) {
          // Mark campaign as stopped
          campaign.isStopped = true;
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
            if (!campaign.isStopped) {
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

}
