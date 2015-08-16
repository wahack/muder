var addons = require('./addons');
var _ = require('lodash');


module.exports = {
  _map: function _map (source, mapper) {
    let result;
    if ( mapper instanceof Array) {
      result = [];
      _.forEach(mapper, ref => {
        if (typeof ref === 'string') {
          result.push(this._map(source, ref));
        } else {
          result.push(this._zipObject(_.mapValues(ref, val => this._map(source,val))));
        }
      });
      return _.flatten(result);
    }
    if (typeof mapper === 'object') {
      result = {};
      _.forEach(mapper, (ref, key) => {
        result[key] = this._map(source, ref);
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
  },
  /**
   * to zip the object
   * input: {a: [1,2,3], b: [4,5,6], c:1}
   * output: [{a:1,b:4,c:1}, {a:2,b:5,c:1}, {a:3,b:6,c:1}]
  */
  _zipObject: function _zipObject(ob) {
    let result = [], values, keys, keysLen, i, j, tmp, len = 0;
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
    let result = [], sourceChildArray, mapperChild;
    sourceChildArray = this._map(source, mapper.substr(0, mapper.indexOf('[]')));
    mapperChild = mapper.substr(mapper.indexOf('[]')+3);
    _.map(sourceChildArray, sourceChild => {
      result.push(this._map(sourceChild, mapperChild));
    });
    return result;
  },

  /**
   * get the value of passing object
  */
  _channel: function _channel (source, ref) {
    if (!ref) return source;
    // console.log(ref.split('|')[1]);
    return ref.split('|').length === 2 ?
      addons[ref.split('|')[1]]&&addons[ref.split('|')[1]](_.get(source,ref.split('|')[0]))
      : _.get(source,ref) || '';
  }
};
