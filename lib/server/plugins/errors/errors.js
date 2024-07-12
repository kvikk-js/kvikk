import { fileURLToPath } from 'node:url';
import httpError from 'http-errors';
import accepts from '@fastify/accepts';
import fp from 'fastify-plugin';

/**
 * @typedef {import('../../../common/config.js').default} Config
 * @typedef {import('../../../common/hierarchy.js').default} Hierarchy
 */

const getStatusCode = (error) => {
  if (error.isBoom && error.output?.statusCode) {
    return error.output.statusCode;
  }
  return error.status || error.statusCode || 500;
};

export default fp(
  /**
   * @param {import('fastify').FastifyInstance} fastify
   * @param {object} options
   * @param {Config} [options.config]
   * @param {Hierarchy} [options.hierarchy]
   */
  async (fastify, { config, hierarchy } = {}) => {
    const cacheBuster = config.development ? `?cache=${Date.now()}` : '';
    const { default: pageNotFound } = await import(`${fileURLToPath(hierarchy.getNotFound())}${cacheBuster}`);
    const { default: pageError } = await import(`${fileURLToPath(hierarchy.getError())}${cacheBuster}`);

    fastify.register(accepts);

    fastify.setNotFoundHandler(async () => {
      throw new httpError.NotFound();
    });

    fastify.setErrorHandler((error, request, reply) => {
      const accept = request.accepts();
      const status = getStatusCode(error);

      reply.status(status);

      if (accept.type('html') && request.method === 'GET') {
        reply.type('text/html');
        if (status === 404) {
          return reply.ssr(pageNotFound);
        }
        return reply.ssr(pageError);
      }

      if (accept.type('json')) {
        reply.type('application/json');
        return reply.send({ error: true, status });
      }

      reply.send('Internal server error');
    });
  },
  {
    fastify: '4',
    name: 'plugin-errors',
  },
);
