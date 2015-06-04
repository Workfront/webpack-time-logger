'use strict';
var path = require('path');
var NgAnnotatePlugin = require('ng-annotate-webpack-plugin');

module.exports = {
  context: path.join(__dirname),
  entry: './time-logger-app.js',
  output: {
    path: path.join(__dirname),
    filename: 'time-logger.js'
  },
  devtool: 'source-map',
  module: {
    preLoaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'jshint-loader'}
    ],
    loaders: [
      {test: /\.css$/, loaders: ['style', 'css']},
      {test: /\.html$/, loader: 'raw'}
    ]
  },
  plugins: [
    new NgAnnotatePlugin({add: true})
  ]
};
