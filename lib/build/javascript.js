import * as esbuild from 'esbuild'

import HierarchyRoutes from '../common/hierarchy-routes.js';
import Config from '../common/config.js';

const config = new Config();

const routes = new HierarchyRoutes();
await routes.scan();

await esbuild.build({
    resolveExtensions: ['.js', '.ts'],
    entryPoints: routes.toBundle(),
    treeShaking: true,
    splitting: true,
    format: 'esm',
    minify: true,
    bundle: true,
    write: true,
    outdir: 'out',
});
