import * as esbuild from 'esbuild'
import Hierarchy from '../common/hierarchy.js';

const hierarchy = new Hierarchy({ logger: console });

const entryPoints = await hierarchy.entryPoints();

await esbuild.build({
    resolveExtensions: ['.js', '.ts'],
    entryPoints,
    format: 'esm',
    minify: true,
    bundle: true,
    write: true,
    outdir: 'out',
});