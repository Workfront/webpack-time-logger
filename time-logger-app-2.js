/* global document */
'use strict';
var angular = require('angular');
var appElement = document.querySelector('body');
angular.bootstrap(appElement, [
  require('./time-logger/app-2').name
], { strictDi: true });
