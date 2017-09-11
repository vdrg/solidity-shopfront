import React, { Component } from 'react';
import { Input, Segment } from 'semantic-ui-react';
import _ from 'lodash';

import ProductList from './ProductList';

class Products extends Component {
  state = {
    filteredProducts: [],
    loading: false,
    search: ''
  }

  handleSearchChange = (e, { value }) => {

    const { products } = this.props;

    if (value.length < 1){
      return this.setState({ search: '' });
    }

    const re = new RegExp(_.escapeRegExp(value), 'i');
    const isMatch = result => re.test(result.name);

    this.setState({
      filteredProducts: products.filter(isMatch),
      search: value
    });
  }

  //handleResultSelect = (e, { result }) => this.setState({ value: result.title })
  componentWillReceiveProps(nextProps) {
    if (nextProps.products.length !== this.props.products.length) {
      this.handleSearchChange(null, { value: this.state.search });
    }
  }

  render() {
    const { products, onBuy, onDelete, children } = this.props;
    const { filteredProducts, search } = this.state;

    const visibleProducts = search.length < 1 ? products : filteredProducts;

    return (
      <div>
        <Input icon='search' onChange={this.handleSearchChange} />
        {children}
        <Segment>
          <ProductList products={visibleProducts} onBuy={onBuy} onDelete={onDelete} />
        </Segment>
      </div>
    )
  }
}

export default Products;
