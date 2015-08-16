var _ = require('lodash');
var fn = require('./functions');
var addons = require('./addons');


var muder =  function (source, mapper, addon) {
  let result = {};
  if (!_.isEmpty(addon)){
    _.assign(addons, addon);
  }
  _.forEach(mapper, (ref, key) => result[key] = fn._map(source, ref));
  return result;
};

module.exports = muder;
