// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.13;

import "./Types.sol";
import "./SupplyChains.sol";

contract Crowdfunding {
    // address of the supply chain contract
    address public supplychainAddress;

    // all campaigns
    mapping(uint256 => Campaign) public campaigns;
    // Boxes of each campaign
    mapping(uint256 => mapping(uint256 => Box)) boxes;
    // Sold boxes of each campaign (campignId => sellId => BoxSellRef)
    mapping(uint256 => mapping(uint256 => BoxSellRef)) soldBoxes;

    uint256 public numberOfCampaigns = 0;

    // retrieve supply chain contract address from truffle deployment
    constructor(address _supplychainAddress) {
        supplychainAddress = _supplychainAddress;
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
        Box[] memory _boxes
    ) public returns (uint256) {
        // check crowdfunding duration
        require(_duration > 0, "Duration must be higher than 0");
        require(_duration <= 6 weeks, "Duration can't be higher than 6 weeks");

        // create deadline by adding the duration to the current timestamp
        uint256 current = block.timestamp;
        uint256 deadline = current + _duration;

        // validate
        require(deadline > current, "Deadline must be in the future");

        // add boxes to campaign
        uint256 totalNumOfBoxes = 0;
        for (uint256 index = 0; index < _boxes.length; index++) {
            Box memory box = _boxes[index];
            require(
                box.total > 0,
                "There must be at least one piece of each box"
            );
            require(
                box.total == box.available,
                "Initially total and available must be equal"
            );
            totalNumOfBoxes += box.total;
            boxes[numberOfCampaigns][box.id] = box;
        }
        require(totalNumOfBoxes > 0, "There must be at least one box in total");

        Campaign storage campaign = campaigns[numberOfCampaigns];
        campaign.id = numberOfCampaigns;
        campaign.owner = _campaignOwner;
        campaign.info.title = _title;
        campaign.info.description = _description;
        campaign.info.deadline = deadline;
        campaign.meta.createdAt = block.timestamp;
        campaign.meta.collectedAmount = 0;
        campaign.meta.isStopped = false;
        campaign.meta.totalBoxes = totalNumOfBoxes;
        campaign.meta.boxesSold = 0;
        campaign.meta.totalBoxTypes = _boxes.length;
        campaign.animal = _animal;
        campaign.stakeholders = _stakeholders;

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
     * Returns all boxes of a specific campaign
     */
    function getBoxes(uint256 _campaignId) public view returns (Box[] memory) {
        Campaign storage campaign = campaigns[_campaignId];
        uint256 totalBoxTypes = campaign.meta.totalBoxTypes;
        Box[] memory boxesOfCampaign = new Box[](totalBoxTypes);
        for (uint256 index = 0; index < totalBoxTypes; index++) {
            Box storage box = boxes[_campaignId][index];
            boxesOfCampaign[index] = box;
        }
        return boxesOfCampaign;
    }

    /**
     * Returns the sell reference of boxes for a specific campaign
     */
    function getSoldBoxes(
        uint256 _campaignId
    ) public view returns (BoxSellRef[] memory) {
        Campaign storage campaign = campaigns[_campaignId];
        uint256 boxesSold = campaign.meta.boxesSold;
        BoxSellRef[] memory sellRefs = new BoxSellRef[](boxesSold);
        for (uint256 index = 0; index < boxesSold; index++) {
            BoxSellRef storage sellRef = soldBoxes[_campaignId][index];
            sellRefs[index] = sellRef;
        }
        return sellRefs;
    }

    /**
     * Removes a campaign
     */
    function stopCampaign(uint256 _campaignId) public returns (bool) {
        Campaign storage campaign = campaigns[_campaignId];
        require(!campaign.meta.isStopped, "Campaign already stopped");
        require(
            campaign.info.deadline > block.timestamp,
            "This campaign is over"
        );
        require(
            msg.sender == campaign.owner.owner,
            "Only the owner can stop a campaign"
        );

        campaign.meta.isStopped = true;

        return true;
    }

    /**
     * Buys a box
     */
    function buyBox(
        uint256 _campaignId,
        uint256 _boxId,
        string memory _physAddress
    ) public payable {
        // get campaign ref
        Campaign storage campaign = campaigns[_campaignId];
        // check if this is an ongoing campaign
        require(!campaign.meta.isStopped, "This campaign has stopped");
        require(
            campaign.info.deadline > block.timestamp,
            "This campaign is already over"
        );

        // check if this campaign still has available boxes for the requested kind
        Box storage box = boxes[_campaignId][_boxId];
        require(box.id == _boxId, "The box ID is invalid");
        require(box.available > 0, "All boxes of this type have been sold");
        uint256 amount = msg.value;
        require(amount >= box.price, "Given amount is below box price");

        // Add buyer (Don't increase boxes sold yet, we need it starting at 0)
        uint256 sellId = campaign.meta.boxesSold;
        BoxSellRef storage sellRef = soldBoxes[_campaignId][
            campaign.meta.boxesSold
        ];
        sellRef.boxId = box.id;
        sellRef.id = sellId;
        sellRef.owner = msg.sender;
        sellRef.physAddress = _physAddress;
        sellRef.boughtAt = block.timestamp;

        // Updates available boxes by one
        box.available -= 1;
        // Update campaign meta
        CampaignMeta storage meta = campaign.meta;
        meta.boxesSold += 1;
        meta.collectedAmount += amount;

        if (campaign.meta.boxesSold == campaign.meta.totalBoxes) {
            // Mark campaign as stopped
            campaign.meta.isStopped = true;
            // Start supply chain
            SupplyChains(supplychainAddress).StartSupplyChain(campaign, getSoldBoxes(campaign.id));
        }
    }

    /**
     * Pay-out all stakeholders of the campaign
     */
    function payOut(uint256 _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.meta.isStopped, "The campaign must be finished");
        require(
            campaign.meta.boxesSold == campaign.meta.totalBoxes,
            "There can't be any boxes left"
        );
        // Check if supply chain has been completed
        require(
            SupplyChains(supplychainAddress).isCompleted(campaign.id), 
            "Supply chain must be completed"
        );

        // Generate shares
        uint256 farmerShare = campaign.meta.collectedAmount * campaign.stakeholders.farmer.share;
        uint256 butcherShare = campaign.meta.collectedAmount * campaign.stakeholders.butcher.share;
        uint256 deliveryShare = campaign.meta.collectedAmount * campaign.stakeholders.delivery.share;

        // payout stakeholders
        payable(campaign.stakeholders.farmer.owner).transfer(farmerShare);
        payable(campaign.stakeholders.butcher.owner).transfer(butcherShare);
        payable(campaign.stakeholders.delivery.owner).transfer(deliveryShare);
    }

    /*
    * Initialize data for supply chain testing purposes: add a new campaign
    */
    function initializeData(
        address payable owner,
        address payable farmer, 
        address payable butcher,
        address payable delivery,
        string memory private_key
    ) public {
        string memory title = "Test Campaign";
        string memory descritpion = "This is a test campaign";
        uint32 duration = 6 weeks;
        CampaignOwner memory campaign_owner = CampaignOwner(owner, private_key);

        Stakeholder memory test_farmer = Stakeholder(farmer, 20, "Farmer");
        Stakeholder memory test_butcher = Stakeholder(butcher, 30, "Butcher");
        Stakeholder memory test_delivery = Stakeholder(delivery, 50, "Delivery");
        StakeholderList memory stakeholders = StakeholderList(test_farmer, test_butcher, test_delivery);

        CampaignAnimalData memory animal = CampaignAnimalData("123456789", "Berta", "Bauernhof", 2);

        Box[] memory test_boxes = new Box[](3);
        Box memory box1 = Box(0, "Test Box 1", "descritpion", 10000, 1, 1);
        Box memory box2 = Box(1, "Test Box 2", "descritpion", 15000, 2, 2);
        Box memory box3 = Box(2, "Test Box 3", "descritpion", 20000, 1, 1);
        test_boxes[0] = box1;
        test_boxes[1] = box2;
        test_boxes[2] = box3;

        createCampaign(title, descritpion, duration, campaign_owner, stakeholders, animal, test_boxes);
    }
}
