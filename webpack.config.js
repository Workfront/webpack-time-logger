'use strict';
var path = require('path');
var NgAnnotatePlugin = require('ng-annotate-webpack-plugin');
var webpack = require('webpack');

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
      {test: /\.js$/, exclude: /node_modules/, loader: 'jshint-loader'}
    ],
    loaders: [
      {test: /\.css$/, loaders: ['style', 'css']},
      {test: /\.html$/, loader: 'raw'}
    ]
  },
  plugins: [
    new NgAnnotatePlugin({add: true}),
    new webpack.optimize.CommonsChunkPlugin('common.js')
  ],
  externals: {
    angular: true,
    'angular-route': '"ngRoute"',
    'moment': true
  }
};
