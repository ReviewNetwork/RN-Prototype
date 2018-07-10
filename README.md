# Review Network Mobile

##### Mobile app for Review Network project, built with React Native for both Android and IOS.

## Requirements:

* Node, NPM, YARN
* watchman
* react-native-cli
* Xcode


### Note

If the Metro Bundler says something like "Can't require module undefined", just go to `node_modules/web3-eth-accounts/`, run `npm i` and re-run React Native. For some reason `web3-eth-accounts` didn't install all the node modules that were in its package.json.

Here's a guide to setting up web3 with React Native - https://gist.github.com/dougbacelar/29e60920d8fa1982535247563eb63766

### Note Adding JSON to IPFS

- Get JSON from json object here: http://rantz.net/tools/stringify/index.php
- SSH to VPS and create a json file in ~/review-network (`ssh -i ~/.ssh/digital-ocean root@178.62.24.94`)
- `vim your-new.json` , paste and save
- `cat categories.json | ipfs add`
- Take the hash and put it in `config/ipfs.js`


## Deploying to Ropsten
- truffle migrate --network ropsten --reset
- truffle console --network ropsten

```js
let rew, rn
REWToken.at('').then(x => rew = x)
ReviewNetwork.at('').then(x => rn = x)

rew.approve('', 100000000) // Address of Review Network contract

rn.createSurvey('', '', 7) // title, ipfs hash
rn.fundSurvey('', 1000000) // ipfs hash
rn.startSurvey('') // ipfs hash
```
## Ethereum

- http://178.62.24.94/rtgb/<HASH> - IPFS server

- 0x44f25e3fd291a67fe0ff97bec28311bff2dc991e - REW contract
- 0x2d4983a76560bcc459ef002ae0860a8a275557b8 - Review Network contract
- 0x4a58651912a80F0870D7a236B9fe11ECdb0Daa32 - Address of survey creator (and REW contract creator), (also in truffle)
- 0xfBdc510dAfA85303180392e9D1D01eBA93C21fD8 - Address of mobile user

- Run geth: `immortal -l /tmp/geth.log /bin/sh -c "geth --testnet --ws --wsaddr 0.0.0.0 --wsport 8546 --wsorigins * --cache 512 --rpc --wsapi "eth,net,web3,network,debug,txpool" --rpcapi "eth,net,web3,network,debug,txpool" --rpcaddr 0.0.0.0 --rpcport 8545 --fast"`

- Run ipfs: `immortal -l /tmp/ipfs.log /bin/sh -c "ipfs daemon"`

## IPFS

- QmdGR3wyZbm2j5s6nqx9Dg4iAZ1ScZXXBRLf178poQC3yr - IPFS hash of REWToken abi
- QmNtUapgwpqG4SFuiHbe6tyTxDtridHttxPWY59txS4Dea - IPFS hash of ReviewNetwork abi
- QmV2nxnEEnjGvLqu5Yf8XwFuPAhFY6jrJJG1xV5tAjF1FK - Coding survey
- QmP7bVNCQo5EEXcsZXSpwvrJ9z7hPR3sGepJfJ2TTuHLyE - Pizza survey

- QmVaGsttnBVNtShmYNjNjVsAenHmssJkCLiGZgo7XinZMc - Hair products survey
- Qmd6vFoW7ymjmWzc6bTRL98BR6E8PJNSjckCykQmTDQhwi - Watch survey
- QmSwCArtToeCSS4Z1v7z8EPp9LRz573XRL3XZkL2htcBBn - Chocolate survey
- QmRRFN6pns2zUenMmPAmpYS6aFG2uyKBV6CSaiaAkf51Hu - Lambo survey

Structure:

```js
const survey = {
  description: 'In this survey, you will tell us about your crazy programming habits.',
  questions: [{
    text: 'I love coding until the sun comes up',
    type: 'range',
    from: 1,
    to: 5
  }, {
    text: 'I drink coffee when I code',
    type: 'yesno'
  }, {
    text: 'During the week I code on average:',
    type: 'choice',
    choices: ['0-1 hour', '1-3 hours', '3-10 hours', '10+ hours']
  }]
}

const survey2 = {
  description: 'You have recently purchased a PizzaPro 3000 in our online shop. Thank you for that! Please take a few moments to complete this satisfaction survey.',
  questions: [{
    text: 'How often do you use the PizzaPro 3000?',
    type: 'choice',
    choices: ['Daily', 'Weekly', 'Monthly', 'Yearly']
  }, {
    text: 'How would you rate Build Quality?',
    type: 'range',
    from: 1,
    to: 5
  }, {
    text: 'How would you rate Baking Time?',
    type: 'range',
    from: 1,
    to: 5
  }, {
    text: 'How would you rate Usability?',
    type: 'range',
    from: 1,
    to: 5
  }, {
    text: 'Overall, how satisfied are you with the PizzaPro 3000?',
    type: 'choice',
    choices: ['Very unsatisfied', 'Unsatisfied', 'Somewhat satisfied', 'Very satisfied', 'Extremely satisfied']
  }, {
    text: 'What do you mostly make with the PizzaPro 3000?',
    type: 'choice',
    choices: ['Pizza', 'Nachos', 'Giant Cookies', 'Quiche', 'Other']
  }]
}
```
