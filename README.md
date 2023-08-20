# Blockmeat

- [Introduction](#introduction)
- [Setup](#setup)
- [Smart Contracts](#smart_contracts)
- [Frontend](#frontend)

This project was created as an exam requirements for the course Blockchain at the University of Trento.

## Introduction

The idea of this project is too combine Crowdbutching, Crowdfarming, and a Supply Chain.

The conceptual design looks like the following: First, a farmer creates a crowdfunding campain for an animal. After the 
crowdfunding was successfull, this means that all eatable/usable parts of the animal have been sold, the supply chain 
starts automatically.

The supply chain contains the farmer, the butcher, and the delivery service. After the customer has received his meats, 
all participants of the supply chain are automatically paid with the crowdfunding stake.

For more details, see the report at [Report.pdf](Report.pdf).

## Setup

This project is developed using [dev containers](https://containers.dev/). Therefore, a container runtime (e.g. Docker) 
is required. This dev container should install the required runtime to run the project.

Additionally, the dev editor should support dev containers. When using VSCode, the 
[Dev Container Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) should
be installed.

## Usage

### 1. Start Ganache

Move to the `ganache` directory and execute the `start-ganache.sh` executable. Additionally, you might change the
settings in the sh script.

```sh
cd ganache/
./start-ganache.sh
```

### 2. Setup MetaMask

It is required that you have [MetaMask](https://metamask.io/) installed. Then, add the ganache blockchain to your 
networks. The ganache network should run at `http://127.0.0.1:8545`. After the ganache blockchain is up, copy one of the
private keys from the output of the first step add import the account account in MetaMask.

- https://support.metamask.io/hc/en-us/articles/360043227612-How-to-add-a-custom-network-RPC
- https://support.metamask.io/hc/en-us/articles/360015489331-How-to-import-an-account

### 3. Start Frontend Application

Change to the `frontend/` directory and run `yarn run start`. Yarn is the preferred way in this project. it is recommend
not to mix yarn with other package managers like npm.

```sh
cd frontend/
yarn run start
```

## Smart Contracts

### Testing

It is highly recommend to write tests for the smart contracts, before they are being used in the frontend. For testing,
don't use the debug ganache blockahain. It is preferred use `start-ganache-test.sh` instead.

```sh
cd ganache/
./start-ganache-test.sh
```

### Migrating

After the smart contracts have been tested successfully. You can migrate them to the debug ganache blockchain. First,
set up the debug blockchain as in [Start Ganache](#1-start-ganache). Then migrate the contracts using truffle. You can 
see if everything was successful in the ganache output. Afterward, it is required to update the ABIs located at
`frontend/src/assets/abi`.

```sh
cd smart_contracts/
truffle migrate
```
