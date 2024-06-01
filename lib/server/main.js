import chokidar from 'chokidar';
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
import pluginSSR from './plugins/ssr/ssr.js';

const config = new Config();

const logger = pino({
    level: config.logLevel,
    name: config.name,
    transport: {
        target: 'pino-pretty',
        options: {
          colorize: true
        }
    }
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
    config
});
// await routes.scan();


// Listen for files changing in the 
// opinionated folder structure
const watcher = chokidar.watch([
    './pages/**/*.{ts,js}'
    /*
    './components/*',
    './layouts/*',
    './system/*',
    './public/*',
    './pages/*'
    */
], {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
});
/*
watcher.on('add', (path) => {
    console.log(`File ${path} has been added`);
});

watcher.on('change', (path) => { 
    console.log(`File ${path} has been changed`) ;
});

watcher.on('unlink', (path) => { 
    console.log(`File ${path} has been removed`) 
});
*/

const server = Fastify({
    ignoreDuplicateSlashes: true,
    ignoreTrailingSlash: true,
    disableRequestLogging: !config.logRequests,
    logger
});

// Decorate server with properties which will
// be set through the life cycle of a request
server.decorateRequest('metadata', null);

await server.register(pluginCompress, { config });
await server.register(pluginBundler, { config });
await server.register(pluginErrors, { logger });
await server.register(pluginRouter, { config, hierarchy: routes });
await server.register(pluginSSR, { config });

server.register(pluginStatic, {
    root: config.dirPublic,
    prefix: `${join(config.urlBasePath, '/public/')}`,
});

try {
    await server.listen({
        host: config.serverHost, 
        port: config.serverPort,
        listenTextResolver: (address) => {
            return `Local: ${address}${config.urlBasePath}`;
        } 
    });
} catch (err) {
    logger.error(err);
    process.exit(1);
}
