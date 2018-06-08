
import Config from '../config';

class Ipfs {
  constructor() {
    Config.config.then(config => {
      this.api = config.connection;
    });

    this.api = { protocol: 'http', host: '178.62.24.94', port: '', root: '/rtgb', version: '/v0' };
  }

  store(json) {
    return this.request({
      method: 'POST',
      url: '/add',
      payload: json,
    });
  }

  get(hash) {
    return this.requestFile({ url: `/${hash}` });
  }

  setProvider(opts) {
    if (typeof opts === 'object' && !opts.host) {
      return;
    }
    this.api = opts;
  }

  getApiUrl(path) {
    const { protocol, host, port, root = '', version = '' } = this.api;
    return `${protocol}://${host}${port ? `:${port}` : ''}${root}${version}${path}`;
  }

  getFileUrl(path) {
    const { protocol, host, port, root = '' } = this.api;
    return `${protocol}://${host}${port ? `:${port}` : ''}${root}${path}`;
  }

  request({ method = 'POST', url, payload }) {
    const fullUrl = this.getApiUrl(url);
    return fetch(fullUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method,
      body: JSON.stringify(payload),
    })
      .then(response => response.headers.map['ipfs-hash'][0]);
  }

  requestFile({ url, payload }) {
    const fullUrl = this.getFileUrl(url);
    return fetch(fullUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
      body: JSON.stringify(payload),
    })
      .then(response => response.blob())
      .then(response => new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(JSON.parse(reader.result || 'null'));
        };
        reader.readAsText(response);
      }))
      .catch(e => console.log('ipfs error', url, e));
  }
}

export default new Ipfs();
