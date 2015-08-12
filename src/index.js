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
  var result;
  if ( mapper instanceof Array) {
    result = [];
    _.forEach(mapper, ref => {
      result.push(_map(source, ref));
    });
    return _.flatten(result);
  }
  if (typeof mapper === 'object') {
    result = {};
    _.forEach(mapper, (ref, key) => {
      result[key] = _map(source, ref);
    });
    return result;
  }
  if (typeof mapper === 'string') {
    return _channel (source, mapper);
  }
}

function _arrTrans (ob) {
  var result = [];
  _.forEach(ob, (ref, key) => {
    
  });
  return result;
}


function _channel (source, ref) {
  return ref.split('|').length === 2 ?
    addons[ref.split('|')[1]](_.get(source,ref))
    : _.get(source,ref) || '';
}

module.exports = muder;
