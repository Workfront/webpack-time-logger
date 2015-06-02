'use strict';
require('./time-logger-style.css');
var moment = require('moment');
function TimeLoggerDirective() {
  return {
    restrict: 'E',
    template: require('./time-logger.html'),
    controllerAs: 'vm',
    /* @ngInject */
    controller: function($routeParams) {
      var vm = this;
      vm.selectedDate = moment($routeParams.date, 'YYYY-MM-DD');
    }
  };
}

module.exports = function(ngModule) {
  ngModule.directive('timeLogger', TimeLoggerDirective);
};
