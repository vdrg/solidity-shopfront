import React, { Component } from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';
import { Map } from 'immutable';

import MerchantInfo from './MerchantInfo';
import RegisterForm from './RegisterForm';

import { ShopfrontContract, MerchantContract } from '../../eth/contracts';

const getMerchantInfo = async (merchantContract) => {
  const info = await Promise.all([
    merchantContract.name(),
    merchantContract.getCatalogSize()
  ]);

  const productPromises = [];
  for (let i = 0; i < info[1]; i++) {
    productPromises.push(merchantContract.getProductFromIndex(i));
  }

  const { web3 } = window;

  const productArray = await Promise.all(productPromises);

  const products = {};
  
  productArray.forEach(product => {
    products[product[0]] = {
      name: web3.toUtf8(product[1]),
      price: product[2], 
      stock: product[3] 
    };
  });

  return { 
    name: web3.toUtf8(info[0]),
    catalogSize: info[1],
    products: new Map(products),
  };
}

class Merchant extends Component {

  state = {
    accounts: [],
    products: new Map(),
    address: null,
    shopfront: null,
    events: null,
    registerName: '',
    loading: true,
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleRegister = async () => {
    const { web3 } = window;
    const { shopfrontContract, accounts, registerName } = this.state;

    await shopfrontContract.registerMerchant(registerName, { from: accounts[0], gas: 700000 })
    const address = await shopfrontContract.merchantAdmins(accounts[0]);
    const merchantContract = await MerchantContract(web3, address);
    const merchantEvents = merchantContract.allEvents({ fromBlock: await web3.eth.getBlockNumberPromise() });
    merchantEvents.watch(this.handleMerchantEvent);
    const merchantInfo = await getMerchantInfo(merchantContract);
    this.setState({ 
      ...merchantInfo,
      address,
      merchantEvents,
      merchantContract 
    })
  }

  handleWithdraw = async () => {
    const { web3 } = window;
    const { merchantContract, accounts } = this.state;
    const tx = await merchantContract.withdrawPayments({ from: accounts[0] });
    console.log(tx)
    this.setState({ weiAvailable: web3.toBigNumber(0)});
  }

  handleAddProduct = async (name, price, stock) => {
    const { merchantContract, accounts } = this.state;
    const tx = await merchantContract.addProduct(name, price, stock, { from: accounts[0], gas: 150000 })
    // console.log(tx);
  }

  handleDeleteProduct = async (id) => {
    const { merchantContract, accounts } = this.state;
    const tx = await merchantContract.deleteProduct(id, { from: accounts[0] });
    // console.log(tx)
  }

  handleMerchantEvent = (err, { event, args }) => {
    const { web3 } = window;
    const { products } = this.state;
    
    switch(event) {
      case 'LogProductAdded':
        const { productId, productName: name, price, stock } = args;
        const newProduct = {
          name: web3.toUtf8(name),
          price,
          stock,
        }
        this.setState({ products: products.set(productId, newProduct) })
        break;
      case 'LogProductDeleted':
        this.setState({ products: products.delete(args.productId) })
        break;
      default:
        console.log('Merchant event not handled')
    }
  }

  async componentDidMount() {
    const { web3 } = window;

    const accounts = await web3.eth.getAccountsPromise();

    const shopfrontContract = await ShopfrontContract(web3);
    let address = await shopfrontContract.merchantAdmins(accounts[0])
    address = address === '0x0000000000000000000000000000000000000000' ? null : address;
    let merchantContract = null;
    let merchantEvents = null;
    let merchantInfo = {};
    let weiAvailable = web3.toBigNumber(0);

    if (address) {
      merchantContract = await MerchantContract(web3, address);
      merchantEvents = merchantContract.allEvents({ fromBlock: await web3.eth.getBlockNumberPromise() });
      merchantEvents.watch(this.handleMerchantEvent);
      merchantInfo = await getMerchantInfo(merchantContract);
      weiAvailable = await web3.eth.getBalancePromise(address);
    }

    this.setState({ 
      shopfrontContract, 
      merchantContract, 
      address,
      merchantEvents,
      ...merchantInfo, 
      weiAvailable,
      accounts,
      loading: false,
    });
  }

  componentWillUnmount() {
    const { merchantEvents } = this.state;
    if (merchantEvents !== null) {
      merchantEvents.stopWatching();
    }
  }

  render() {
    const { 
      address, 
      name,
      products,
      registerName,
      weiAvailable,
      loading,
      message,
    } = this.state;

    return (
      <Dimmer.Dimmable style={styles.container} dimmed={loading}>
        <Dimmer active={loading}>
          <Loader indeterminate>Fetching Data</Loader>
        </Dimmer>
        <div style={styles.content}>
          {address && (
            <MerchantInfo 
              onAddProduct={this.handleAddProduct}
              onDeleteProduct={this.handleDeleteProduct}
              onWithdraw={this.handleWithdraw}
              address={address}
              name={name} 
              weiAvailable={weiAvailable}
              products={products}
            />
          )}
          {!address && (
            <RegisterForm 
              registerName={registerName} 
              onChange={this.handleChange} 
              onSubmit={this.handleRegister}
            />
          )}
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

export default Merchant;
