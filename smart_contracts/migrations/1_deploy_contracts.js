const Crowdfunding = artifacts.require("Crowdfunding");
const CrowdfundingLib = artifacts.require("CrowdfundingLib");

function deployCrowdLib(deployer) {
  deployer.deploy(CrowdfundingLib);
  deployer.link(CrowdfundingLib, Crowdfunding);
}

module.exports = function(deployer) {
  deployCrowdLib(deployer);
  deployer.deploy(Crowdfunding);
};
