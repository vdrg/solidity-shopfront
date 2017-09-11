pragma solidity ^0.4.15;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

import './Merchant.sol';

contract Shopfront is Ownable {

  // TODO: dynamic fees
  uint256 public fee;
  address[] public merchants;
  // For checking if a merchant is registered
  mapping(address => bool) public merchantRegistered;
  // Maps an address to its merchant contract
  mapping(address => address) public merchantAdmins;

  event LogProductBought(address indexed buyer, address indexed merchant, bytes32 indexed productId, bytes32 productName, uint256 stock);
  event LogMerchantRegistered(address indexed admin, address indexed merchant);

  modifier existingMerchant(address merchant) {
    require(merchantRegistered[merchant]);
    _;
  }

  function Shopfront(uint256 _fee) {
    fee = _fee;
  }

	function registerMerchant(bytes32 name) returns(address) {
    require(merchantAdmins[msg.sender] == 0);

    address merchant = new Merchant(name, msg.sender);

    merchantAdmins[msg.sender] = merchant;
    merchantRegistered[merchant] = true;
    merchants.push(merchant);

    LogMerchantRegistered(msg.sender, merchant);
		return merchant;
	}

  function numberOfMerchants() public constant returns(uint256) {
    return merchants.length;
  }

  function getMerchants() public constant returns(address[]) {
    return merchants;
  }

  function setFee(uint256 _fee) returns(bool success) {
    fee = _fee;
    return true;
  }

  function buyProduct(address merchant, bytes32 productId) 
    payable 
    existingMerchant(merchant)
    returns(bool success) 
  {
    require(msg.value >= fee);

    Merchant trustedMerchant = Merchant(merchant);

    bytes32 name;
    uint256 price;
    uint256 stock;

    (name, price, stock) = trustedMerchant.getProduct(productId);

    require(msg.value >= price);
    require(stock > 0);

    trustedMerchant.setProductStock(productId, --stock);
    trustedMerchant.transfer(msg.value - fee);

    LogProductBought(msg.sender, merchant, productId, name, stock);
    return true;
  }

  function widthdrawFees() onlyOwner returns(bool success) {
    owner.transfer(this.balance);
    return true;
  }
}
