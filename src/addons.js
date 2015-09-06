var moment = require('moment');

var addons = {
  num: function (val) {
    return +val;
  },
  jParse: function (str) {
    return typeof str === 'object' ? str : JSON.parse(str);
  },
  timestamp: function (val) {
    if (+val + '' === val) {
      return +val;
    }
    return +moment(val).format('x') || 0;
  }
};
module.exports = addons;
