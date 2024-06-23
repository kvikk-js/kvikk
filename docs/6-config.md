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

The config is used by both the Kvikk.js server and the assets build process. The kvikk.config.js file will not be bundled up into the browser asset bundle.

## Directories
 
The `directories` object control the directory structure on the file system of an application.

```js
export default [
  {
    directories: {
      src: './',
      components: './components',
      layouts: './layouts',
      public: './public',
      system: './system',
      build: './build',
      pages: './pages',
      css: './css',
      js: './js',
    },
  },
];
```

All values must be relative paths relative to the root of the application.

### src

Defines a source directory for all the other directories. Defaults to `./`.

The value must be a relative path.

This can be used if one want to group all application directories into a separate directory instead of having all directories at the root of the application.

Example:

If `src` is configured to `./source` the application directory structure will be as follow:

```sh
|--/package.json
|--/kvikk.config.js
|--/source
|  |--/components
|  |--/layouts
|  |--/public
|  |--/system
|  |--/pages
|  |  |--/page.js
|  |  |--/api
|  |  |  |--/route.js
|  |--/build
|  |  |--/css
|  |  |--/js
```

### components

Defines the directory for Components. Defaults to `./components`.

The value must be a relative path.

If `src` is configured, the value for this property will be prefixed with the value from `src`. 

### layouts

Defines the directory for Layouts. Defaults to `./layouts`.

The value must be a relative path.

If `src` is configured, the value for this property will be prefixed with the value from `src`. 

### public

Defines the directory for "public" static files. Defaults to `./public`.

The value must be a relative path.

If `src` is configured, the value for this property will be prefixed with the value from `src`. 

### system

Defines the directory for System files. Defaults to `./system`.

The value must be a relative path.

If `src` is configured, the value for this property will be prefixed with the value from `src`. 

### build

Defines the directory for built files. Defaults to `./build`.

The value must be a relative path.

If `src` is configured, the value for this property will be prefixed with the value from `src`. 

### pages

Defines the directory for the Page router. Defaults to `./pages`.

The value must be a relative path.

If `src` is configured, the value for this property will be prefixed with the value from `src`. 

### css

Defines the directory for built css files. Defaults to `./build/css`.

The value must be a relative path.

This folder is relative to the `directories.build` folder. For example; if `css` is configured to `./styles` the folder will be `./build/styles`.

### js

Defines the directory for built js files. Defaults to `./build/js`.

The value must be a relative path.

This folder is relative to the `directories.build` folder. For example; if `js` is configured to `./scripts` the folder will be `./build/scripts`.


## Paths

The `paths` object control the URL structure of an application.

```js
export default [
  {
    paths: {
      base: '/',
      public: '/public',
    },
  },
];
```

### base

Defines a base prefix to apply to all routes in the application. Defaults to `/`.

This makes it possible to deploy an application at a sub-path of a domain. If you, as an example, configure `base` to `/my-app` the root of your application will be at `http://localhost:4000/my-app` and all other routes will live under this path.

### public

Defines the URL path for the "public" static files. Files stored in the directory configured for `directories.public` will be served on this path.

Defaults to `/public`.


## Environment variables

Kvikk.js comes with built-in support for environment variables.