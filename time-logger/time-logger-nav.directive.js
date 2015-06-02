'use strict';
require('./time-logger-nav-style.css');
function TimeLoggerNavDirective() {
  return {
    restrict: 'E',
    template: require('./time-logger-nav.html'),
    scope: {
      date: '='
    }
  };
}

module.exports = function(ngModule) {
  ngModule.directive('timeLoggerNav', TimeLoggerNavDirective);
};
