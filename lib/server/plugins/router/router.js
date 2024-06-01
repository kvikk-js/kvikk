import formbody from '@fastify/formbody';
import fp from 'fastify-plugin';

import { isFunction } from '../../../common/utils.js';

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
        
        // TODO: Set default metadata here????
        fastify.addHook('preHandler', async (request, reply) => {
            request.metadata = { title: 'Welcome to Kvikk' };
        });
        
        const routes = hierarchy;
        
        for await (const entry of routes.scan()) {

            // Set "page" route
            if (entry.type === 'page') {
                try {
                    const { default: page, metadata } = await import(`${entry.source}?cache=${Date.now()}`);
            
                    fastify.get(entry.route, { 
                        config: { 
                            entry 
                        } 
                    }, async (request, reply) => {
                        const searchParams = request.query; 
                        const uriParams = request.params;

                        if (isFunction(metadata)) {
                            request.metadata = metadata();       
                        }

                        reply.type("text/html; charset=utf-8");
                        return reply.ssr(page);
                    });
                } catch(error) {
                    throw error;
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
                
                        return await action({ searchParams, uriParams, body });
                    });
                } catch(error) {
                    throw error;
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
                    
                            return await mod.GET({ searchParams, uriParams });
                        });
                    }

                    if (mod?.PUT) {
                        fastify.put(entry.route, async (request, reply) => {
                            const searchParams = request.query; 
                            const uriParams = request.params;
                            const body = request.body;
                    
                            return await mod.PUT({ searchParams, uriParams, body });
                        });
                    }

                    if (mod?.POST) {
                        fastify.post(entry.route, async (request, reply) => {
                            const searchParams = request.query; 
                            const uriParams = request.params;
                            const body = request.body;
                    
                            return await mod.POST({ searchParams, uriParams, body });
                        });
                    }

                } catch(error) {
                    throw error;
                }
            }
        }

    }, {
        fastify: '4',
        name: 'plugin-router'
    }
);
