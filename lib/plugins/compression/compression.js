import compress from '@fastify/compress';
import abslog from 'abslog';
import fp from 'fastify-plugin';

export default fp(
  /**
   * @param {import('fastify').FastifyInstance} fastify
   * @param {object} options
   * @param {boolean} [options.enabled]
   */
  async (fastify, { logger, enabled }) => {
        const log = abslog(logger);
        if (enabled) {
            log.debug('Compression is enabled');
            await fastify.register(compress, { global: true });
        }
    }, {
    fastify: '4',
        name: 'plugin-compression'
    }
);