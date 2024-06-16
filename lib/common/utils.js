import { fileURLToPath } from 'node:url';
import path from 'node:path';

/**
 * Checks if a value is a string.
 *
 * @param {unknown} [str] A value to check
 * @returns {boolean}
 */
export const isString = (str) => typeof str === 'string';

/**
 * Checks if a value is a function.
 *
 * @param {unknown} [fn] A value to check
 * @returns {boolean}
 */
export const isFunction = (fn) => {
  const type = {}.toString.call(fn);
  return type === '[object Function]' || type === '[object AsyncFunction]';
};

/**
 * Resolve cwd.
 *
 * @param {string|URL} [cwd] Custom cwd to resolve
 * @returns {string}
 */
export const resolveCwd = (cwd) => {
  if (cwd instanceof URL) {
    cwd = fileURLToPath(cwd);
  }
  return cwd ? path.resolve(cwd) : process.cwd();
};
