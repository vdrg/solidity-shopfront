import React from 'react';
import { Feed } from 'semantic-ui-react';
import Purchase from './Purchase';

const PurchaseLog = ({ purchases }) =>       
  <Feed>
    {purchases.map((purchase, i) => <Purchase key={i} purchase={purchase}/>)}
  </Feed>

export default PurchaseLog;
