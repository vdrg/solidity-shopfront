import React from 'react';

import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import App from './components/App';
import Home from './components/Home';
import Merchant from './components/Merchant';
import Purchases from './components/Purchases';

const Routes = () => (
  <Router>
    <App>
      <Route path='/' exact component={Home} />
      <Route path='/merchant' component={Merchant} />
      <Route path='/purchases' component={Purchases} />
    </App>
  </Router>
);

export default Routes;
