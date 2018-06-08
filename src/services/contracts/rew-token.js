import Contract from './contract';
import Config from '../../config';

class REWToken extends Contract {
  ready() {
    return Config.config.then(config => {
      this.contractAddress = config.REW_ADDRESS;
      this.contractAbiHash = config.rewTokenAbi;
    });
  }
}

export default new REWToken();
