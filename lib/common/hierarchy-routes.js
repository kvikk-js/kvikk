import { resolve, join } from 'node:path';
import crypto from 'node:crypto';

import { Glob } from 'glob';
import abslog from 'abslog';

/**
 * @typedef {import('./config.js').default} Config
 */

const HASH_LENGTH = 8;
const ACTION = /action(\.js|\.ts)/;
const ROUTE = /route(\.js|\.ts)/;
const PAGE = /page(\.js|\.ts)/;

const createHash = (value, seed = '') => {
  const v = seed === '' ? value : `${value}#${seed}`;
  return crypto.createHash('shake256', { outputLength: HASH_LENGTH }).update(v).digest('hex');
};

export default class HierarchyRoutes {
  /**
   * @param {object} options
   * @param {Config} [options.config]
   * @param {string} [options.seed]
   */
  constructor({ config, seed = '', logger }) {
    this.logger = abslog(logger);
    this.config = config;
    this.seed = seed;
    this.map = new Map();

    this.glob = new Glob(
      [
        `${this.config.dirPages}/**/action.{ts,js}`,
        `${this.config.dirPages}/**/route.{ts,js}`,
        `${this.config.dirPages}/**/page.{ts,js}`,
      ],
      {
        withFileTypes: true,
        nodir: true,
      },
    );
  }

  async *scan() {
    this.map.clear();

    for await (const entry of this.glob) {
      if (ACTION.test(entry.name)) {
        yield this.setAction(entry.parentPath, entry.name);
      }

      if (ROUTE.test(entry.name)) {
        yield this.setRoute(entry.parentPath, entry.name);
      }

      if (PAGE.test(entry.name)) {
        yield this.setPage(entry.parentPath, entry.name);
      }

      // TODO: Handle unknown files if any????
    }
  }

  setAction(parentPath, name) {
    let route = parentPath.replace(this.config.dirPages, '');
    if (route === '') route = '/'; // Make sure root route is a /
    route = join(this.config.urlBasePath, route); // Append base path if configures

    const source = join(parentPath, name);
    const hash = createHash(route, this.seed);

    const entry = {
      source,
      bundle: false,
      route,
      hash,
      type: 'action',
    };

    // console.log('SCANNING - ACTION', hash, source, route);

    // this.map.set(hash, entry);
    return entry;
  }

  setRoute(parentPath, name) {
    let route = parentPath.replace(this.config.dirPages, '');
    if (route === '') route = '/'; // Make sure root route is a /
    route = join(this.config.urlBasePath, route); // Append base path if configures

    const source = join(parentPath, name);
    const hash = createHash(route, this.seed);

    const entry = {
      source,
      bundle: false,
      route,
      hash,
      type: 'route',
    };

    // console.log('SCANNING - ROUTE', hash, source, route);

    // this.map.set(hash, entry);
    return entry;
  }

  setPage(parentPath, name) {
    let route = parentPath.replace(this.config.dirPages, '');
    if (route === '') route = '/'; // Make sure root route is a /
    route = join(this.config.urlBasePath, route); // Append base path if configures

    const source = join(parentPath, name);
    const hash = createHash(route, this.seed);

    const entry = {
      source,
      bundle: true,
      route,
      hash,
      type: 'page',
    };

    // console.log('SCANNING - PAGE', hash, source, route);

    this.map.set(hash, entry);
    return entry;
  }

  getEntryByHash(hash) {
    return this.map.get(hash);
  }

  getEntryByPath(path) {
    // TODO: Can be made more efficient
    return Array.from(this.map.values()).filter((entry) => {
      return path === entry.source;
    })[0];
  }

  toBundle() {
    return Array.from(this.map.values())
      .filter((entry) => {
        return entry.bundle;
      })
      .map((entry) => {
        return entry.source;
      });
  }
}
