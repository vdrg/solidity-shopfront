import React from 'react';
import { Feed, List } from 'semantic-ui-react';
//import JSONViewer from 'react-json-viewer';
import Blockies from '../Blockies';

const Purchase = ({ purchase }) => {
  const { buyer, merchant, productName, transactionHash } = purchase;
  return (
    <Feed.Event>
      <Feed.Label>
        <Blockies style={styles.identicon} opts={{ seed: buyer }}/>
      </Feed.Label>

      <Feed.Content>
        <Feed.Summary>
          Product: {productName}
        </Feed.Summary>
        <Feed.Meta>
          merchant: <a>{merchant}</a> <br/>
          tx.hash: <a>{transactionHash}</a> <br/>
        </Feed.Meta>
      </Feed.Content>
    </Feed.Event>
  );
};

const styles = {
  identicon: {
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    borderRadius: '50%'
  }
}
export default Purchase;
