import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';

import esbuild from 'esbuild';
import etag from '@fastify/etag';
import fp from 'fastify-plugin';

import * as importMap from 'esbuild-plugin-import-map';

import { routePathToDynamicJs } from '../../../common/utils-assets.js';

const require = createRequire(import.meta.url);

const build = async ({ entryPoints = [] } = {}) => {
  const result = await esbuild.build({
    resolveExtensions: ['.js', '.ts'],
    legalComments: 'none',
    entryPoints,
    charset: 'utf8',
    target: 'esnext',
    bundle: true,
    format: 'esm',
    plugins: [importMap.plugin()],
    outdir: `${tmpdir()}/build-noop`,
    treeShaking: true,
    minify: true,
    write: false,
  });

  return result.outputFiles[0].text;
};

/**
 * @typedef {import('../../../common/config.js').default} Config
 * @typedef {import('../../../common/hierarchy.js').default} Hierarchy
 */

export default fp(
  /**
   * @param {import('fastify').FastifyInstance} fastify
   * @param {object} options
   * @param {Hierarchy} [options.hierarchy]
   * @param {Config} [options.config]
   */
  async (fastify, { config, hierarchy } = {}) => {
    fastify.register(etag, {
      algorithm: 'fnv1a',
    });

    const componentCache = new Map();
    const moduleCache = new Map();

    fastify.addHook('onListen', async () => {
      const { address, port } = fastify.server.address();
      const components = routePathToDynamicJs(config, '/components/');
      const layouts = routePathToDynamicJs(config, '/layouts/');
      const lit = routePathToDynamicJs(config, '/modules/lit');

      await importMap.load(`http://${address}:${port}`, {
        imports: {
          '#components/': components,
          '#layouts/': layouts,
          lit: lit,
        },
      });
    });

    fastify.get(routePathToDynamicJs(config, '/lit/hydration.js'), async (request, reply) => {
      const depname = '@lit-labs/ssr-client/lit-element-hydrate-support.js';

      if (!moduleCache.has(depname)) {
        const filepath = require.resolve(depname, { paths: [config.cwd] });

        const body = await build({
          entryPoints: [filepath],
        });

        moduleCache.set(depname, body);
      }

      reply.type('application/javascript');
      return moduleCache.get(depname);
    });

    fastify.get(routePathToDynamicJs(config, '/components/:component.js'), async (request, reply) => {
      const component = request.params['component'];

      // TODO: 404 if component is not provided to URL

      if (!componentCache.has(component)) {
        const entry = path.join(config.dirComponents, component);
        const body = await build({
          entryPoints: [entry],
        });

        componentCache.set(component, body);
      }

      reply.type('application/javascript');
      return componentCache.get(component);
    });

    fastify.get(routePathToDynamicJs(config, '/modules/*'), async (request, reply) => {
      const depname = request.params['*'];

      if (!moduleCache.has(depname)) {
        const filepath = require.resolve(depname, { paths: [config.cwd] });

        const body = await build({
          entryPoints: [filepath],
        });

        moduleCache.set(depname, body);
      }

      reply.type('application/javascript');
      return moduleCache.get(depname);
    });

    fastify.get(routePathToDynamicJs(config, '/layouts/*'), async (request, reply) => {
      const layout = request.params['*'];
      const entry = path.join(config.dirLayouts, layout);

      const body = await build({
        entryPoints: [entry],
      });

      reply.type('application/javascript');
      return body;
    });

    fastify.get(routePathToDynamicJs(config, '/pages/:hash.js'), async (request, reply) => {
      const hash = request.params['hash'];
      const pagePath = hierarchy.getEntryByHash(hash);

      const body = await build({
        entryPoints: [pagePath.source],
      });

      reply.type('application/javascript');
      return body;
    });
  },
  {
    fastify: '4',
    name: 'plugin-bundler',
  },
);
