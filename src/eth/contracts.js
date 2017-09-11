import contractify from 'truffle-contract'

import ShopfrontArtifact from '../../build/contracts/Shopfront.json';
import MerchantArtifact from '../../build/contracts/Merchant.json';

const ShopfrontBuild = contractify(ShopfrontArtifact);
const MerchantBuild = contractify(MerchantArtifact);

// export const selectContractInstance = async (contract) => {
  // return new Promise(res => {
    // const contract = contractify(contractBuild);
    // contract.setProvider(web3.currentProvider);
    // contract
      // .deployed()
      // .then(instance => res(instance));
  // });
// }

const deployedContract = (contract, web3, address) => {
  return new Promise(res => {
    contract.setProvider(web3.currentProvider);
    res(address ? contract.at(address) : contract.deployed());
  });
}

const ShopfrontContract = (web3, address) => deployedContract(ShopfrontBuild, web3, address);
const MerchantContract = (web3, address) => deployedContract(MerchantBuild, web3, address);

export { ShopfrontContract, MerchantContract }


