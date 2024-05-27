import { LitElement, html } from "lit";

export default class WarpButton extends LitElement {
    static properties = {
        count: {type: Number},
    };

    constructor() {
      super();
      this.count = 0;
    }

    _increment(e) {
        this.count++;
        this.dispatchEvent(new CustomEvent('increment', {bubbles: true, composed: true}));
    }

    render() {
        return html`<button @click="${this._increment}">I'm clicked ${this.count} times</button>`;
    }
}

if (!customElements.get('w-button')) {
    customElements.define('w-button', WarpButton);
}