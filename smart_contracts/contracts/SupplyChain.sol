// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.13;

contract SupplyChain {

    event Transfered();
    event Butched();
    event Delivered();

    address farmer;
    address butcher;
    address deliveryService;
    /// Is the cow transfered to the butcher
    bool isTransfered;
    /// Is the cow butched
    bool isButched;
    /// Is the cow delivered to the consumer
    bool isDelivered;

    constructor(address _farmer, address _butcher, address _deliveryService) {
        farmer = _farmer;
        butcher = _butcher;
        deliveryService = _deliveryService;
    }

    /**
    Automatically distributes eths gained through the crowdfunding.
    Listens to an event.
     */
    function distribute() private {
        if (isButched) {
            // pay farmer
        }
    }

}
