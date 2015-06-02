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
        return list.filter(function(entry) {
          return moment(entry.date, 'YYYY-MM-DD').isSame(date);
        });
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
