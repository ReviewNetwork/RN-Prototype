import REWToken from './contracts/rew-token';
import web3 from './web3';

class WalletApi {

  async getMyBalance() {
    const rew = await REWToken.contract;
    return rew.methods.balanceOf(web3.eth.defaultAccount).call()
      .then(balance => Number(balance));
  }

  getMyAddress() {
    return web3.eth.defaultAccount;
  }

  setPrivateKey(key) {
    this.privateKey = key;
  }

  getMyPrivateKey() {
    return this.privateKey;
  }
}

export default new WalletApi();
