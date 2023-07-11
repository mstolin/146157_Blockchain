// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.13;

contract Crowdfunding {
    struct Box {
        /// Title of a box
        string title;
        /// Description of a box
        string description;
        /// The percentage a box adds up to the total
        uint8 percentage;
        /// The price of this box in eth
        uint256 price;
    }

    struct BoxSell {
        /// Buyer of the box
        address buyer;
        /// Sold box
        Box box;
    }

    struct BoxOffer {
        /// The box to sell
        Box box;
        /// Number of available boxes
        uint256 available;
        /// Total number of boxes
        uint256 total;
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
        /// Sold percentage
        uint8 progress;
        /// The deadline of this campaign
        uint256 deadline;
    }

    // all campaigns
    mapping(uint256 => Campaign) public campaigns;
    // available boxes for specific campaigns
    mapping(uint256 => BoxOffer[]) public availableBoxes;
    // sold boxes for specific campaign
    mapping(uint256 => BoxSell[]) public soldBoxes;

    uint256 public numberOfCampaigns = 0;

    /**
     * Creates a new campaign
     */
    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _deadline,
        BoxOffer[] memory _boxes
    ) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];
        BoxOffer[] storage _availableBoxes = availableBoxes[numberOfCampaigns];

        // deadline can't be in the past
        require(
            campaign.deadline < block.timestamp,
            "Deadline must be in the future"
        );

        // all boxes have to add up to 100
        uint8 totalPercentage = 0;
        for (uint256 index = 0; index < _boxes.length; index++) {
            BoxOffer memory offer = _boxes[index];
            require(offer.available >= 1, "There must be at least one box to sell");

            Box memory box = offer.box;
            // A box must add some percentage to the total
            require(
                box.percentage > 0 && box.percentage <= 100,
                "The percentage of a box can't must be higher than 0 and lower or equal to 100"
            );

            totalPercentage += box.percentage;
        }
        require(
            totalPercentage == 100,
            "Sum of the percentage of all boxes must be equal to 100"
        );

        // Create campaign
        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.collectedAmount = 0;
        campaign.progress = 0;
        campaign.deadline = _deadline;

        // add boxes
        for (uint256 index = 0; index < _boxes.length; index++) {
            BoxOffer memory offer = _boxes[index];
            _availableBoxes.push(offer);
        }

        // increase total num of campaigns
        numberOfCampaigns++;

        // return the most recent campaign index
        return numberOfCampaigns - 1;
    }

    /**
     * Buys a box
     */
    function buyBox(uint256 _campaignId, uint256 _boxId) public payable {
        uint256 amount = msg.value;

        // get desired campaign and box
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.deadline <= block.timestamp, "This campaign is over");
        BoxOffer storage boxOffer = availableBoxes[_campaignId][_boxId];
        require(boxOffer.available > 0, "All boxes of this type have been sold");
        Box memory box = boxOffer.box;
        require(box.price <= amount, "Given amount is below box price");

        // Reduce available boxes by one
        boxOffer.available--;
        // Add to total percentage
        campaign.progress+=box.percentage;
        // Add total collected amount
        campaign.collectedAmount+=amount;
        // Add buyer
        BoxSell[] storage _soldBoxes = soldBoxes[_campaignId];
        BoxSell memory boxSell = BoxSell({buyer: msg.sender, box: box});
        _soldBoxes.push(boxSell);

        // TODO Check if percentage is 100%, if yes -> start chain
    }

    /**
     * Returns a specific campaign
     */
    function getCampaign(uint256 _campaignId) public view returns (Campaign memory) {
        Campaign storage campaign = campaigns[_campaignId];
        return campaign;
    }

    /**
     * Returns all campaigns
     */
    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for (uint256 index = 0; index < numberOfCampaigns; index++) {
            Campaign storage campaign = campaigns[index];
            allCampaigns[index] = campaign;
        }

        return allCampaigns;
    }

    /**
     * Returns all available boxes for a specific campaign
     */
    function getAvailableBoxes(uint256 _campaignId) public view returns (BoxOffer[] memory) {
        BoxOffer[] storage boxOffer = availableBoxes[_campaignId];
        return boxOffer;
    }

}
