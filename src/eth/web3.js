import Web3 from 'web3';

// Taken from https://gist.github.com/xavierlepretre/90f0feafccc07b267e44a87050b95caa
const promisify = web3 => {
  // Pipes values from a Web3 callback.
  const callbackToResolve = (resolve, reject) => {
    return (error, value) => {
      if (error) {
        reject(error);
      } else {
        resolve(value);
      }
    };
  };

  // List synchronous functions masquerading as values.
  const syncGetters = {
    db: [],
    eth: [ "accounts", "blockNumber", "coinbase", "gasPrice", "hashrate",
      "mining", "protocolVersion", "syncing" ],
    net: [ "listening", "peerCount" ],
    personal: [ "listAccounts" ],
    shh: [],
    version: [ "ethereum", "network", "node", "whisper" ]
  };

  Object.keys(syncGetters).forEach(group => {
    Object.keys(web3[group]).forEach(method => {
      if (syncGetters[group].indexOf(method) > -1) {
        // Skip
      } else if (typeof web3[group][method] === "function") {
        web3[group][method + "Promise"] = () => {
          const args = arguments;
          return new Promise((resolve, reject) => {
            args[args.length] = callbackToResolve(resolve, reject);
            args.length++;
            web3[group][method].apply(web3[group], args);
          });
        };
      }
    });
  });

  return web3;
}

const detectWeb3Provider = () => {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof window.web3 !== 'undefined') {
    // Use Mist/MetaMask's provider.
    window.web3 = promisify(new Web3(window.web3.currentProvider));
    console.log('Injected web3 detected.');
  } else {
    // Fallback to localhost if no web3 injection.
    const provider = new Web3.providers.HttpProvider('http://localhost:8545');
    window.web3 = promisify(new Web3(provider));
    console.log('No web3 instance injected, using Local web3.');
  }
}

export function initWeb3() {
  return new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', () => {
      detectWeb3Provider();
      resolve();
    });
  });
}
