import Fastify from 'fastify';
import pino from 'pino';

import { join } from 'node:path';

import HierarchyRoutes from '../common/hierarchy-routes.js';
import Config from '../common/config.js';

import pluginCompress from './plugins/compression/compression.js';
import pluginErrors from './plugins/errors/errors.js';
import pluginRouter from './plugins/router/router.js';
import pluginStatic from '@fastify/static';
import pluginCors from '@fastify/cors';
import pluginSSR from './plugins/ssr/ssr.js';

export default class ServerProduction {
  #server;
  #config;
  #logger;
  #start;

  constructor() {
    this.#start = Date.now();

    this.#config = new Config();
    this.#config.load();

    this.#logger = pino({
      level: this.#config.logLevel,
      name: this.#config.name,
    });

    this.#logger.info(`Kvikk: ${this.#config.libVersion}`);
    this.#logger.trace(`Resolving Application root to: ${this.#config.cwd}`);
    this.#logger.trace(`Resolving Source folder to: ${this.#config.dirSrc}`);
    this.#logger.trace(`Resolving Build folder to: ${this.#config.dirBuild}`);
    this.#logger.trace(`Resolving Components folder to: ${this.#config.dirComponents}`);
    this.#logger.trace(`Resolving Layouts folder to: ${this.#config.dirLayouts}`);
    this.#logger.trace(`Resolving Public folder to: ${this.#config.dirPublic}`);
    this.#logger.trace(`Resolving System folder to: ${this.#config.dirSystem}`);
    this.#logger.trace(`Resolving Pages folder to: ${this.#config.dirPages}`);

    const routes = new HierarchyRoutes({
      config: this.#config,
    });
    // await routes.scan();

    this.#server = Fastify({
      ignoreDuplicateSlashes: true,
      ignoreTrailingSlash: true,
      disableRequestLogging: !this.#config.logRequests,
      logger: this.#logger,
    });

    // Decorate server with properties which will
    // be set through the life cycle of a request
    this.#server.decorateRequest('document', null);
    this.#server.decorateRequest('header', null);

    this.#server.register(pluginCompress, { config: this.#config });
    this.#server.register(pluginErrors, { logger: this.#logger });
    this.#server.register(pluginRouter, { config: this.#config, hierarchy: routes });
    this.#server.register(pluginCors, {});
    this.#server.register(pluginSSR, { config: this.#config });

    this.#server.register(pluginStatic, {
      prefix: `${join(this.#config.urlBasePath, '/public/')}`,
      root: this.#config.dirBuild,
    });
  }

  async start() {
    try {
      await this.#server.listen({
        host: this.#config.serverHost,
        port: this.#config.serverPort,
        listenTextResolver: (address) => {
          return `Local: ${address}${this.#config.urlBasePath}`;
        },
      });
      const done = Date.now() - this.#start;
      this.#logger.info(`Ready in ${done}ms`);
    } catch (err) {
      this.#logger.error(err);
      process.exit(1);
    }
  }

  async stop() {}
}