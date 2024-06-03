/**
 * Metadata class.
 * Holds all the stuff which goes into the head the document.
 */
export default class Metadata {
    /**
     * @constructor
     * 
     * Metadata class.
     * Holds all the stuff which goes into the head the document.
     * 
     * @example
	 * ```
	 * const metadata = new Metadata();
     * console.log(config.title);
	 * ```
     */
    constructor() {
        this.title = 'Welcome to Kvikk';
        this.lang = 'en';
    }
}
