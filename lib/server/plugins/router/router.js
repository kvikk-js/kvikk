import formbody from '@fastify/formbody';
import httpError from 'http-errors';
import fp from 'fastify-plugin';

import { mapFileSystemRoute } from './route-mapping.js';
import Header from '../../../classes/header.js';

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
    // TODO: Go in main?????
    fastify.register(formbody);

    // TODO: Set default header here????
    fastify.addHook('preHandler', async (request) => {
      request.header = new Header();
    });

    const routes = hierarchy.routes[Symbol.iterator]();

    for await (const item of routes) {
      const entry = item[1];
      const route = mapFileSystemRoute(entry.route);

      // Set "page" route
      if (entry.type === 'page') {
        try {
          const { default: page } = await import(`${entry.source.href}`);
          console.log('ROUTE', route);
          fastify.get(
            route,
            {
              config: {
                entry,
              },
            },
            async (request, reply) => {
              // TODO: Build proper script tags
              const scriptHydrationUrl = config.urlPathToJs('/lit/hydration.js');
              request.header.setScript(scriptHydrationUrl.href);

              const scriptPageUrl = config.urlPathToJs(`/pages/${request.routeOptions.config.entry.hash}.js`);
              request.header.setScript(scriptPageUrl.href);

              reply.type('text/html; charset=utf-8');
              return reply.ssr(page);
            },
          );
        } catch (error) {
          console.log(error);
          // throw httpError.createError(500, error);
          throw new httpError.InternalServerError();
        }
      }

      // Set "action" route
      if (entry.type === 'action') {
        try {
          const { default: action } = await import(`${entry.source.href}`);

          fastify.post(route, async (request, reply) => {
            const searchParams = request.query;
            const uriParams = request.params;
            const body = request.body;

            reply.type('text/html; charset=utf-8');
            return await action({ searchParams, uriParams, body });
          });
        } catch (error) {
          console.log(error);
          // throw httpError.createError(500, error);
          throw new httpError.InternalServerError();
        }
      }

      // Set "route" route
      if (entry.type === 'route') {
        try {
          const mod = await import(`${entry.source.href}`);

          if (mod?.GET) {
            fastify.get(route, async (request, reply) => {
              const searchParams = request.query;
              const uriParams = request.params;

              reply.type('application/json; charset=utf-8');
              return await mod.GET({ searchParams, uriParams });
            });
          }

          if (mod?.PUT) {
            fastify.put(route, async (request, reply) => {
              const searchParams = request.query;
              const uriParams = request.params;
              const body = request.body;

              reply.type('application/json; charset=utf-8');
              return await mod.PUT({ searchParams, uriParams, body });
            });
          }

          if (mod?.POST) {
            fastify.post(route, async (request, reply) => {
              const searchParams = request.query;
              const uriParams = request.params;
              const body = request.body;

              reply.type('application/json; charset=utf-8');
              return await mod.POST({ searchParams, uriParams, body });
            });
          }
        } catch (error) {
          console.log(error);
          // throw httpError.createError(500, error);
          throw new httpError.InternalServerError();
        }
      }
    }
  },
  {
    fastify: '4',
    name: 'plugin-router',
  },
);
