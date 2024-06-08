import Fastify from 'fastify';
import pino from 'pino';

import { join } from 'node:path';

import HierarchyRoutes from '../common/hierarchy-routes.js';
import Config from '../common/config.js';

import pluginCompress from './plugins/compression/compression.js';
import pluginBundler from './plugins/bundler/bundler.js';
import pluginErrors from './plugins/errors/errors.js';
import pluginRouter from './plugins/router/router.js';
import pluginStatic from '@fastify/static';
import pluginCors from '@fastify/cors';
import pluginSSR from './plugins/ssr/ssr.js';

const start = Date.now();

const config = new Config();

const logger = pino({
  level: config.logLevel,
  name: config.name,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

logger.info(`Kvikk: ${config.libVersion}`);
logger.trace(`Resolving Application root to: ${config.cwd}`);
logger.trace(`Resolving Source folder to: ${config.dirSrc}`);
logger.trace(`Resolving Build folder to: ${config.dirBuild}`);
logger.trace(`Resolving Components folder to: ${config.dirComponents}`);
logger.trace(`Resolving Layouts folder to: ${config.dirLayouts}`);
logger.trace(`Resolving Public folder to: ${config.dirPublic}`);
logger.trace(`Resolving System folder to: ${config.dirSystem}`);
logger.trace(`Resolving Pages folder to: ${config.dirPages}`);

const routes = new HierarchyRoutes({
  config,
});
// await routes.scan();
config.dirBuild;
const server = Fastify({
  ignoreDuplicateSlashes: true,
  ignoreTrailingSlash: true,
  disableRequestLogging: !config.logRequests,
  logger,
});

// Decorate server with properties which will
// be set through the life cycle of a request
server.decorateRequest('document', null);
server.decorateRequest('header', null);

await server.register(pluginCompress, { config });
await server.register(pluginBundler, { config, hierarchy: routes });
await server.register(pluginErrors, { logger });
await server.register(pluginRouter, { config, hierarchy: routes });
await server.register(pluginCors, {});
await server.register(pluginSSR, { config });

const root = config.development ? config.dirPublic : config.dirBuild;
server.register(pluginStatic, {
  prefix: `${join(config.urlBasePath, '/public/')}`,
  root,
});

try {
  await server.listen({
    host: config.serverHost,
    port: config.serverPort,
    listenTextResolver: (address) => {
      return `Local: ${address}${config.urlBasePath}`;
    },
  });
  const done = Date.now() - start;
  logger.info(`Ready in ${done}ms`);
} catch (err) {
  logger.error(err);
  process.exit(1);
}
