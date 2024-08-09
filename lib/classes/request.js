const inspect = Symbol.for('nodejs.util.inspect.custom');

/**
 * Request class.
 * The request object passed on to middleware, actions and routes.
 */
export default class HRequest {
  /**
   * @constructor
   *
   * Request class.
   * The request object passed on to middleware, actions and routes.
   *
   * @example
   * ```
   * const request = new Request();
   * ```
   */

  #urlParams;
  #headers;
  #method;
  #body;
  #url;

  constructor(input, options) {
    this.#url = new URL(input);
    this.#urlParams = options.params ? options.params : {};
    this.#headers = new Headers(options.headers);
    this.#method = options.method ? options.method : 'GET';

    if (this.#method === 'POST' || this.#method === 'PUT') {
      this.#body = new FormData();
    }
  }

  get urlParams() {
    return this.#urlParams;
  }

  /**
   * @throws {Error} Read only-property
   */
  set urlParams(value) {
    throw new Error('Cannot set read-only property.');
  }

  get headers() {
    return this.#headers;
  }

  /**
   * @throws {Error} Read only-property
   */
  set headers(value) {
    throw new Error('Cannot set read-only property.');
  }

  get method() {
    return this.#method;
  }

  /**
   * @throws {Error} Read only-property
   */
  set method(value) {
    throw new Error('Cannot set read-only property.');
  }

  get body() {
    return this.#body;
  }

  /**
   * @throws {Error} Read only-property
   */
  set body(value) {
    throw new Error('Cannot set read-only property.');
  }

  get url() {
    return this.#url;
  }

  /**
   * @throws {Error} Read only-property
   */
  set url(value) {
    throw new Error('Cannot set read-only property.');
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Request
  toRequest() {
    return new Request(this.url, {
      headers: this.headers,
      method: this.method,
      body: this.body,
    });
  }

  toJSON() {
    return {
      urlParams: this.urlParams,
      headers: this.headers,
      method: this.method,
      body: this.body,
      url: this.url,
    };
  }

  [inspect]() {
    return {
      urlParams: this.urlParams,
      headers: this.headers,
      method: this.method,
      body: this.body,
      url: this.url,
    };
  }

  get [Symbol.toStringTag]() {
    return 'HubroRequest';
  }
}
