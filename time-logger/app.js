'use strict';
var angular = require('angular');
var moment = require('moment');
var ngModule = angular.module('time-logger', [require('angular-route')]);

ngModule.config(function($routeProvider) {
  $routeProvider.when('/:date', {
    template: '<time-logger></time-logger>'
  });
  $routeProvider.otherwise('/' + moment().format('YYYY-MM-DD'));
});

require('./time-logger.directive')(ngModule);
require('./time-logger-nav.directive')(ngModule);
require('./time-entries.directive')(ngModule);
require('./time-entry-form.directive')(ngModule);
require('./timeLogger.service')(ngModule);
require('./moment.filter')(ngModule);

module.exports = ngModule;
