'use strict';
require('./time-entries-style.css');
function TimeEntriesDirective(timeLogger) {
  return {
    restrict: 'E',
    scope: {
      date: '='
    },
    template: require('./time-entries.html'),
    bindToController: true,
    controllerAs: 'vm',
    /* @ngInject */
    controller: function($rootScope) {
      var vm = this;
      vm.entries = [];
      function refreshList() {
        timeLogger.getAllForDate(vm.date)
          .then(function(entries) {
            vm.entries = entries;
          });
      }

      refreshList();

      $rootScope.$on('newEntry', function() {
        refreshList();
      });
    }
  };
}

module.exports = function(ngModule) {
  ngModule.directive('timeEntries', TimeEntriesDirective);
};
