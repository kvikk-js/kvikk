import { RenderResultReadable } from '@lit-labs/ssr/lib/render-result-readable.js';
import { render } from '@lit-labs/ssr';
import fp from 'fastify-plugin';

import document from '../../../../system/document.js';

export default fp(
  /**
   * @param {import('fastify').FastifyInstance} fastify
   */
  async (fastify) => {
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
