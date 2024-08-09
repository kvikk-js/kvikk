# Middleware

A middleware is an asyncronus function which is invoked server side before each `page`, `action` or `route` if provided. Middlewares have access to read values from the inbound request, such as Search Query Parameters, URL parameters and Headers, and can set values on the response, such as HTTP status code, Headers etc.

In a middleware one can also fetch data from a backend API or a database and the main purpose of a middleware is to populate data and pass it on for rendering or alter the response of a request before a render.

Simple example of a middleware which reads the search query parameter `text` and forwards it to a page:

```js
export const middleware = async (request, response) => {
  const text = request.searchParams.get('text');
  return {
    text,
  };
};
```

Use the data from the middleware in a `page`:

```js
export default (props = {}) => {
  return html`
    <p>Search text is: ${props.text}.</p>
  `;
};
```

In this example the returned object in the `middleware` function is available on the `props` argument on the function in the `page`.

## Middleware levels

There are two levels of middleware in Hubro; Global level and route level. Both levels is written the in the same way.

### Global level

Global level middleware will run on all requests except the routes and files under the static endpoint and the routes used for providing local development features (such as the script and css HTTP endpoints).

The global level middleware is defined by a `middleware.js|ts` in the `./system/` folder:

```sh
|--/package.json
|--/hubro.config.js
|--/system
|  |--/middleware.js
|--/pages
|  |--/page.js
```

The global level middleware is an ideal place to do operations one want to do on every route.

### Router level

Router level middlewares will run for the HTTP route it is defined for. The routes level middleware will run after the global level middleware and have access to the properties set by the globel middleware and can override these properties if needed.

The route level middlewares is defined by a `middleware.js|ts` in the folder of the route it should be applied too or as a inline `middleware` function in the `page`, `action` or `route` file:

```sh
|--/package.json
|--/hubro.config.js
|--/pages
|  |--/page.js
|  |--/middleware.js
|  |--/[slug]
|  |  |--/page.js
|  |  |--/middleware.js
```

The route level middleware is an ideal place to do operations one want to do on only selected routes.

## Middleware and validation

TO BE IMPLEMENTED

## Writing middleware



## Inline middleware

The route level middlewares can be defined by a `middleware.js|ts` in the folder of the route it should be applied too OR as and inlined middleware.

An inline `middleware` is defined by exporting an async function with the name `middleware` in the `page`, `action` or `route` file.

Example of an inline middleware in an `action` file:

```js
export const middleware = async (request, response) => {
  return {
    type: 'owl',
  };
};

export default async (request, response) => {
  const { type } = request.context;
  response.headers.append('x-hubro', type);
};
```

For most projects its recommended to keep middlewares in separate middeware files over inlining middlewares. The use case for inlining is mostly that is can reduce the amount of files in larger projects.

### Pages and Inline middleware

Its important to be aware that inlining middleware in `pages` come with some danger. Middlewares are functions which are invoked server side and are intended to only be used on the server.

On the other hand `pages` are web components which is intended to be able to be rendered in a browser while also being able to be server side rendered. When a Hubro application is built with the `hubro build` command `pages` are built into the client side browser bundle which is being served to end users.

In the build process inline middlewares in a `page` will be removed by default tree shaking in the build step so under normal circumstances middlewares should not end up into the client side browser bundle. 

BUT; its fully possible to break this default tree shaking causing the server side code in the middleware to end up in the client side browser bundle. This will affect bundle side and also has security aspect with it since its exposing server side code to the public.

### Actions and Routes and Inline middleware

Inlining middeware in `actions` and `routes` does not face the same challenge as inlining middeware in `pages`. Both `actions` and `routes` are invoked only on the server so inlining middleware in these does not expose the same danger of bundling up server side code into a browser bundle such as with `pages`.

### Precedence

If a `page`, `action` or `route` has a inline `middleware` function, this middleware has a higher precedence than a middleware file in the same folder. 

In the case where ex a `page` has a inline middleware and there is a middleware file in the same folder, the middleware file will not be loaded and only the inline middleware will be applied to the `page`.