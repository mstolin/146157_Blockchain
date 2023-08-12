const Crowdfunding = artifacts.require("Crowdfunding");
const SupplyChains = artifacts.require("SupplyChains");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(SupplyChains);
  const SupplyChainsInstance = await SupplyChains.deployed();

  await deployer.deploy(Crowdfunding, SupplyChainsInstance.address);
  const CrowdfundingInstance = await Crowdfunding.deployed();

  console.log("Crowdfunding address: ", CrowdfundingInstance.address);
  console.log("SupplyChains address: ", SupplyChainsInstance.address);
  // deployer.deploy(Crowdfunding);

  await CrowdfundingInstance.initializeData(accounts[1], accounts[2], accounts[3], accounts[4], "RANDOM_SECRET");
  console.log("Owner address: ", accounts[1]);
  console.log("Farmer address: ", accounts[2]);
  console.log("Butcher address: ", accounts[3]);
  console.log("Delivery address: ", accounts[4]);
  console.log("Crowdfunding data initialized");
};
