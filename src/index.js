var _ = require('lodash');
// var addons = require('./addons');

var muder =  function (source, mapper) {
  let result = {};
  _.forEach(mapper, (ref, key) => {
    result[key] = _map(source, ref);
  });
  return result;
};

function _map (source, mapper) {
  let result, tem={};
  if ( mapper instanceof Array) {
    result = [];
    _.forEach(mapper, ref => {
      if (typeof ref === 'string') {
        result.push(_map(source, ref));
      } else {
        result.push(_zipObject(_.mapValues(ref, val =>  _map(source,val))));
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
  let result = [], values, keys, keysLen, i = 0, j,tmp, len = 0;
  keys = _.keys(ob);
  keysLen = keys.length;
  values = _.values(ob);

  for (j =0; j < values.length; j++) {
    len = Math.max(len, typeof values[j]!=='string'&&values[j].length || 0);
  }
  for (j = 0; j < len; j++) {
    tmp = {};
    for (i =0; i< keysLen; i++){
      tmp[keys[i]] = ob[keys[i]].shift ? ob[keys[i]].shift()||'' : ob[keys[i]];
    }
    result.push(tmp);
  }
  return result;
}

// mapper formats: key.somearray[].key2
// return [key.somearray[0].key2, key.somearray[1].key2, ....]
function _dig(source, mapper) {
  let result = [], sourceChildArray, mapperChild;
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
}

module.exports = muder;
