import REWToken from './contracts/rew-token';
import web3 from './web3';
import Config from '../config';

class WalletApi {
  constructor() {
    this.initPrivateKey();
  }

  async getMyBalance() {
    const rew = await REWToken.contract;
    return rew.methods.balanceOf(web3.eth.defaultAccount).call()
      .then(balance => Number(balance));
  }

  getMyAddress() {
    return web3.eth.defaultAccount;
  }

  async initPrivateKey() {
    const config = await Config.config;
    this.privateKey = config.PRIVATE_KEY;
  }

  setPrivateKey(key) {
    this.privateKey = key;
  }

  getMyPrivateKey() {
    return this.privateKey;
  }
}

export default new WalletApi();
