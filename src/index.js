import React from 'react';
import ReactDOM from 'react-dom';

import 'semantic-ui-css/semantic.min.css';

import { initWeb3 } from './eth/web3';
import Routes from './routes';
import registerServiceWorker from './registerServiceWorker';

initWeb3().then(() => {
  ReactDOM.render(<Routes />, document.getElementById('root'));
  registerServiceWorker();
});
