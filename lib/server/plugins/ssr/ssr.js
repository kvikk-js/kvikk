import { RenderResultReadable } from '@lit-labs/ssr/lib/render-result-readable.js';
import { render } from '@lit-labs/ssr';
import fp from 'fastify-plugin';

/**
 * @typedef {import('../../../common/config.js').default} Config
 * @typedef {import('../../../common/hierarchy.js').default} Hierarchy
 */

export default fp(
  /**
   * @param {import('fastify').FastifyInstance} fastify
   * @param {object} options
   * @param {Config} [options.config]
   * @param {Hierarchy} [options.hierarchy]
   */
  async (fastify, { config, hierarchy } = {}) => {
    const cacheBuster = config.development ? `?cache=${Date.now()}` : '';
    const { default: document } = await import(`${hierarchy.getDocument()}${cacheBuster}`);

    // NB: An arrow function will break use of 'this'
    fastify.decorateReply('ssr', function (page) {
      const doc = document(page(), this?.request?.header);
      return new RenderResultReadable(render(doc));
    });
  },
  {
    fastify: '4',
    name: 'plugin-ssr',
  },
);
