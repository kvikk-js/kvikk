import rollupPluginCommonjs from '@rollup/plugin-commonjs';
import rollupPluginResolve from '@rollup/plugin-node-resolve';
import rollupPluginReplace from '@rollup/plugin-replace';
import rollupPluginTerser from '@rollup/plugin-terser';
import { rollup } from 'rollup';
import pino from 'pino';

import HierarchyRoutes from '../common/hierarchy-routes.js';
import Config from '../common/config.js';

const start = Date.now();

const config = new Config();
const routes = new HierarchyRoutes({ config });

const logger = pino({
  level: config.logLevel,
  name: config.name,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

logger.info(`Kvikk: ${config.libVersion}`);
logger.info(`Creating production build:`);

// TODO: Improve to not be for await
for await (const entry of routes.scan()) {
  logger.info(entry);
}

const inputOptions = {
  input: routes.toBundle(),
  plugins: [
    // @ts-ignore
    rollupPluginResolve({ preferBuiltins: true }),
    // @ts-ignore
    rollupPluginCommonjs({ include: /node_modules/ }),
    // @ts-ignore
    rollupPluginReplace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true,
    }),
    // @ts-ignore
    rollupPluginTerser({ format: { comments: false } }),
  ],
};

const outputOptionsList = [
  {
    // preserveModules: true,
    dir: config.dirBuild,
    format: 'es',
    sourcemap: true,
    entryFileNames: (chunk) => {
      // TODO: What if there is no match?? Throw an error or what?
      const entry = routes.getEntryByPath(chunk.facadeModuleId);
      return `${entry.hash}.js`;
    },
  },
];

build();

async function build() {
  let bundle;
  let buildFailed = false;
  try {
    bundle = await rollup(inputOptions);
    await generateOutputs(bundle);
  } catch (error) {
    buildFailed = true;
    logger.error(error);
  }

  if (bundle) {
    await bundle.close();
  }

  const done = Date.now() - start;
  logger.info(`Build done in ${done}ms`);

  process.exit(buildFailed ? 1 : 0);
}

async function generateOutputs(bundle) {
  for (const outputOptions of outputOptionsList) {
    await bundle.write(outputOptions);
  }
}
