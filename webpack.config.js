'use strict';
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
var path = require('path');

module.exports = {
  context: path.join(__dirname),
  entry: {
    'time-logger': './time-logger-app.js',
    'time-logger-2': './time-logger-app-2.js'
  },
  output: {
    libraryTarget: 'umd',
    path: path.join(__dirname),
    filename: '[name].js'
  },
  devtool: 'source-map',
  module: {
    preLoaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'jshint-loader'}
    ],
    loaders: [
      { test: /\.html$/, loader: 'raw'}
    ]
  },
  jshint: {
    failOnHint: true
  },
  plugins: [
    new ngAnnotatePlugin({ add: true})
  ]
};
