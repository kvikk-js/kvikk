import path from 'node:path';

/**
 * @typedef {import('./config.js').default} Config
 */

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
  return path.join(config.urlPathBase, env, config.urlPathJs, appendix);
};

/**
 * Build route path to the dynamically build javascript assets.
 *
 * These paths will only be used in development mode.
 *
 * @param {Config} [config] Config object
 * @param {String} [appendix] A path to append at the end of the path
 * @returns {String}
 */
export const routePathToDynamicJs = (config, appendix = '') => {
  return path.join(config.urlPathBase, '/_', config.urlPathJs, appendix);
};
