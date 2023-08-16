const Crowdfunding = artifacts.require("Crowdfunding");
const SupplyChains = artifacts.require("SupplyChains");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(SupplyChains);
  const SupplyChainsInstance = await SupplyChains.deployed();

  await deployer.deploy(Crowdfunding, SupplyChainsInstance.address);
  const CrowdfundingInstance = await Crowdfunding.deployed();

  console.log("Crowdfunding address: ", CrowdfundingInstance.address);
  console.log("SupplyChains address: ", SupplyChainsInstance.address);
};
