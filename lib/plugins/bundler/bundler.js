import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import esbuild from "esbuild";
import abslog from 'abslog';
import etag from '@fastify/etag';
import fp from 'fastify-plugin';

import * as importMap from "esbuild-plugin-import-map";

const require = createRequire(import.meta.url);

importMap.load('http://localhost:4000', {
    imports: {        
        '#components/': '/_/dynamic/components/',
        'lit': '/_/dynamic/modules/lit',
    }
});

const build = async ({ entryPoints = [] } = {}) => {
    const result = await esbuild.build({
        resolveExtensions: ['.js', '.ts'],
        legalComments: 'none',
        entryPoints,
        charset: 'utf8',
        // plugins: [],
        target: 'esnext',
        bundle: true,
        //sourcemap: true,
        format: "esm",
        plugins: [importMap.plugin()],
        outdir: `${tmpdir()}/noop`,
        minify: true,
        write: false,
    });
    return result.outputFiles[0].text;
}

export default fp(
    /**
     * @param {import('fastify').FastifyInstance} fastify
     * @param {object} options
     * @param {boolean} [options.development]
     */    
    async (fastify, { logger, cwd = process.cwd() } = {}) => {
        const log = abslog(logger);

        fastify.register(etag, {
            algorithm: 'fnv1a'
        });

        const componentCache = new Map();
        const moduleCache = new Map();

        fastify.get('/_/dynamic/components/:component.js', async (request, reply) => {        
            const component = request.params['component'];

            // TODO: 404 if component is not provided to URL

            if (!componentCache.has(component)) {
                const body = await build({
                    entryPoints: [`${cwd}/components/${component}`],
                });

                componentCache.set(component, body);
            }

            reply.type("application/javascript");
            return componentCache.get(component);
        });

        fastify.get('/_/dynamic/modules/*', async (request, reply) => {
            const depname = request.params['*'];
            
            if (!moduleCache.has(depname)) {
                const filepath = require.resolve(depname, { paths: [cwd] });

                const body = await build({
                    entryPoints: [filepath],
                });

                moduleCache.set(depname, body);
            }

            reply.type("application/javascript");
            return moduleCache.get(depname);
        });

        fastify.get('/_/dynamic/pages/page.js', async (request, reply) => {        
            const body = await build({
                entryPoints: [`${cwd}/pages/page.js`],
            });

            reply.type("application/javascript");
            return body;
        });

    }, {
        fastify: '4',
        name: 'plugin-bundler'
    }
);