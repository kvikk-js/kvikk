import { LitElement, html, css } from 'lit';

export default class SimpleLayout extends LitElement {
  static styles = [
    css`
      header,
      footer,
      main {
        padding: 4px;
      }
    `,
  ];

  constructor() {
    super();
  }

  render() {
    return html`
      <header part="header">
        <slot name="header"></slot>
      </header>
      <main><slot></slot></main>
      <footer part="footer">
        <slot name="footer"></slot>
      </footer>
    `;
  }
}

if (!customElements.get('k-layout')) {
  customElements.define('k-layout', SimpleLayout);
}
