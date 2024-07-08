# API

Kvikk.js can be used programatically from within an kvikk.js application or as a dependency in other projects. Being able to use the application programatically are for example convinient when writing tests.

Example of starting a kvikk.js server with default config and stopping it after 10 seconds:

```js
import server from 'kvikk/server';

const app = await server();
await app.start();

setTimeout(async () => {
    await app.stop();
}, 10000);
```

When using kvikk.js programatically the different instances provided by the API is the exact same type of instance as when one are using the run commands (`kvikk dev` and `kvikk start`) to run an kvikk.js application. This means that the programatically API assume and look for the expected project structure of a kvikk.js application.

Though; when using the API, config or arguments provided through the API have a higher precedence than the file based user config provided in the project structure. This is usefull if one have a user config the application should run with under normal conditions but one might want to diverge from this config when the application is used in a test.

As an example; when an application is running in production its common to have a the log level set to `info`. Though; when the application are used in tests outputting log lines will interfer with the console output from the test runner. In this case one would like to set the log level to `silent` to silence the application logging. By applying a `silent` as log level through the API it will override the log level set in the user config.

Which config and arguments which override what in the user config is highlighted for each occurance in the API. 

## kvikk/server: Factory(serviceConfig, [userConfig])

The `kvikk/server` module provide an async factory function for creating new server instances. 

```js
import server from 'kvikk/server';

const app = await server();
const address = await app.start();
```

Returns a Server instance.

### Arguments

The Factory function take the following arguments:

 * `serviceConfig` - `Object` - Factory configuration.
 * `userConfig` - `Array` - User configuration.

```js
import server from 'kvikk/server';

const app = await server({ devlopment: false }, [
    {
        server: {
            port: 8080
        }
    }
]);
```

#### serviceConfig

A configuration object used for altering the creation of the server instance in the factory function. 

 * `development` - `Boolean` - Dictate if the returned server instance should be a development or productin server instance.
 * `cwd` - `String` - Current working directory. File system path to the root of a Kvikk.js app. Must be an absoulte path.

#### userConfig

User configuration passed on to the server instance created by the factory function. The config is the same config and format as used in kvikk.config.js. 

The configuration passed have a higher precedence than the kvikk.config.js configuration. The precedence are on property level so if only parts of a config object is set through this argument only those parts will override the file based configuration and not the whole config object.

Configuration objects can be set as an array of config objects:

```js
const app = await server({}, [
    {
        server: {
            port: 8080
        }
    },
    {
    logging: {
      level: 'DEBUG',
    }
  },
]);
```

or as rest parameters to the method:

```js
const app = await server({}, {
        server: {
            port: 8080
        }
    },
    {
    logging: {
      level: 'DEBUG',
    }
});
```

## kvikk/server: Server.start()

Async function to start a server instance. 

```js
const app = await server();
const address = await app.start();
```

Returns an (URL)[https://developer.mozilla.org/en-US/docs/Web/API/URL] object holding the address to the server.

## kvikk/server: Server.stop()

Async function to stop a server instance. 

```js
const app = await server();
const address = await app.start();

await app.stop();
```

## kvikk/test

The `kvikk/test` module provide an set of utilities which can be laveraged to make tesing of an application easier.

### config

A user config tuned for setting a server instance into a more test friendly state. 

The user config is setting the following user config:

 * `logging.level` - `silent` - Sets the logging to silent causing no log lines to be sendt to stdout preventing interference with the output of a test runner.
 * `server.port` - `0` - Sets the server to run on any available port. The port which the server starts on are available on the URL address object returned by `Server.start()`.

Example using the test config to start and stopp a server on any available port in a test:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { config } from 'kvikk/test';
import server from 'kvikk/server';

test('Server', async (t) => {
  const app = await server({}, config);
  const address = await app.start();

  await t.test('Route: ./', async () => {
    const response = await fetch(address);
    assert.equal(response.status, 200, 'Should result in an http status 200 response');
    
    // Body must be consumed, if not test will not exit
    await response.text();
  });

  await app.stop();
});
```