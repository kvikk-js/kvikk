import formbody from '@fastify/formbody';
import abslog from 'abslog';

import fp from 'fastify-plugin';

import Hierarchy from '../../common/hierarchy.js';

export default fp(
    /**
     * @param {import('fastify').FastifyInstance} fastify
     * @param {object} options
     * @param {boolean} [options.development]
     */
    async (fastify, { logger, cwd = process.cwd(), root = './pages', development = false } = {}) => {
        const log = abslog(logger);

        fastify.register(formbody);
        
        log.debug('Loading file based routes from:');

        const hierarchy = new Hierarchy();
        
        for await (const entry of hierarchy.load()) {
            log.debug(entry);

            // Set "page" route
            if (entry.type === 'page') {
                try {
                    const { default: page } = await import(`${entry.file}?cache=${Date.now()}`);
            
                    fastify.get(entry.route, async (request, reply) => {
                        const searchParams = request.query; 
                        const uriParams = request.params;
                
                        // return await page({ searchParams, uriParams });
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
                    const { default: action } = await import(`${entry.file}?cache=${Date.now()}`);
            
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
                    const mod = await import(`${entry.file}?cache=${Date.now()}`);
                    
                    if (mod?.GET) {
                        console.log('Module has GET');
                        fastify.get(entry.route, async (request, reply) => {
                            const searchParams = request.query; 
                            const uriParams = request.params;
                    
                            return await mod.GET({ searchParams, uriParams });
                        });
                    }

                    if (mod?.PUT) {
                        console.log('Module has PUT');
                        fastify.put(entry.route, async (request, reply) => {
                            const searchParams = request.query; 
                            const uriParams = request.params;
                            const body = request.body;
                    
                            return await mod.PUT({ searchParams, uriParams, body });
                        });
                    }

                    if (mod?.POST) {
                        console.log('Module has POST');
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
