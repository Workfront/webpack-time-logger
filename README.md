# webpack-time-logger
A sample application used to understand Webpack.

## Quick Start

* Checkout this repository
* run `npm install`

## Work through the tutorial

### Making our Angular code minification-safe.

From a terminal run `npm run watch`. Open a browser to `http://localhost:8080/`. Nothing should show up.

Open up your browser's developer tools. Observe that there is the following error in the browser console: 

> Uncaught Error: [$injector:modulerr] Failed to instantiate module time-logger due to:
Error: [$injector:strictdi] function($routeProvider) is not using explicit annotation and cannot be invoked in strict mode

This error has occured because we have not made our Angular code minification safe by adding the appropriate Angular annotations. Webpack can perform this responsibility for use automatically through the use of a Webpack plugin:

* In a terminal, type `npm i ng-annotate-webpack-plugin -D`. This will install the necessary plugin.
* In `webpack.config.js` make the following changes

```js
var path = require('path');
// Add the following line
var NgAnnotatePlugin = require('ng-annotate-webpack-plugin');

// ...
module: {
// ...
},
// Add this right after module section of config
plugins: [
  new NgAnnotatePlugin({add: true})
]
```

* Save the file, then run `npm run watch`. Now reload the browser, and you'll see the running application.

### Add Linting

Webpack can execute JSHint with every file change using the Webpack loader that runs as a pre-loader.

* In a terminal, type `npm i jshint-loader -D`.
* In `webpack.config.js`, add a preloaders section preceding the loaders section, like so:

```js
module: {
  // Add this preLoaders section
  preLoaders: [
    { test: /\.js$/, exclude: /node_modules/, loader: 'jshint-loader' }
  ],
  loaders: [
  // ... some loaders
  ]
}
```

* Save the file, then run `npm run watch`. Observe that it finds a linting error, a missing semicolon, in `timeLogger.service.js`, line 51.
* Go to the file with the error, add the necessary semicolon, and then run `npm run watch` again. Observe that there are no more linting errors!

