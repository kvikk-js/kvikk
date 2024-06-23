import path from 'node:path';

/**
 * @typedef {import('./config.js').default} Config
 */

/**
 * Build directry path to the built javascript assets. This path
 * is where the build step should place built javascript files.
 *
 * @param {Config} [config] Config object
 * @param {String} [appendix] A path to append at the end of the path
 * @returns {String}
 */
export const dirPathToJs = (config, appendix = '') => {
  return path.join(config.dirBuild, config.dirJs, appendix);
};

/**
 * Build URL path to the javascript assets. This path is used
 * to link to javascript assets in the HTML.
 *
 * Takes development mode into account and builds a URL path
 * which is different for the two envrionments.
 *
 * For development mode the returned path will point to the
 * dynamic asset builde routes and for production mode it will
 * point to the static file server.
 *
 * @param {Config} [config] Config object
 * @param {String} [appendix] A path to append at the end of the path
 * @returns {String}
 */
export const urlPathToJs = (config, appendix = '') => {
  const env = config.development ? '/_' : config.urlPathPublic;
  return path.join(config.urlPathBase, env, config.dirJs, appendix);
};

/**
 * Build router path to the dynamically build javascript assets.
 *
 * These paths will only be used in development mode.
 *
 * @param {Config} [config] Config object
 * @param {String} [appendix] A path to append at the end of the path
 * @returns {String}
 */
export const routePathToDynamicJs = (config, appendix = '') => {
  return path.join(config.urlPathBase, '/_', config.dirJs, appendix);
};
