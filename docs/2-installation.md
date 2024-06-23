# Installation

These are the steps needed to get you going:

## System Requirements:

Node.js 22.0 or later.
macOS, Windows, and Linux are supported.

## Automatic Installation

TODO: Have a pre setup github template repo
TODO: Create a @kvikk/launch tool to scaffold new apps

## Manual Installation

If your starting out with a new project, create a new Node project:

```sh
npm init
```

Kvikk.js require the project to be ESM. Add `"type": "module"` to package.json.

Then install Kvikk.js and Lit as dependencies to your project:

```sh
npm install kvikk
npm install lit
```

Then add the following commands to the `scripts` field in the package.json in your project:

```json
{
  "build": "kvikk build",
  "start": "kvikk start",
  "dev": "kvikk dev"
}
```

## Advanced

Kvikk.js differ between running in development mode and production mode. In development mode a set of additional tools are used to handle dynamic bundling and improve DX. In production mode all frontend assets is expected to have been bundeled up and can be served statically. This means that in development mode we require several dependencies (such as Rollup etc) which we do not need in production.

When installing dependencies in a Kvikk.js app for a production environmnt we can omit the dependencies used by Kvikk.js in development. This will yeld a smaller dependency tree when running in production. You do so by adding the `--omit=optional` option when installing the dependencies for your Kvikk.js app:

```sh
npm install --omit=optional
```
