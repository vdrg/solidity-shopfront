import React from 'react';
import { Card } from 'semantic-ui-react';

import Product from './Product';

const ProductList = ({ products, onBuy, onDelete }) => {
  const allProducts = products.entrySeq().flatMap(merchantProducts => {
    const merchantAddress = merchantProducts[0];
    const productsById = merchantProducts[1];

    return productsById.entrySeq().map(idProduct => (
      <Product 
        key={merchantAddress + idProduct[0]}
        onBuy={onBuy}
        onDelete={onDelete}
        merchantAddress={merchantAddress}
        id={idProduct[0]}
        {...idProduct[1]}
      />
    ));
  });

  return (
    <Card.Group >
      {allProducts}
    </Card.Group>
  );
}

export default ProductList;
