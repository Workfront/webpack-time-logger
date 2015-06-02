/* global document */
'use strict';
var angular = require('angular');
var appElement = document.querySelector('body');
angular.bootstrap(appElement, [
  require('./time-logger/app').name
], { strictDi: true });
