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
  var result, tem={};
  if ( mapper instanceof Array) {
    result = [];
    _.forEach(mapper, ref => {
      if (typeof ref === 'string') {
        result.push(_map(source, ref));
      } else {
        _.mapValues(ref, val =>  _map(source,val));
        });
      }

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
    if (/\[\]/.test(mapper)) {
      return _dig(source, mapper);
    }
    return _channel (source, mapper);
  }
}
//
function _zipObject(ob) {
  var result = [], values, keys, i = 0, tmp;
  keys = _.keys(ob);
  values = _.values(ob);

  for (var j =0; j < values.length; j++) {
    tmp = [];
    values[j].shift();

  }
  _.forEach(values, val => {
    tmp = {};
    for (i = 0; i< val.length; i++) {
      tmp[keys[i]] = val[i];
    }
    result.push(tmp);
  });
  return result;
}

// mapper formats: key.somearray[].key2
// return [key.somearray[0].key2, key.somearray[1].key2, ....]
function _dig(source, mapper) {
  var result = [];
  var sourceChildArray, mapperChild;
  sourceChildArray = _map(source, mapper.substr(0, mapper.indexOf('[]')));
  mapperChild = mapper.substr(mapper.indexOf('[]')+3);
  _.map(sourceChildArray, sourceChild => {
    result.push(_map(sourceChild, mapperChild));
  });
  return result;
}

function _channel (source, ref) {
  if (!ref) return source;
  return ref.split('|').length === 2 ?
    addons[ref.split('|')[1]](_.get(source,ref))
    : _.get(source,ref) || '';
};

module.exports = _dig;
