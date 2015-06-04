# webpack-time-logger
A sample application used to understand Webpack.

## Quick Start

* Checkout this repository
* run `npm install`

## Work through the tutorial

The following sections walk through a tutorial using Webpack to build, enhance, and fix issues common in web application development. Each step builds on the previous steps, so you should work through them in order. To start the tutorial, simple checkout the **tutorial-start** tag. NOTE: once you complete the first section, you will have a working application to play with. If you want to start working at a particular step, simply checkout the tag associated with that step (listed in the section title), and run `npm install` to make sure that you have all of the dependencies for that step. The final tag is **tutorial-end**.

### Making our Angular code minification-safe. (tag: **tutorial-start** or **minsafe**)

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

### Add Linting (tag: **linting**)

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

### Embed HTML Partials in Bundle (tag: **html-partial**)

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

### Adding Multiple Entry Points (tag: **multiple-entries**)

Our client has asked for a new feature. Instead of having and entry form with three fields at the bottom of the time logger, they would also like a page where people can enter data for all three fields using a simple input field. If they enter no time field, then it will default to the current time (rounded to the minute). If they add some text that includes the hash "#" tag, that will be a category. Finally, the rest of the input will be the description.

#### What Do We Already Have?

We already have the code to implement this feature in our source code. The entry point for the new feature is found in `time-logger-app-2.js`, pointing to the new version of the application (`app-2.js`). `app-2.js` replaces the reference to the current Angular entry form directive (`time-entry-form.directive.js`) with the "smart" version (`v2/time-entry-smart.directive.js`). 

#### What Do We Need to Do?

We simply need to tell Webpack to build the new entry point in addition to the current entry point. Change the entry and output sections in `webpack.config.js` to look like the following:

```js
  entry: {
    'time-logger': './time-logger-app.js',
    'time-logger-2': './time-logger-app-2.js'
  },
  output: {
    path: path.join(__dirname),
    filename: '[name].js'
  },
```

We have told Webpack that we have two entry points: `./time-logger-app.js` and `./time-logger-app-2.js`, and have named the bundles `time-logger` and `time-logger-2`, respectively. We are using one of Webpack's metadata properties, `[name]` to tell Webpack to use the bundle name property as the filename. So, we end up with two bundle output files: `time-logger.js` and `time-logger-2.js`.

* Run `npm run watch`, and refresh your browser. The app should work as before.
* Navigate to `http://localhost:8080/index-2.html`. You should see the same time logger with the "smart" entry form.
