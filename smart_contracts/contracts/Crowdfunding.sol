// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.13;

import "./CrowdfundingTypes.sol";
import "./SupplyChains.sol";

contract Crowdfunding {
    // address of the supply chain contract
    address public supplychainAddress;

    // all campaigns
    mapping(uint256 => Campaign) campaigns;
    // Boxes of each campaign
    mapping(uint256 => mapping(uint8 => Box)) boxes;
    // Sold boxes of each campaign (campignId => sellId => BoxSellRef)
    mapping(uint256 => mapping(uint256 => BoxSellRef)) soldBoxes;

    uint256 numberOfCampaigns = 0;
    
    // Add the address of the supply chain contract
    function setSupplyChainsAddress(address _supplychainAddress) public {
        supplychainAddress = _supplychainAddress;
    }

    // Events
    event CampaignCreated(uint256 campaignId, address campaignOwnerAddress);
    event CampaignStopped(uint256 campaignId);
    event BoxSold(uint256 campaignId, uint16 boxId, uint16 SellRefId, address consumerAddress);
    event Payment(uint256 campaignId, address stakeholderAddress, uint256 amountInWei);

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
    ) public {
        // check crowdfunding duration
        require(_duration > 0, "Duration must be higher than 0");
        require(_duration <= 6 weeks, "Duration can't be higher than 6 weeks");

        // create deadline by adding the duration to the current timestamp
        uint256 current = block.timestamp;
        uint256 deadline = current + _duration;

        // validate
        require(deadline > current, "Deadline must be in the future");

        // add boxes to campaign
        require(_boxes.length <= type(uint8).max, "Number of boxes can't be higher than (2^8)-1");
        uint16 totalNumOfBoxes = 0;
        for (uint8 index = 0; index < _boxes.length; index++) {
            Box memory box = _boxes[index];
            require(
                box.total > 0,
                "There must be at least one piece of each box"
            );
            require(
                box.total == box.available,
                "Initially total and available of a box must be equal"
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
        campaign.meta.totalBoxTypes = uint8(_boxes.length);
        campaign.animal = _animal;
        campaign.stakeholders = _stakeholders;

        // increase total num of campaigns
        numberOfCampaigns++;

        emit CampaignCreated(campaign.id, msg.sender);

        // Start supply chain
        SupplyChains(supplychainAddress).createSupplyChain(campaign);
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
        uint8 totalBoxTypes = campaign.meta.totalBoxTypes;
        Box[] memory boxesOfCampaign = new Box[](totalBoxTypes);
        for (uint8 index = 0; index < totalBoxTypes; index++) {
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
        uint16 boxesSold = campaign.meta.boxesSold;
        BoxSellRef[] memory sellRefs = new BoxSellRef[](boxesSold);
        for (uint16 index = 0; index < boxesSold; index++) {
            BoxSellRef storage sellRef = soldBoxes[_campaignId][index];
            sellRefs[index] = sellRef;
        }
        return sellRefs;
    }

    /**
     * Removes a campaign
     */
    function stopCampaign(uint256 _campaignId) public {
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

        // Pay ether back
        uint16 boxesSold = campaign.meta.boxesSold;
        for (uint16 index = 0; index < boxesSold; index++) {
            BoxSellRef storage sellRef = soldBoxes[_campaignId][index];
            Box storage box = boxes[_campaignId][sellRef.boxId];
            payable(sellRef.owner).transfer(box.price);
        }

        campaign.meta.isStopped = true;
        emit CampaignStopped(_campaignId);
    }

    /**
     * Buys a box
     */
    function buyBox(
        uint256 _campaignId,
        uint8 _boxId,
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
        uint16 sellId = campaign.meta.boxesSold;
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

        emit BoxSold(campaign.id, box.id, sellRef.id, msg.sender);

        SupplyChains(supplychainAddress).addBox(_campaignId, sellRef);

        if (campaign.meta.boxesSold == campaign.meta.totalBoxes) {
            // Mark campaign as stopped
            campaign.meta.isStopped = true;
            emit CampaignStopped(campaign.id);
            // Start supply chain
            SupplyChains(supplychainAddress).startSupplyChain(campaign.id);
        }
    }

    /**
     * Pay-out all stakeholders of the campaign
     */
    function payOut(uint256 _campaignId) external payable {
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
        uint256 farmerShare = (campaign.meta.collectedAmount * campaign.stakeholders.farmer.share) / 100;
        uint256 butcherShare = (campaign.meta.collectedAmount * campaign.stakeholders.butcher.share) / 100;
        uint256 deliveryShare = (campaign.meta.collectedAmount * campaign.stakeholders.delivery.share) / 100;

        // payout stakeholders
        payable(campaign.stakeholders.farmer.owner).transfer(farmerShare);
        emit Payment(campaign.id, campaign.stakeholders.farmer.owner, farmerShare);
        payable(campaign.stakeholders.butcher.owner).transfer(butcherShare);
        emit Payment(campaign.id, campaign.stakeholders.butcher.owner, butcherShare);
        payable(campaign.stakeholders.delivery.owner).transfer(deliveryShare);
        emit Payment(campaign.id, campaign.stakeholders.delivery.owner, deliveryShare);
    }
}
