import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import * as dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
dotenv.config();

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const pkgJson = fs.readFileSync(path.join(currentDirectory, '../../package.json'), 'utf-8');
const pkg = JSON.parse(pkgJson);

/**
 * Config class. Loads and hold all config used by the Kvikk app.
 */
export default class Config {
  // Kvikk module properties
  #libVersion = pkg.version;

  // File system properties
  #cwd = './';
  #dirSrc = './';
  #dirBuild = './build';
  #dirComponents = './components';
  #dirLayouts = './layouts';
  #dirPublic = './public';
  #dirSystem = './system';
  #dirPages = './pages';

  // URL properties
  #urlAssetsPrefix = '/';
  #urlBasePath = '/';

  // Server instance properties
  #serverHost = '127.0.0.1';
  #serverPort = 4000;

  // Logging properties
  #logRequests = false;
  #logLevel = 'info';

  #name = 'Kvikk.js';
  #development = true;

  // Compression properties
  #compression = true;

  /**
   * @constructor
   *
   * Config class. Loads and hold all config used by the Kvikk app.
   *
   * @example
   * ```
   * const config = new Config();
   * console.log(config.development);
   * ```
   */
  constructor() {
    this.#cwd = process.cwd();
    this.#serverHost = process.env.HOST || this.#serverHost;
    this.#serverPort = parseInt(process.env.PORT, 10) || this.#serverPort;
  }

  load(configuration) {
    let config = [];
    if (configuration) {
      config = configuration;
    } else {
      try {
        const file = fs.readFileSync(path.join(currentDirectory, '../../kvikk.config.js'), 'utf-8');
        console.log(file);
      } catch (error) {
        console.log(error);
      }
    }
  }

  /**
   * The version of the Kvikk module in use.
   *
   * Value is taken from the "version" property in package.json
   * in the kvikk.js module in use by the application.
   *
   * @type {string}
   */
  get libVersion() {
    return this.#libVersion;
  }

  /**
   * @throws {Error} Read only-property
   */
  set libVersion(value) {
    throw new Error('Cannot set read-only property.');
  }

  /**
   * The host of the server.
   * @type {string}
   */
  get serverHost() {
    return this.#serverHost;
  }

  /**
   * @throws {Error} Read only-property
   */
  set serverHost(value) {
    throw new Error('Cannot set read-only property.');
  }

  /**
   * The port of the server
   * @type {number}
   */
  get serverPort() {
    return this.#serverPort;
  }

  /**
   * @throws {Error} Read only-property
   */
  set serverPort(value) {
    throw new Error('Cannot set read-only property.');
  }

  /**
   * Current Working Directory
   * @type {string}
   */
  get cwd() {
    return this.#cwd;
  }

  /**
   * @throws {Error} Read only-property
   */
  set cwd(value) {
    throw new Error('Cannot set read-only property.');
  }

  /**
   * Absolute path to the "source" directory on the file system.
   *
   * The "source" directory is the root of the application which all other
   * kvikk.js specific directories and files resides under.
   *
   * By default this is "./".
   *
   * When set all other kvikk.js specific directories and files should be
   * prefixed with this value.
   *
   * The absolute value is composed by .cwd and the relative value
   * for dir.src in the app config.
   *
   * @type {string}
   */
  get dirSrc() {
    return path.resolve(this.#cwd, this.#dirSrc);
  }

  /**
   * @throws {Error} Read only-property
   */
  set dirSrc(value) {
    throw new Error('Cannot set read-only property.');
  }

  /**
   * Absolute path to the "build" directory on the file system.
   *
   * The "build" directory is the root of where the browser
   * assets is placed by the build step.
   *
   * By default this is "./build".
   *
   * The absolute value is composed by .dirSrc and the relative value
   * for dir.build in the app config.
   *
   * @type {string}
   */
  get dirBuild() {
    return path.resolve(this.dirSrc, this.#dirBuild);
  }

  /**
   * @throws {Error} Read only-property
   */
  set dirBuild(value) {
    throw new Error('Cannot set read-only property.');
  }

  /**
   * Absolute path to the "components" directory on the file system.
   *
   * The "components" directory is a directory where local components
   * for the application can be stored.
   *
   * By default this is "./components".
   *
   * The absolute value is composed by .dirSrc and the relative value
   * for dir.components in the app config.
   *
   * @type {string}
   */
  get dirComponents() {
    return path.resolve(this.dirSrc, this.#dirComponents);
  }

  /**
   * @throws {Error} Read only-property
   */
  set dirComponents(value) {
    throw new Error('Cannot set read-only property.');
  }

  /**
   * Absolute path to the "layouts" directory on the file system.
   *
   * The "layouts" directory is a directory where local layouts
   * for the application can be stored.
   *
   * By default this is "./layouts".
   *
   * The absolute value is composed by .dirSrc and the relative value
   * for dir.layouts in the app config.
   *
   * @type {string}
   */
  get dirLayouts() {
    return path.resolve(this.dirSrc, this.#dirLayouts);
  }

  /**
   * @throws {Error} Read only-property
   */
  set dirLayouts(value) {
    throw new Error('Cannot set read-only property.');
  }

  /**
   * Absolute path to the "public" directory on the file system.
   *
   * The "public" directory is a directory where static files
   * (such as images, graphics etc) for the application can
   * be stored.
   *
   * By default this is "./public".
   *
   * The absolute value is composed by .dirSrc and the relative value
   * for dir.public in the app config.
   *
   * @type {string}
   */
  get dirPublic() {
    return path.resolve(this.dirSrc, this.#dirPublic);
  }

  /**
   * @throws {Error} Read only-property
   */
  set dirPublic(value) {
    throw new Error('Cannot set read-only property.');
  }

  /**
   * Absolute path to the "system" directory on the file system.
   *
   * The "system" directory is a directory where system wide files
   * (such as not-found pages, error pages etc) for the application
   * is stored.
   *
   * By default this is "./system".
   *
   * The absolute value is composed by .dirSrc and the relative value
   * for dir.system in the app config.
   *
   * @type {string}
   */
  get dirSystem() {
    return path.resolve(this.dirSrc, this.#dirSystem);
  }

  /**
   * @throws {Error} Read only-property
   */
  set dirSystem(value) {
    throw new Error('Cannot set read-only property.');
  }

  /**
   * Absolute path to the "pages" directory on the file system.
   *
   * The "pages" directory is the root directory of the router.
   *
   * By default this is "./pages".
   *
   * The absolute value is composed by .dirSrc and the relative value
   * for dir.pages in the app config.
   *
   * @type {string}
   */
  get dirPages() {
    return path.resolve(this.dirSrc, this.#dirPages);
  }

  /**
   * @throws {Error} Read only-property
   */
  set dirPages(value) {
    throw new Error('Cannot set read-only property.');
  }

  get urlBasePath() {
    return this.#urlBasePath;
  }

  get urlAssetsPrefix() {
    return this.#urlAssetsPrefix;
  }

  get name() {
    return this.#name;
  }

  set name(value) {
    this.#name = value;
  }

  get development() {
    return this.#development;
  }

  set development(value) {
    this.#development = value;
  }

  get logRequests() {
    return this.#logRequests;
  }

  set logRequests(value) {
    this.#logRequests = value;
  }

  get logLevel() {
    return this.#logLevel;
  }

  set logLevel(value) {
    this.#logLevel = value.toLowerCase();
  }

  get compression() {
    return this.#compression;
  }
}
