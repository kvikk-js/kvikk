import { html } from '@lit-labs/ssr';

export default (page) => {
    return html`<!doctype html>
        <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <meta http-equiv="X-UA-Compatible" content="IE=Edge">
                <script src="/_/dynamic/modules/@lit-labs/ssr-client/lit-element-hydrate-support.js" type="module"></script>
                <script src="/_/dynamic/pages/page.js" type="module"></script>
                <title>Hello World</title>
            </head>
            <body>
                ${page}
            </body>
        <html>
    `;
}