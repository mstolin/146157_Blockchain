const Crowdfunding = artifacts.require("Crowdfunding");

module.exports = function(deployer) {
  deployer.deploy(Crowdfunding);
  /*deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);*/
};
