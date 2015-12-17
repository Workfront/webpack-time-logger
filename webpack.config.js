'use strict';
var path = require('path');

module.exports = {
  context: path.join(__dirname),
  entry: {
    'time-logger': './time-logger-app.js',
    'time-logger-2': './time-logger-app-2.js'
  },
  output: {
    path: path.join(__dirname),
    filename: '[name].js'
  },
  devtool: 'source-map',
  module: {
    preLoaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'jshint-loader' }
    ],
    loaders: [
      {test: /\.js$/, loader: 'ng-annotate'},
      {test: /\.css$/, loaders: ['style', 'css']},
      {test: /\.html$/, loader: 'raw'}
    ]
  }
};
