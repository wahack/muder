var addons = {
  num: function (val) {
    return +val;
  },
  jParse: function (str) {
    return typeof str === 'object' ? str : JSON.parse(str);
  },
  timestamp: function (time) {
    return 's';
  }
};
module.exports = addons;
