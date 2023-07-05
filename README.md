# Project Name

- [Introduction](#introduction)
- [Setup](#setup)
- [Smart Contracts](#smart_contracts)
- [Frontend](#frontend)

This is a blockchain project. Description and name are WIP.

## Introduction

The idea of this project is too combine Crowdbutching, Crowdfarming, and a Supply Chain.

The conceptual design looks like the following: First, a farmer creates a crowdfunding campain for an animal. After the 
crowdfunding was successfull, this means that all eatable/usable parts of the animal have been sold, the supply chain 
starts automatically.

The supply chain contains the farmer, the butcher, and the delivery service. After the customer has received his meats, 
all participants of the supply chain are automatically paid with the crowdfunding stake. 

## Setup

This project is developed using [dev containers](https://containers.dev/). Therefore, a container runtime (e.g. Docker) 
is required. This dev container should install the required runtime to run the project.

Additionally, the dev editor should support dev containers. When using VSCode, the 
[Dev Container Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) should
be installed.

## Ganache

This project requires [Ganache](https://trufflesuite.com/ganache/). Simply install the desktop application. Afterward, 
connect you [MetaMask](https://metamask.io/) wallet with some test account. See 
https://www.geeksforgeeks.org/how-to-set-up-ganche-with-metamask/.

## Smart Contracts

## Frontend

The frontend application is a simple React app located at `./frontend`. To start, run `yarn start`.
