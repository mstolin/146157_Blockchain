// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.13;

contract Crowdfunding {
    struct Box {
        /// The percentage a box adds up to the total
        uint8 percentage;
        /// Title of a box
        string title;
        /// Description of a box
        string description;
        /// The price of this box in eth
        uint256 price;
    }

    struct Campaign {
        /// Owner of this campaign
        address owner;
        /// The campaigns title
        string title;
        /// The campaigns description
        string description;
        /// Target amount in eth of this campaign
        uint256 targetAmount;
        /// Total amount collected in eth
        uint256 collectedAmount;
        /// The deadline of this campaign
        uint256 deadline;
        /// List of all buyers
        address[] buyers;
        /// List of all available boxes
        Box[] availableBoxes;
        /// List of all sold boxes
        Box[] soldBoxes;
    }

    // This allows to access campaigns like campaigns[0]
    mapping(uint256 => Campaign) public campaigns;

    uint256 public numberOfCampaigns = 0;

    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _targetAmount,
        uint256 _deadline,
        Box[] memory _boxes
    ) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];

        // deadline can't be in the past
        require(
            campaign.deadline < block.timestamp,
            "Deadline must be in the future"
        );

        // all boxes have to add up to 100
        uint8 totalPercentage = 0;
        for (uint256 index = 0; index < _boxes.length; index++) {
            Box memory box = _boxes[index];
            // A box must add some percentage to the total
            require(
                box.percentage > 0 && box.percentage <= 100,
                "The percentage of a box can't must be higher than 0 and lower or equal to 100"
            );
            totalPercentage += _boxes[index].percentage;
        }
        require(
            totalPercentage == 100,
            "Sum of the percentage of all boxes must be equal to 100"
        );

        // Create campaign
        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.targetAmount = _targetAmount;
        campaign.collectedAmount = 0;
        campaign.deadline = _deadline;
        campaign.availableBoxes = _boxes;

        // increase total num of campaigns
        numberOfCampaigns++;

        // return the most recent campaign index
        return numberOfCampaigns - 1;
    }

    function buyBox() {}

    function getCampaigns() {}

    /*address owner;
    uint256 deadline;
    string title;
    string description;
    Box[] availableBoxes;
    Box[] soldBoxes;*/

    /*constructor(string memory _title, string memory _description, uint256 _days, Box[] memory _boxes) {
        owner = msg.sender;
        title = _title;
        description = _description;
        
        uint8 totalPercentage = 0;
        for (uint256 index = 0; index < _boxes.length; index++) {
            Box memory box = _boxes[index];
            // A box must add some percentage to the total
            require(box.percentage > 0 && box.percentage <= 100);
            totalPercentage+=_boxes[index].percentage;
        }
        // total percentage must be 100
        require(totalPercentage == 100);
        availableBoxes = _boxes;
    }*/
}
