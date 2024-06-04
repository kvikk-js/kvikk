import { html } from '@lit-labs/ssr';

/**
 * Header class.
 * Holds all the stuff which goes into the head the document.
 */
export default class Header {
  /**
   * @constructor
   *
   * Header class.
   * Holds all the stuff which goes into the head the document.
   *
   * @example
   * ```
   * const header = new Header();
   * console.log(header.title);
   * ```
   */
  constructor() {
    this.title = 'Welcome to Kvikk';
    this.lang = 'en';
    this.scripts = [];
  }

  setScript(script) {
    this.scripts.push(script);
  }

  getScripts() {
    return this.scripts.map((script) => {
      return html`<script src="${script}" type="module"></script>`;
    });
  }
}
