'use strict';
require('./time-entry-smart-style.css');
function TimeEntrySmartDirective() {
  return {
    restrict: 'E',
    scope: {
      date: '='
    },
    template: require('./time-entry-smart.html'),
    bindToController: true,
    controllerAs: 'vm',
    /* @ngInject */
    controller: function(timeLogger, momentFilter, $rootScope) {
      var vm = this;
      vm.entryPattern = /^(((1?[0-9]|2[0-3]):[0-5][0-9])\s+)?(#(.*?)\s+)?(.*?)\s*$/;
      vm.entryText = '';
      vm.addTimeEntry = function() {
        var matches = vm.entryPattern.exec(vm.entryText);
        var timeEntry = {
          date: vm.date.format('YYYY-MM-DD'),
          time: matches[2] || momentFilter(new Date(), 'H:mm'),
          category: matches[5],
          description: matches[6]
        };
        timeLogger.addTimeEntry(timeEntry)
          .then(function(newEntry) {
            $rootScope.$broadcast('newEntry', newEntry);
            vm.entryText = '';
          });
      };
    }
  };
}

module.exports = function(ngModule) {
  // NOTE: named the same as the old directive since we're using it in the same place
  ngModule.directive('timeEntryForm', TimeEntrySmartDirective);
};
