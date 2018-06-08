import web3 from '../web3';
import wallet from '../wallet';
import ipfs from '../ipfs';

export default class Contract {
  async sendSigned(query) {
    return web3.eth.net.getId()
      .then(async networkId => {
        const encodedABI = query.encodeABI();
        const tx = {
          from: wallet.getMyAddress(),
          to: this.contractAddress,
          gas: 2000000,
          data: encodedABI,
          chainId: networkId,
        };

        const key = await wallet.getMyPrivateKey();

        return web3.eth.accounts.signTransaction(tx, key)
          .then(signed => new Promise((resolve, reject) => {
            web3.eth.sendSignedTransaction(signed.rawTransaction)
              .once('confirmation', (confirmationNumber, receipt) => {
                if (receipt.status === '0x0') {
                  reject(receipt);
                } else {
                  resolve();
                }
              })
              .once('error', error => {
                reject(error);
              });
          }));
      });
  }

  get contract() {
    return this
      .ready()
      .then(() => {
        if (this.contractInstance) {
          return this.contractInstance;
        }

        return ipfs
          .get(this.contractAbiHash)
          .then(abi => new web3.eth.Contract(abi, this.contractAddress, {
            from: wallet.getMyAddress(),
          }))
          .then(instance => {
            this.contractInstance = instance;
            return this.contractInstance;
          })
          .catch(e => console.log(e));
      });
  }
}
