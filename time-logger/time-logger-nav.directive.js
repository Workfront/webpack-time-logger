'use strict';
require('./time-logger-nav-style.css');
function TimeLoggerNavDirective() {
  return {
    restrict: 'E',
    //templateUrl: 'time-logger/time-logger-nav.html',
    template: require('./time-logger-nav.html'), // require the HTML into the bundle.
    scope: {
      date: '='
    }
  };
}

module.exports = function(ngModule) {
  ngModule.directive('timeLoggerNav', TimeLoggerNavDirective);
};
