import React, { Component } from 'react';
import { Button, Form, Header, Image, Modal } from 'semantic-ui-react';
import { Map } from 'immutable';

import Products from '../Products';
import Blockies from '../Blockies';

class MerchantInfo extends Component {

  state = {
    modalOpen: false,
    productName: '',
    productPrice: '0',
    productStock: '0',
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = () => {
    const { onAddProduct } = this.props;
    const { productName, productPrice, productStock } = this.state;

    onAddProduct(productName, productPrice, productStock);
    this.handleClose();
  }

  handleOpen = () => this.setState({ modalOpen: true });
  handleClose = () => this.setState({ modalOpen: false });

  render() {
    const { address, name, products, weiAvailable, onDeleteProduct, onWithdraw } = this.props;
    const { productName, productPrice, productStock, modalOpen} = this.state;

    const blockiesOpts = {
      seed: address,
    }

    const merchantProducts = new Map({ [address]: products });

    return (
      <div>
        <Modal
          open={modalOpen}
          onClose={this.handleClose}
        >
          <Form style={styles.form} onSubmit={this.handleSubmit}>
            <Form.Input name='productName' label='Name' value={productName} onChange={this.handleChange} />
            <Form.Input name='productPrice' label='Price' type='number' value={productPrice} onChange={this.handleChange} />
            <Form.Input name='productStock' label='Stock' type='number' value={productStock} onChange={this.handleChange} />
            <Form.Button>Create</Form.Button>
          </Form>
        </Modal>
        <Header as='h2'>
          <Image>
            <Blockies style={styles.identicon} opts={blockiesOpts}/>
          </Image>
          {name}
          <Button 
            style={styles.actionButton}
            primary
            disabled={!weiAvailable.gt(0)}
            onClick={onWithdraw}
          >
            Withdraw {weiAvailable.toString(10)} wei
          </Button>
        </Header>
        <Products products={merchantProducts} onDelete={onDeleteProduct}>
          <Button style={styles.actionButton} primary onClick={this.handleOpen}>Add Product</Button>
        </Products>
      </div>
    )
  }
}

const styles = {
  actionButton: {
    marginLeft: 20,
  },
  identicon: {
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    borderRadius: '50%'
  },
  form: {
    padding: 20
  }

}
export default MerchantInfo;
