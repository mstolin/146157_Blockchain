// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.13;

contract Crowdfunding {

    struct Box {
        /// Title of a box
        string title;
        /// Description of a box
        string description;
        /// The price of this box in wei
        uint16 price;
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
    }

    struct Stakeholder {
      /// Address of the stakeholder
      address payable owner;
      /// Share in %
      uint8 share;
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
        /// Total number of boxes
        uint256 totalBoxes;
        /// Number of sold boxes
        uint256 boxesSold;
        /// Is it already stopped
        bool isStopped;
        /// Responsible farmer
        Stakeholder farmer;
        /// Resonsible butcher
        Stakeholder butcher;
        /// Responsible delivery service
        Stakeholder delivery;
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
    // sold boxes for specific campaigns (campginId => sellId => BoxSellRef)
    mapping(uint256 => mapping(uint256 => BoxSellRef)) public soldBoxesCampaign;
    // sold boxes for specific addresses
    //mapping(address => mapping(uint => BoxSellRef[])) public soldBoxesAddress;

    uint256 public numberOfCampaigns = 0;

    /**
     * Adds a buyer
     */
    function addBuyer(uint256 _campaignId, address _buyer, Box memory _box) private {
      Campaign storage campaign = campaigns[_campaignId];
      // Make sure boxesSold has not been increased yet
      uint256 boxId = campaign.boxesSold;

      BoxSellRef storage soldBox = soldBoxesCampaign[_campaignId][boxId];
      soldBox.id = boxId;
      soldBox.owner = _buyer;
      soldBox.box = _box;
    }

    /**
     * Creates a new campaign
     */
    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint32 _duration,
        Stakeholder memory _farmer,
        Stakeholder memory _butcher,
        Stakeholder memory _delivery,
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

        // validate stakeholders
        require(_farmer.share > 0 && _farmer.share <= 100, "Farmer share must be higher than 0% and can't be higher than 100%");
        require(_butcher.share > 0 && _butcher.share <= 100, "Butcher share must be higher than 0% and can't be higher than 100%");
        require(_delivery.share > 0 && _delivery.share <= 100, "Delivery Service share must be higher than 0% and can't be higher than 100%");
        uint8 totalShare = _farmer.share + _butcher.share + _delivery.share;
        require(totalShare == 100, "The total share of all stakeholders must be equal to 100%");

        // validate boxes
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

        // Create campaign
        Campaign storage campaign = campaigns[numberOfCampaigns];
        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.collectedAmount = 0;
        campaign.deadline = deadline;
        campaign.isStopped = false;
        campaign.totalBoxes = numberOfBoxes;
        campaign.boxesSold = 0;
        campaign.farmer = _farmer;
        campaign.butcher = _butcher;
        campaign.delivery = _delivery;

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
        require(boxOffer.id == _boxId, "The box ID is invalid");
        require(boxOffer.available > 0, "All boxes of this type have been sold");

        // check if the offer is valid
        Box memory box = boxOffer.box;
        uint256 amount = msg.value;
        require(amount >= box.price, "Given amount is below box price");

        // Add buyer
        addBuyer(_campaignId, msg.sender, box);

        // Updates available boxes by one
        boxOffer.available-=1;
        campaign.boxesSold+=1;
        // Add to total collected amount
        campaign.collectedAmount+=amount;

        if (campaign.boxesSold == campaign.totalBoxes) {
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

    /**
     * Returns a list of all sold boxes for a specific campaign
     */
    function getSoldBoxes(uint256 _campaignId) public view returns(BoxSellRef[] memory) {
      Campaign storage campaign = campaigns[_campaignId];
      BoxSellRef[] memory boxSells = new BoxSellRef[](campaign.boxesSold);

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
      require(campaign.isStopped, "The campaign must be finished");
      require(campaign.boxesSold == campaign.totalBoxes, "There can't be any boxes left");

      // TODO Check if supply chain has been completed
      // e.g. require(campaign.supplyChain.isCompleted);

      // Generate shares
      uint256 farmerShare = campaign.collectedAmount * campaign.farmer.share;
      uint256 butcherShare = campaign.collectedAmount * campaign.farmer.share;
      uint256 deliveryShare = campaign.collectedAmount * campaign.farmer.share;

      // payout stakeholders
      payable(campaign.farmer.owner).transfer(farmerShare);
      payable(campaign.butcher.owner).transfer(butcherShare);
      payable(campaign.delivery.owner).transfer(deliveryShare);
    }

}
