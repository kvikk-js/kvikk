import { html } from '@lit-labs/ssr';

export default (page, header) => {
  return html`<!doctype html>
    <html lang="${header.lang}">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        ${header.getScripts()}
        <title>${header.title}</title>
      </head>
      <body>
        ${page}
      </body>
    </html> `;
};
