var _ = require('lodash');
// var addons = require('./addons');

var muder =  function (source, mapper) {
  var result = {};
  _.forEach(mapper, (ref, key) => {
    result[key] = _map(source, ref);
  });
  return result;
};

function _map (source, mapper) {
  var result = {};
  if (typeof mapper === 'object') {
    _.forEach(mapper, (ref, key) => {
      result[key] = _map(source, ref);
    });
    return result;
  }
  if (typeof mapper === 'array') {
    return;
  }
  if (typeof mapper === 'string') {
    return _channel (source, mapper);
  }
}

function _channel (source, ref) {
  return ref.split('|').length === 2 ?
    addons[ref.split('|')[1]](_.get(source,ref))
    : _.get(source,ref) || '';
}

module.exports = muder;
