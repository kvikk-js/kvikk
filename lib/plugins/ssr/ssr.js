import { RenderResultReadable } from '@lit-labs/ssr/lib/render-result-readable.js';
import { render } from '@lit-labs/ssr';
import abslog from 'abslog';
import fp from 'fastify-plugin';

import document from '../../../system/document.js';

export default fp(
    /**
     * @param {import('fastify').FastifyInstance} fastify
     * @param {object} options
     * @param {boolean} [options.development]
     */
    async (fastify, { logger, development = false }) => {
        const log = abslog(logger);

        fastify.decorateReply('ssr', (page) => {
            /*
            if (document) {
                const doc = document(page());
                return new RenderResultReadable(render(doc));
            }
            const doc = layout(page());
            */

            const doc = document(page());
            return new RenderResultReadable(render(doc));
        });
    }, {
        fastify: '4',
        name: 'plugin-ssr'
    }
);
