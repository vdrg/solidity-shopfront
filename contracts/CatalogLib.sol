pragma solidity ^0.4.15;

/* Adapted from https://github.com/szerintedmi/solidity-itMapsLib/blob/master/itMapsLib.sol */

library CatalogLib {

  struct Product {
    bytes32 name;
    uint256 price;
    uint256 stock;
  }

  struct Entry {
    uint256 keyIndex;
    Product product;
  }

  struct Catalog {
    bytes32[] productIds;
    mapping(bytes32 => Entry) entries;
  }

  function addProduct(Catalog storage self, bytes32 id, bytes32 name, uint256 price, uint256 stock) 
    internal 
    returns(bool success) 
  {

    Entry storage entry = self.entries[id];

    require(entry.keyIndex == 0);

    entry.product = Product(name, price, stock);

    entry.keyIndex = ++self.productIds.length;
    self.productIds[entry.keyIndex - 1] = id;
    return true;
  }

  function deleteProduct(Catalog storage self, bytes32 productId) internal returns (bool success) {
    Entry storage entry = self.entries[productId];
    require(entry.keyIndex > 0 && entry.keyIndex <= self.productIds.length);

    // Move an existing element into the vacated key slot.
    self.entries[self.productIds[self.productIds.length - 1]].keyIndex = entry.keyIndex;
    self.productIds[entry.keyIndex - 1] = self.productIds[self.productIds.length - 1];
    self.productIds.length -= 1;
    delete self.entries[productId];
    return true;
  }

  function setPrice(Catalog storage self, bytes32 productId, uint256 price) internal returns (bool success) {
    Entry storage entry = self.entries[productId];
    require(entry.keyIndex > 0 && entry.keyIndex <= self.productIds.length);
    entry.product.price = price;
    return true;
  }

  function setStock(Catalog storage self, bytes32 productId, uint256 stock) internal returns (bool success) {
    Entry storage entry = self.entries[productId];
    require(entry.keyIndex > 0 && entry.keyIndex <= self.productIds.length);
    //entry.product = Product(entry.product.name, entry.product.price, stock);
    entry.product.stock = stock;
    return true;
  }

  function get(Catalog storage self, bytes32 productId) internal constant returns(Product) {
    return self.entries[productId].product;
  }

  function getFromIndex(Catalog storage self, uint256 index) internal constant returns(Product) {
    return self.entries[self.productIds[index]].product;
  }

  function contains(Catalog storage self, bytes32 productId) internal constant returns(bool) {
    return self.entries[productId].keyIndex > 0;
  }

  function size(Catalog storage self) internal constant returns(uint256) {
    return self.productIds.length;
  }
}
