# Project Name

- [Setup](#setup)
    - [Installation](#installation)
    - [Deployment](#deployment)
    - [Testing](#testing)

This is a blockchain project. Description and name are WIP.

## Setup

This project is developed using [dev containers](https://containers.dev/). Therefore, no additional requirements,
except a container runtime (e.g. Docker), are required.

Additionally, the dev editor should support dev containers. When using VSCode, the 
[Dev Container Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) should
be installed.

## Smart Contracts

### Deployment

To deploy locally, start a local instance of ganache by running `ganache`
Then, simply call `truffle migrate`

### Testing

This box has examples for testing your smart contracts in both Javascript and Solidity.

To run the tests locally, call `truffle test`

## Frontend
