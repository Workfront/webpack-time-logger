'use strict';
var angular = require('angular');
var moment = require('moment');
var uuid = require('uuid');
function TimeLoggerService($q, $window) {
  var localStorage = $window.localStorage;
  var listKey = '$TIME-ENTRIES$';

  function load() {
    return localStorage.getItem(listKey) ? angular.fromJson(localStorage.getItem(listKey)) : [];
  }

  function persist(list) {
    localStorage.setItem(listKey, angular.toJson(list));
    return list;
  }

  function getAll() {
    return $q.when(load());
  }

  function addTimeEntry(entry) {
    var entryWithId = angular.copy(entry);
    entryWithId.id = uuid.v4();
    return getAll()
      .then(function (list) {
        list.push(entryWithId);
        persist(list);
        return entryWithId;
      });
  }

  function getAllForDate(date) {
    return getAll()
      .then(function(list) {
        var results = list.filter(function(entry) {
          return moment(entry.date, 'YYYY-MM-DD').isSame(date);
        });
        results.sort(function(entry1, entry2) {
          var time1 = moment(entry1.time, 'hh:mm');
          var time2 = moment(entry2.time, 'hh:mm');
          if (time1.isBefore(time2)) {
            return -1;
          } else if (time2.isBefore(time1)) {
            return 1;
          } else {
            return 0;
          }
        });
        return results;
      });
  }

  return {
    getAll: getAll,
    getAllForDate: getAllForDate,
    addTimeEntry: addTimeEntry
  };
}

module.exports = function (ngModule) {
  ngModule.factory('timeLogger', TimeLoggerService);
};
