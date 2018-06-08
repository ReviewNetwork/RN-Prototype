export default {
  get config() {
    return fetch('http://poc-config.review.network/config.json')
      .then(r => r.json())
      // .then(r => console.log(r));
      .then(r => ({
        ...r,
        connection: { protocol: 'http', host: '178.62.24.94', port: '', root: '/rtgb', version: '/v0' },
        NODE_URL: 'ws://178.62.85.125:8546',
        PRIVATE_KEY: '0x05ae87771b3cc9e00d80b4ad514051c2693bc9738ef7c164650c226912fc852e',
      }))
      .catch(err => console.log(err, 'Failed to load config from http://poc-config.review.network/config.json'));
  },
};
