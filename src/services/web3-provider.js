import Web3 from 'web3';

const NODE_URL = 'ws://178.62.85.125:8546';

Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
Web3.providers.WebsocketProvider.prototype.sendAsync = Web3.providers.WebsocketProvider.prototype.send;

export default new Web3.providers.WebsocketProvider(NODE_URL);
