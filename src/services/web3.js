import Web3 from 'web3';
import provider from './web3-provider';

const PRIVATE_KEY = '0x05ae87771b3cc9e00d80b4ad514051c2693bc9738ef7c164650c226912fc852e';

const web3 = new Web3(provider);

export const userWallet = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
web3.eth.defaultAccount = userWallet.address;
web3.eth.coinbase = userWallet.address;

web3.eth.getBalance(userWallet.address)
  .then((b) => console.log(web3.utils.fromWei(b)));

export default web3;
