var CatalogLib = artifacts.require("./CatalogLib.sol");
var Merchant = artifacts.require("./Merchant.sol");
var Shopfront = artifacts.require("./Shopfront.sol");

module.exports = function(deployer) {
  deployer.deploy(CatalogLib);
  deployer.link(CatalogLib, Merchant);
  deployer.deploy(Shopfront);
  deployer.deploy(Merchant);
};
