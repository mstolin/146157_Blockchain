const Crowdfunding = artifacts.require("Crowdfunding");
const SupplyChains = artifacts.require("SupplyChains");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(SupplyChains);
  const SupplyChainsInstance = await SupplyChains.deployed();

  await deployer.deploy(Crowdfunding);
  const CrowdfundingInstance = await Crowdfunding.deployed();

  await CrowdfundingInstance.setSupplyChainsAddress(SupplyChainsInstance.address);
  await SupplyChainsInstance.setCrowdfundingAddress(CrowdfundingInstance.address);

  console.log("Crowdfunding address: ", CrowdfundingInstance.address);
  console.log("SupplyChains address: ", SupplyChainsInstance.address);
};
