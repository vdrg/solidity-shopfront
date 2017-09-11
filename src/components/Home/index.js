import React, { Component } from 'react';
import { Dimmer, Loader, Message } from 'semantic-ui-react';
import { Map } from 'immutable';

import { ShopfrontContract, MerchantContract } from '../../eth/contracts';

import Products from '../Products';

class Home extends Component {

  state = {
    products: new Map(),
    loading: true,
    message: null,
  }

  handleBuyProduct = async (merchantAddress, productId, price) => {
    const { shopfrontContract, accounts } = this.state;
    const success = await shopfrontContract.buyProduct.call(merchantAddress, productId, { from: accounts[0], value: price });
    if (success) {
      const tx = await shopfrontContract.buyProduct(merchantAddress, productId, { from: accounts[0], value: price });
      // console.log(tx);
    }
  }

  handleProductBoughtEvent = (err, event) => {
    if (err) {
      console.error(err);
    } else {
      const { products } = this.state;
      const { args, transactionHash } = event;
      const { merchant, productId, stock } = args;
      this.setState({ 
        products: products.updateIn([merchant, productId], product => ({ ...product, stock })),
        message: { header: 'Product bought successfully!', positive: true, content: `tx.hash: ${transactionHash}`}
      });
    }
  }

  async componentDidMount() {
    const { web3 } = window;

    const shopfrontContract = await ShopfrontContract(web3);
    const merchants = await shopfrontContract.getMerchants();
    const merchantContracts = await Promise.all(
      merchants.map(merchant => MerchantContract(web3, merchant))
    );

    // Gets all products from a given merchant contract
    const getProducts = async (merchantContract) => {
      const catalogSize = await merchantContract.getCatalogSize();
      const products = {};
      for (let i = 0; i < catalogSize.toNumber(); i++) {
        const product = await merchantContract.getProductFromIndex(i);
        products[product[0]] = { 
          name: web3.toUtf8(product[1]),
          price: product[2],
          stock: product[3]
        };
      }
      return [ merchantContract.contract.address, new Map(products) ];
    }

    const merchantProducts = await Promise.all(merchantContracts.map(contract => getProducts(contract)));

    const products = new Map(merchantProducts);

    const productBoughtEvent = shopfrontContract.LogProductBought({}, { fromBlock: web3.eth.blockNumber });
    productBoughtEvent.watch(this.handleProductBoughtEvent);

    this.setState({ 
      accounts: web3.eth.accounts,
      shopfrontContract,
      loading: false,
      products
    });
  }

  componentWillUnmount() {
    const { productBoughtEvent } = this.state;
    if (productBoughtEvent) {
      productBoughtEvent.stopWatching();
    }
  }

  render() {
    const { products, loading, message } = this.state;

    return (
      <Dimmer.Dimmable style={styles.container} dimmed={loading}>
        <Dimmer active={loading}>
          <Loader indeterminate>Fetching Data</Loader>
        </Dimmer>
        <div style={styles.content}>
          <Message 
            floating
            hidden={message === null}
            onDismiss={() => this.setState({ message: null })} 
            {...message} 
          />
          <Products products={products} onBuy={this.handleBuyProduct}/>
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

export default Home;
