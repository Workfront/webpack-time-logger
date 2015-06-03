'use strict';
require('./time-logger-nav-style.css');
function TimeLoggerNavDirective() {
  return {
    restrict: 'E',
    templateUrl: 'time-logger/time-logger-nav.html',
    scope: {
      date: '='
    }
  };
}

module.exports = function(ngModule) {
  ngModule.directive('timeLoggerNav', TimeLoggerNavDirective);
};
