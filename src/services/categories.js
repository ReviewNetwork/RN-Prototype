import ipfs from './ipfs';
import Config from '../config';

const loadCategories = async () => {
  const config = await Config.config;
  return ipfs.get(config.categoriesHash);
};

export default {
  loadCategories,
};
