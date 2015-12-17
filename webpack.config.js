'use strict';
var path = require('path');

module.exports = {
  context: path.join(__dirname),
  entry: './time-logger-app.js',
  output: {
    path: path.join(__dirname),
    filename: 'time-logger.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {test: /\.css$/, loaders: ['style', 'css']},
      {test: /\.html$/, loader: 'raw'}
    ]
  }
};
