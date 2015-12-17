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

This error has occured because we have not made our Angular code minification safe by adding the appropriate Angular annotations. 
Webpack can perform this responsibility through the use of a Webpack loader:

* In a terminal, type `npm i ng-annotate-loader -DE`. This will install the necessary Webpack loader.
* In `webpack.config.js` make the following changes

```js
var path = require('path');

// ...
module: {
  loaders: [
  // Add this line
    {test: /\.js$/, loader: 'ng-annotate'},
    {test: /\.css$/, loaders: ['style', 'css']},
    {test: /\.html$/, loader: 'raw'}
  ]
}
```

* Save the file, then run `npm run watch`. Now reload the browser, and you'll see the running application.

NOTE: An earlier version of this tutorial recommended using `ng-annotate-webpack-plugin`. 
I now recommend `ng-annotate-loader` instead as it handles generated source maps correctly.

### Add Linting (tag: **linting**)

Webpack can execute JSHint with every file change using the Webpack loader that runs as a pre-loader.

* In a terminal, type `npm i jshint-loader jshint@2.8.0 -D`.
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

### Optimize the Application Using CommonsChunkPlugin (tag: **commons-chunk**)

* In the browser dev tools, look for the `time-logger.js` or `time-logger-2.js` file request. Notice that the size of the file is about 1.4MB. This file is too big, especially when both versions of the applications share mostly the same code. Let's combine the common code into a separate bundle.
* Before we make the changes, stop the webpack dev server and run `webpack` in the terminal. Observe how long it takes to run the webpack, and look at the files sizes. `time-logger-1.js` and `time-logger-2.js` should both be the same size, which is around 1.4MB.
* In `webpack.config.js`, make the following changes:

```js
var path = require('path');
// Add the next line.
var webpack = require('webpack');

// ...

plugins: [
// ... other plugin definitions
// Add this line.
  new webpack.optimize.CommonsChunkPlugin('common.js')
]
```

This will look through all of our entry points and combine any common code into a bundle called `common.js`.

Of course, we also need to tell the web page to load this file along with the app-specific bundle. This can be done a number of ways, but we're going to do by just adding a script tag to the HTML pages.

```html
<!-- index.html -->
<script src="common.js"></script> <!-- Add this line -->
<script src="time-logger.js"></script>
```

```html
<!-- index-2.html -->
<script src="common.js"></script> <!-- Add this line -->
<script src="time-logger-2.js"></script>
```

* Run `webpack` again. Notice that the build is not only slightly faster, but look at the file sizes. Since `time-logger-1.js` and `time-logger-2.js` contain the code unique to each app, they are very small. There is a new file now, `common.js`, that contains the bulk of the code. We made this optimization without changing a single line of application code!
* Run `npm run watch`, then refresh the browser window. In the browser dev tools, you should now see two requests: one for `common.js` and one for the time-logger app file (`time-logger-1.js` or `time-logger-2.js`, depending on which page you're on).

### Optimize the Application Using Externals (tag: **externals**)

In the last section, we improved reduced the amount of code that the application may need to load by combining common code into a single file. But, `common.js` is still pretty big (around 1.4MB). In this section, we'll look at reducing the code size through externals. In Webpack, externals are dependencies that are needed by your bundle, but will be provided to the bundle, rather than baked into the bundle.

Moment, Angular, and Angular-Route are dependencies that are not unique to our bundles, and our application may benefit from loading them from a CDN or some other source.

* In `webpack.config.js`, add an `externals` section with the following changes:

```js
  plugins: [
    // ... plugin definitions
  ],
  externals: {
    angular: true,
    'angular-route': '"ngRoute"',
    'moment': true
  }
```

We are telling Webpack to not include angular, angular-route, and moment in the bundle, and we are also telling Webpack how to access the externals. `angular: true` tells Webpack that the dependency is accessible on the global scope using the same name. So, it will access angular using the value `window.angular`. The same is true for moment.

The angular-route dependency is a little different. Angular-route normally returns the module name as the dependency, so that's what we're returning here.

* Since we told Webpack that we'd provide angular, angular-route, and moment, add them to the HTML pages:

```html
<!-- index.html -->
<script src="node_modules/angular/angular.js"></script>
<script src="node_modules/angular-route/angular-route.js"></script>
<script src="node_modules/moment/moment.js"></script>
<script src="common.js"></script>
<script src="time-logger.js"></script>
```

```html
<!-- index-2.html -->
<script src="node_modules/angular/angular.js"></script>
<script src="node_modules/angular-route/angular-route.js"></script>
<script src="node_modules/moment/moment.js"></script>
<script src="common.js"></script>
<script src="time-logger-2.js"></script>
```

* Run `webpack`. Notice how fast Webpack runs now (because it doesn't need to process angular, angular-route, or moment), and how much smaller the files are.
* Run `webpack -p`. The `-p` switch runs UglifyJS on the files after building them, which results in much smaller files. Look at the file sizes! NOTE: you might need to scroll back up a little bit to see the results. UglifyJS like to output a lot of junk. Just ignore it.
* Run `npm run watch` and refresh the browser to make sure your application still works!

