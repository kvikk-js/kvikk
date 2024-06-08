# Config

A Kvikk.js application can be configured through a kvikk.config.js file in the root of the project. The kvikk.config.js is a ESM module which exports an Array of config objects as default. 

Example of configuring logging to log on debug level but not log requests and turn compression off:

```js
export default [
  // Logging
  {
    logging: {
      requests: false,
      level: 'DEBUG',
    }
  },

  // Compression
  {
    compression: {
      enable: false,
    }
  }
];
```

The config is used by both the Kvikk.js server and the browser assets build process. The kvikk.config.js file will not be bundled up into the browser asset bundle.


## Environment variables

Kvikk.js comes with built-in support for environment variables.