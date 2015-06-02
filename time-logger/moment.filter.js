'use strict';
var moment = require('moment');
function MomentFilter() {
  return function(value, format) {
    // TODO add a default format
    if (moment.isMoment(value)) {
      return value.format(format);
    } else if (moment.isDate(value)) {
      return moment(value).format(format);
    } else {
      return '';
    }
  };
}

module.exports = function(ngModule) {
  ngModule.filter('moment', MomentFilter);
};
