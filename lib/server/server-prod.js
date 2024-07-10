import Fastify from 'fastify';
import pino from 'pino';

import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

import { addressToURL } from '../common/utils.js';
import Hierarchy from '../common/hierarchy.js';

import pluginCompress from './plugins/compression/compression.js';
import pluginErrors from './plugins/errors/errors.js';
import pluginRouter from './plugins/router/router.js';
import pluginStatic from '@fastify/static';
import pluginCors from '@fastify/cors';
import pluginSSR from './plugins/ssr/ssr.js';

export default class ServerProduction {
  #hierarchy;
  #server;
  #config;
  #logger;
  #start;

  constructor(config) {
    this.#start = Date.now();

    this.#config = config;

    this.#logger = pino({
      level: this.#config.logLevel,
      name: this.#config.logName,
    });

    this.#logger.info(`Hubro: ${this.#config.libVersion}`);
    this.#logger.trace(`Resolving Application root to: ${fileURLToPath(this.#config.cwd)}`);
    this.#logger.trace(`Resolving Source folder to: ${this.#config.dirSrc}`);
    this.#logger.trace(`Resolving Build folder to: ${this.#config.dirBuild}`);
    this.#logger.trace(`Resolving Components folder to: ${this.#config.dirComponents}`);
    this.#logger.trace(`Resolving Layouts folder to: ${this.#config.dirLayouts}`);
    this.#logger.trace(`Resolving Public folder to: ${this.#config.dirPublic}`);
    this.#logger.trace(`Resolving System folder to: ${this.#config.dirSystem}`);
    this.#logger.trace(`Resolving Pages folder to: ${this.#config.dirPages}`);

    this.#hierarchy = new Hierarchy({
      config: this.#config,
    });

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
  }

  async initialize() {
    // await this.#hierarchy.scan();
    await this.#hierarchy.setError();
    await this.#hierarchy.setDocument();
    await this.#hierarchy.setNotFound();

    await this.#server.register(pluginCompress, { config: this.#config });
    await this.#server.register(pluginErrors, { config: this.#config, hierarchy: this.#hierarchy });
    await this.#server.register(pluginRouter, { config: this.#config, hierarchy: this.#hierarchy });
    await this.#server.register(pluginCors, {});
    await this.#server.register(pluginSSR, { config: this.#config, hierarchy: this.#hierarchy });

    await this.#server.register(pluginStatic, {
      prefix: `${join(this.#config.urlPathBase, this.#config.urlPathPublic)}`,
      root: this.#config.dirBuild,
    });
  }

  async start() {
    try {
      await this.#server.listen({
        host: this.#config.serverHost,
        port: this.#config.serverPort,
        listenTextResolver: (address) => {
          return `Local: ${address}${this.#config.urlPathBase}`;
        },
      });

      const done = Date.now() - this.#start;
      this.#logger.info(`Ready in ${done}ms`);

      return addressToURL(this.#config, this.#server.addresses());
    } catch (err) {
      this.#logger.error(err);
      process.exit(1);
    }
  }

  async stop() {
    try {
      await this.#server.close();
    } catch (err) {
      this.#logger.error(err);
      process.exit(0);
    }
  }
}
