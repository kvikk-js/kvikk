import rollupPluginCommonjs from '@rollup/plugin-commonjs';
import rollupPluginResolve from '@rollup/plugin-node-resolve';
import rollupPluginReplace from '@rollup/plugin-replace';
import rollupPluginTerser from '@rollup/plugin-terser';
import { rollup } from 'rollup';

import { fileURLToPath } from 'node:url';

export default async (logger, config, hierarchy) => {
  const inputOptions = {
    input: hierarchy.toBundle(),
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
      dir: fileURLToPath(new URL('./pages/', config.dirJs)),
      format: 'es',
      sourcemap: true,
      entryFileNames: (chunk) => {
        // TODO: What if there is no match?? Throw an error or what?
        const entry = hierarchy.getEntryByPath(chunk.facadeModuleId);
        return `${entry.hash}.js`;
      },
    },
  ];

  let bundle;
  bundle = await rollup(inputOptions);

  for (const outputOptions of outputOptionsList) {
    await bundle.write(outputOptions);
  }

  if (bundle) {
    await bundle.close();
  }
};
