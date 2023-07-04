// SPDX-License-Identifier: AGPL
pragma solidity ^0.8.13;

contract Role {
    
    address payable wallet;
    uint8 stake;

    constructor(address _wallet, uint8 _stake) {
        wallet = _wallet;
        stake = _stake;
    }

}
