var addons = require('./addons');
var _ = require('lodash');


module.exports = {
  _map: function _map (source, mapper) {
    var result, self = this;
    if (_.isEmpty(mapper)) return mapper;
    if ( mapper instanceof Array) {
      result = [];
      _.forEach(mapper, function (ref) {
        if (typeof ref === 'string') {
          result.push(self._map(source, ref));
        } else {
          result.push(self._zipObject(_.mapValues(ref, function (val){
            return self._map(source,val);
          })));
        }
      });
      return _.flatten(result);
    }
    if (typeof mapper === 'object') {
      result = {};
      _.forEach(mapper, function (ref, key){
        result[key] = self._map(source, ref);
      });
      return result;
    }
    if (typeof mapper === 'string') {
      if (/\[\]/.test(mapper)) {
        return this._dig(source, mapper);
      }
      return this._channel (source, mapper);
    }
    if (typeof mapper === 'function') {
      return mapper(source);
    }
    if (typeof mapper === 'number') {
      return mapper;
    }
    return mapper;
  },
  /**
   * to zip the object
   * input: {a: [1,2,3], b: [4,5,6], c:1}
   * output: [{a:1,b:4,c:1}, {a:2,b:5,c:1}, {a:3,b:6,c:1}]
  */
  _zipObject: function _zipObject(ob) {
    var result = [], values, keys, keysLen, i, j, tmp, len = 0;
    keys = _.keys(ob);
    keysLen = keys.length;
    values = _.values(ob);

    for (j =0; j < values.length; j++) {
      len = Math.max(len, typeof values[j]!=='string'&&values[j].length || 0);
    }
    for (j = 0; j < len; j++) {
      tmp = {};
      for (i = 0; i< keysLen; i++){
        tmp[keys[i]] = ob[keys[i]].shift ? ob[keys[i]].shift()||'' : ob[keys[i]];
      }
      result.push(tmp);
    }
    return result;
  },

  /**
   * transform the mapper contains [] to array
   * input: key1.keyarray[].key2
   * output: [key1.keyarray[0].key2, key1.keyarray[1].key2,... ]
  */
  _dig: function _dig(source, mapper) {
    var result = [], self = this, sourceChildArray, mapperChild;
    sourceChildArray = this._map(source, mapper.substr(0, mapper.indexOf('[]')));
    mapperChild = mapper.substr(mapper.indexOf('[]')+3);
    _.map(sourceChildArray, function (sourceChild) {
      result.push(self._map(sourceChild, mapperChild));
    });
    return result;
  },

  /**
   * get the value of passing object
  */
  _channel: function _channel (source, ref) {
    var addOn, result;
    if (!ref) return source;
    addOn = addons[ref.split('|')[1]];
    result =  ref.split('|').length === 2 ? _.get(source,ref.split('|')[0]) : _.get(source,ref);
    result = result === undefined ? '' : result;
    return addOn ? addOn(result) : result;
  }
};
