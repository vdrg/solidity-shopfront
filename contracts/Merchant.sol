pragma solidity ^0.4.15;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

import './CatalogLib.sol';

contract Merchant is Ownable {

  bytes32 public name;
  address public admin;

  using CatalogLib for CatalogLib.Catalog;
  CatalogLib.Catalog catalog;

  event LogProductAdded(bytes32 indexed productId, bytes32 indexed productName, uint256 price, uint256 stock);
  event LogProductDeleted(bytes32 indexed productId);

  modifier onlyAdmin {
    require(msg.sender == admin);
    _;
  }

  modifier onlyAdminOrOwner {
    require(msg.sender == admin || msg.sender == owner);
    _;
  }

	function Merchant(bytes32 _name, address _admin) {
    name = _name;
    admin = _admin;
	}

  function addProduct(bytes32 productName, uint256 price, uint256 stock) public onlyAdmin returns(bool success) {
    bytes32 id = keccak256(productName);
    success = catalog.addProduct(id, productName, price, stock);
    LogProductAdded(id, productName, price, stock);
  }

  function deleteProduct(bytes32 productId) public onlyAdmin returns(bool success) {
    success = catalog.deleteProduct(productId);
    LogProductDeleted(productId);
  }

  function setProductPrice(bytes32 productId, uint256 price) public onlyAdmin returns(bool success) {
    catalog.setPrice(productId, price);
    return true;
  }

  function setProductStock(bytes32 productId, uint256 stock) public onlyAdminOrOwner returns(bool success) {
    catalog.setStock(productId, stock);
    return true;
  }

  function getCatalogSize() constant returns(uint256) { return catalog.size(); }

  function getProduct(bytes32 id) 
    constant 
    returns(bytes32 productName, uint256 price, uint256 stock) 
  { 
    require(catalog.contains(id));

    CatalogLib.Product memory product = catalog.get(id);
    productName = product.name;
    price = product.price;
    stock = product.stock;
  }

  function getProductFromIndex(uint256 index) 
    public
    constant 
    returns(bytes32 productId, bytes32 productName, uint256 price, uint256 stock) 
  { 
    require(index < catalog.size());

    CatalogLib.Product memory product = catalog.getFromIndex(index);
    productId = keccak256(product.name);
    productName = product.name;
    price = product.price;
    stock = product.stock;
  }

  function withdrawPayments() onlyAdmin returns(bool success) {
    admin.transfer(this.balance);
    return true;
  }

  function() payable {}

}
