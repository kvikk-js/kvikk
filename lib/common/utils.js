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
