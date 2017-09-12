import React, { Component } from 'react';
import { Header, Checkbox, Dimmer, Loader } from 'semantic-ui-react';
import { List } from 'immutable';

import { ShopfrontContract } from '../../eth/contracts';

import PurchaseLog from './PurchaseLog';

class Purchases extends Component {

  state = {
    purchases: new List(),
    onlyPersonal: true,
    loading: true,
  }

  async componentDidMount() {
    const { web3 } = window;

    const shopfrontContract = await ShopfrontContract(web3);
    const purchaseEvent = shopfrontContract.LogProductBought({}, { 
      fromBlock: await web3.eth.getBlockNumberPromise() - 100
    })

    purchaseEvent.watch(async (err, event) => {
      const { purchases } = this.state;

      if (err) {
        console.error(err);
      } else {
        const { args, transactionHash } = event;
        const { buyer, merchant, productName } = args

        const purchase = {
          buyer,
          merchant,
          productName: web3.toUtf8(productName),
          transactionHash
        };

        this.setState({ purchases: purchases.push(purchase) });
      }
    })

    this.setState({ loading: false, purchaseEvent, accounts: await web3.eth.getAccountsPromise() });
  }

  componentWillUnmount() {
    const { purchaseEvent } = this.state;
    if (purchaseEvent) {
      purchaseEvent.stopWatching();
    }
  }

  render() {
    const { purchases, loading, onlyPersonal, accounts } = this.state;

    const visiblePurchases = onlyPersonal ? purchases.filter(({ buyer }) => buyer === accounts[0]) : purchases;

    return (
      <Dimmer.Dimmable style={styles.container} dimmed={loading}>
        <Dimmer active={loading}>
          <Loader indeterminate>Fetching Data</Loader>
        </Dimmer>
        <div style={styles.content}>
          <Header>Most Recent Purchases (100 blocks)</Header>
          <Checkbox label='Only show my purchases' onChange={() => this.setState({ onlyPersonal: !onlyPersonal })} checked={onlyPersonal} />
          <PurchaseLog purchases={visiblePurchases} />
        </div>
      </Dimmer.Dimmable>
    );
  }
}

const styles = {
  container: {
    height: '100%',
  },
  sidebar: {
    height: '100%',
  },
  content: {
    padding: 20,
  },
  sidebarButton: {
    background: 'none',
  }

}

export default Purchases;
