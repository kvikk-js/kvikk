import { html } from 'lit';

import card from '#components/card.js'; // eslint-disable-line

export default () => {
  return html`
    <p>Hello from my template.</p>
    <w-card>
      <span slot="header">Slotted Header</span>
      Slotted content
    </w-card>
  `;
};
