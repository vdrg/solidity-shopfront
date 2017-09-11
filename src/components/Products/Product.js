import React from 'react';
import { Button, Card } from 'semantic-ui-react';

const Product = ({ merchantAddress, id, name, price, stock, onBuy, onDelete }) => (
  <Card>
    <Card.Content>
      <Card.Header>{name} - ${price.toString(10)}</Card.Header>
      Stock: {stock.toString(10)}
      {onBuy && <Button disabled={stock <= 0} floated='right' color='blue' onClick={() => onBuy(merchantAddress, id, price)}>Buy</Button>}
      {onDelete && <Button floated='right' color='red' onClick={() => onDelete(id)}>Delete</Button>}
    </Card.Content>
  </Card>
)

export default Product;
