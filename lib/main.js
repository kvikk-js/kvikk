import ServerDev from './server/server-dev.js';
import Config from '../lib/common/config.js';

export default async ({ development = true } = {}) => {
  const config = new Config({
    development,
  });
  await config.load();

  return new ServerDev(config);
};
