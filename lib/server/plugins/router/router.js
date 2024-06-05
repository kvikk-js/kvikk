import formbody from '@fastify/formbody';
import httpError from 'http-errors';
import { join } from 'node:path';
import fp from 'fastify-plugin';

import Header from '../../../classes/header.js';

/**
 * @typedef {import('../../../common/config.js').default} Config
 * @typedef {import('../../../common/hierarchy-routes.js').default} HierarchyRoutes
 */

export default fp(
  /**
   * @param {import('fastify').FastifyInstance} fastify
   * @param {object} options
   * @param {HierarchyRoutes} [options.hierarchy]
   * @param {Config} [options.config]
   */
  async (fastify, { config, hierarchy } = {}) => {
    // TODO: Go in main?????
    fastify.register(formbody);

    // TODO: Set default header here????
    fastify.addHook('preHandler', async (request) => {
      request.header = new Header();
    });

    const routes = hierarchy;

    for await (const entry of routes.scan()) {
      // Set "page" route
      if (entry.type === 'page') {
        try {
          const { default: page } = await import(`${entry.source}?cache=${Date.now()}`);

          fastify.get(
            entry.route,
            {
              config: {
                entry,
              },
            },
            async (request, reply) => {
              // TODO: Build proper script tags
              const scriptHydrationUrl = join(
                config.urlBasePath,
                '/_/dynamic/modules/@lit-labs/ssr-client/lit-element-hydrate-support.js',
              );
              request.header.setScript(scriptHydrationUrl);

              const scriptPageFile = `${request.routeOptions.config.entry.hash}.js`;
              const scriptPageUrl = join(config.urlBasePath, `/_/dynamic/pages/${scriptPageFile}`);
              request.header.setScript(scriptPageUrl);

              reply.type('text/html; charset=utf-8');
              return reply.ssr(page);
            },
          );
        } catch (error) {
          throw httpError.createError(500, error);
        }
      }

      // Set "action" route
      if (entry.type === 'action') {
        try {
          const { default: action } = await import(`${entry.source}?cache=${Date.now()}`);

          fastify.post(entry.route, async (request, reply) => {
            const searchParams = request.query;
            const uriParams = request.params;
            const body = request.body;

            reply.type('text/html; charset=utf-8');
            return await action({ searchParams, uriParams, body });
          });
        } catch (error) {
          throw httpError.createError(500, error);
        }
      }

      // Set "route" route
      if (entry.type === 'route') {
        try {
          const mod = await import(`${entry.source}?cache=${Date.now()}`);

          if (mod?.GET) {
            fastify.get(entry.route, async (request, reply) => {
              const searchParams = request.query;
              const uriParams = request.params;

              reply.type('application/json; charset=utf-8');
              return await mod.GET({ searchParams, uriParams });
            });
          }

          if (mod?.PUT) {
            fastify.put(entry.route, async (request, reply) => {
              const searchParams = request.query;
              const uriParams = request.params;
              const body = request.body;

              reply.type('application/json; charset=utf-8');
              return await mod.PUT({ searchParams, uriParams, body });
            });
          }

          if (mod?.POST) {
            fastify.post(entry.route, async (request, reply) => {
              const searchParams = request.query;
              const uriParams = request.params;
              const body = request.body;

              reply.type('application/json; charset=utf-8');
              return await mod.POST({ searchParams, uriParams, body });
            });
          }
        } catch (error) {
          throw httpError.createError(500, error);
        }
      }
    }
  },
  {
    fastify: '4',
    name: 'plugin-router',
  },
);
