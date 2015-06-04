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

### Embed HTML Partials in Bundle

* In the browser dev tools, observe that your browser makes two requests: one for `time-logger.js` (the bundle), and one for `time-logger-nav.html` (NOTE: you may need to reload the browser page to see the two files). `time-logger-nav.html` is the HTML partial for the navigation bar at the top of the application. Since it's a necessary part of the application, we would like to include it in the bundle.

* Open `time-logger/time-logger-nav.directive.js` in your editor. Make the following change: 

```js
function TimeLoggerNavDirective() {
  return {
    restrict: 'E',
    //templateUrl: 'time-logger/time-logger-nav.html',
    template: require('./time-logger-nav.html'), // require the HTML into the bundle.
    scope: {
      date: '='
    }
  };
}
```

* The browser window should have reloaded when you made this change, and you should only see the request for `time-logger.js` in the browser dev tools.

#### Why Did this Work?

* Open `webpack.config.js`. Notice that we have the following loader rule:

```js
loaders: [
      // ... other loaders
      {test: /\.html$/, loader: 'raw'}
    ]
```

This tells Webpack to load HTML files using the raw loader. The raw loader simply loads the file contents and returns it as a string.
