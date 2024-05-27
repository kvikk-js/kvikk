import { join } from 'node:path';

import Fastify from 'fastify';
import pino from 'pino';

import pluginCompress from './plugins/compression/compression.js';
import pluginBundler from './plugins/bundler/bundler.js';
import pluginErrors from './plugins/errors/errors.js';
import pluginRouter from './plugins/router/router.js';
import pluginStatic from '@fastify/static';
import pluginSSR from './plugins/ssr/ssr.js';

import config from  './config.js';

const logger = pino({
    level: config?.logging?.level,
    name: config?.logging?.name,
});

const app = Fastify({
    ignoreDuplicateSlashes: true,
    ignoreTrailingSlash: true,
    disableRequestLogging: !config?.logging?.requests,
    logger
});

await app.register(pluginCompress, { logger: logger.child({ module: 'compression' }), enabled: config?.compression });
await app.register(pluginBundler, { logger });
await app.register(pluginErrors, { logger });
await app.register(pluginRouter, { logger });
await app.register(pluginSSR, { logger, development: true });

app.register(pluginStatic, {
    root: new URL('../public', import.meta.url),
    prefix: `${join(config?.basePath, '/public/')}`,
});

try {
    await app.listen({ port: 4000 });
} catch (err) {
    logger.error(err);
    process.exit(1);
}
