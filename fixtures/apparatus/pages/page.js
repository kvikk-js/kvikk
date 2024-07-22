import { html } from 'lit';

import layout from '#layouts/layout.js';    // eslint-disable-line
import button from '#components/button.js'; // eslint-disable-line
import card from '#components/card.js';     // eslint-disable-line

export const metadata = () => {
  return {
    title: 'A page title',
  };
};

export default () => {
  return html`
    <k-layout>
      <h1 slot="header">Header</h1>

      <p>Hello from my template.</p>
      <w-card>
        <span slot="header">Slotted Header</span>
        Slotted content
        <span slot="footer">Slotted Footer</span>
      </w-card>
      <w-card>
        <w-button></w-button>
      </w-card>

      <p slot="footer">Footer</p>
    </k-layout>
  `;
};
