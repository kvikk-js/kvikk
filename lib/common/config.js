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
  #dirBuild = './build';
  #dirSrc = './';
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
  #serverPort = 4001;

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

  /**
   * The version of the Kvikk module in use.
   *
   * Value is taken from the "version" property in package.json
   * in the kvikk module in use by the application.
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
   * Absolute path to the "build" directory on the file system.
   * @type {string}
   */
  get dirBuild() {
    return path.resolve(this.#cwd, this.#dirBuild);
  }

  /**
   * @throws {Error} Read only-property
   */
  set dirBuild(value) {
    throw new Error('Cannot set read-only property.');
  }

  /**
   * Absolute path to the "source" directory on the file system.
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
   * Absolute path to the "components" directory on the file system.
   * @type {string}
   */
  get dirComponents() {
    return path.resolve(this.#cwd, this.#dirSrc, this.#dirComponents);
  }

  /**
   * @throws {Error} Read only-property
   */
  set dirComponents(value) {
    throw new Error('Cannot set read-only property.');
  }

  /**
   * Absolute path to the "layouts" directory on the file system.
   * @type {string}
   */
  get dirLayouts() {
    return path.resolve(this.#cwd, this.#dirSrc, this.#dirLayouts);
  }

  /**
   * @throws {Error} Read only-property
   */
  set dirLayouts(value) {
    throw new Error('Cannot set read-only property.');
  }

  /**
   * Absolute path to the "public" directory on the file system.
   * @type {string}
   */
  get dirPublic() {
    return path.resolve(this.#cwd, this.#dirSrc, this.#dirPublic);
  }

  /**
   * @throws {Error} Read only-property
   */
  set dirPublic(value) {
    throw new Error('Cannot set read-only property.');
  }

  /**
   * Absolute path to the "system" directory on the file system.
   * @type {string}
   */
  get dirSystem() {
    return path.resolve(this.#cwd, this.#dirSrc, this.#dirSystem);
  }

  /**
   * @throws {Error} Read only-property
   */
  set dirSystem(value) {
    throw new Error('Cannot set read-only property.');
  }

  /**
   * Absolute path to the "pages" directory on the file system.
   * @type {string}
   */
  get dirPages() {
    return path.resolve(this.#cwd, this.#dirSrc, this.#dirPages);
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
