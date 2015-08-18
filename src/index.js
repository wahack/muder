var _ = require('lodash');
var fn = require('./functions');
var addons = require('./addons');


var muder =  function (source, mapper, addon) {
  var result = {};
  if (!_.isEmpty(addon)){
    _.assign(addons, addon);
  }
  _.forEach(mapper, function (ref, key) {
    result[key] = fn._map(source, ref);
  });
  return result;
};

module.exports = muder;
