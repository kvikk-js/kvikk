import httpError from 'http-errors';
import accepts from "@fastify/accepts";
import fp from 'fastify-plugin';

import pageNotFound from '../../../../system/not-found.js';
import pageError from '../../../../system/error.js';

const getStatusCode = (error) => {
    if (error.isBoom && error.output?.statusCode) {
        return error.output.statusCode;
    }
    return error.status || error.statusCode || 500;
}

export default fp(
    /**
     * @param {import('fastify').FastifyInstance} fastify
     * @param {object} options
     */
    async (fastify, {}) => {
        fastify.register(accepts);

        fastify.setNotFoundHandler(async (request) => {
            throw new httpError.NotFound();
        });

        fastify.setErrorHandler((error, request, reply) => {
            const accept = request.accepts();
            const status = getStatusCode(error);

            reply.status(status);

            if (accept.type("html") && request.method === "GET") {
                reply.type("text/html");
                if (status === 404) {
                    return reply.ssr(pageNotFound);
                }
                return reply.ssr(pageError);
            } 
            
            if (accept.type("json")) {
                reply.type("application/json")
                return reply.send({ error: true, status });
            } 
            
            reply.send(payload.error);
          });
    }, {
    fastify: '4',
        name: 'plugin-errors'
    }
);