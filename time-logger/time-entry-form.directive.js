'use strict';
require('./time-entry-form-style.css');
function TimeEntryFormDirective() {
  return {
    restrict: 'E',
    scope: {
      date: '='
    },
    template: require('./time-entry-form.html'),
    bindToController: true,
    controllerAs: 'vm',
    /* @ngInject */
    controller: function(timeLogger, momentFilter, $rootScope) {
      var vm = this;
      function createBlankEntry() {
        return {
          date: vm.date.format('YYYY-MM-DD'),
          time: momentFilter(new Date(), 'H:mm'),
          category: '',
          description: ''
        };
      }
      vm.newEntry = createBlankEntry();
      vm.addTimeEntry = function() {
        timeLogger.addTimeEntry(vm.newEntry)
          .then(function(newEntry) {
            $rootScope.$broadcast('newEntry', newEntry);
            vm.newEntry = createBlankEntry();
          });
      };
    }
  };
}

module.exports = function(ngModule) {
  ngModule.directive('timeEntryForm', TimeEntryFormDirective);
};
