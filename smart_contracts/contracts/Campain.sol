// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.13;

contract Campain {

    struct Box {
        uint8 percentage;
        string title;
        string description;
    }

    address owner;
    uint256 deadline;
    string title;
    string description;
    Box[] availableBoxes;
    Box[] soldBoxes;

    constructor(string memory _title, string memory _description, uint256 _days, Box[] memory _boxes) {
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
    }

    function sellBox(uint256 boxIndex) payable external {
        
    }

}
