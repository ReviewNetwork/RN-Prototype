import Contract from './contract';
import Config from '../../config';

class ReviewNetwork extends Contract {
  ready() {
    return Config.config.then(config => {
      this.contractAddress = config.REVIEW_NETWORK_ADDRESS;
      this.contractAbiHash = config.reviewNetworkAbi;
    });
  }
}

export default new ReviewNetwork();
