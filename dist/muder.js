(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("muder", [], factory);
	else if(typeof exports === 'object')
		exports["muder"] = factory();
	else
		root["muder"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var helper = __webpack_require__(2);
	var fn = __webpack_require__(3);
	var addons = __webpack_require__(4);


	var muder =  function (source, mapper, addon) {
	  var result = {};
	  if (!helper.is.Empty(addon)){
	    helper.assign(addons, addon);
	  }
	  helper.keys(mapper).forEach(function (key) {
	    result[key] = fn._map(source, mapper[key]);
	  });
	  return result;
	};

	module.exports = muder;


/***/ },
/* 2 */
/***/ function(module, exports) {

	var is = (function () {
	  var is = {};
	  ['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'].forEach(function (name) {
	    is[name] = function (obj) {
	      return Object.prototype.toString.call(obj) === '[object '+name+']';
	    };
	  });
	  is.Array = function (obj) {
	    return Array.isArray(obj) || Object.prototype.toString.call(obj) === '[object Array]';
	  };
	  is.Object = function (obj) {
	    var type = typeof obj;
	    return type === 'function' || type === 'object' && !!obj;
	  };

	  is.Empty = function (value) {
	    if (value === null) return true;
	    if (is.Array(value) || is.String(value)) return value.length === 0;
	    return _keys(value).length === 0;
	  };
	  return is;
	}());

	function _keys(obj) {
	    if (!is.Object(obj) || typeof obj === 'function') return [];
	    if (Object.keys) return Object.keys(obj);
	    var keys = [];
	    for (var key in obj) keys.push(key);
	    return keys;
	}
	function _values(obj) {
	  var values = [];
	  _keys(obj).forEach(function (key) {
	    values.push(obj[key]);
	  });
	  return values;
	}
	function assign(obj, targetObj) {
	  if (Object.assign) return Object.assign(obj, targetObj);
	  var targetKeys = _keys(targetObj);
	  targetKeys.forEach(function (key) {
	    obj[key] = targetObj[key];
	  });
	  return obj;
	}
	function get(obj, chain) {
	  var result, scope = obj;
	  chain = (chain||'').split('.');
	  while (chain.length && scope) {
	    var key = chain.shift();
	    if (Object.hasOwnProperty.call(scope,key) && !is.Array(scope) && !is.String(scope)) {
	      scope = scope[key];
	    } else {
	      scope = void(0);
	    }
	  }
	  return scope;
	}
	function mapValues(obj,cb) {
	  var result = {};
	  _keys(obj).forEach(function (key) {
	    result[key] = (cb(obj[key]));
	  });
	  return result;
	}

	function flattenDeep(array) {
	  var result = [];
	  array.forEach(function (value) {
	    if (is.Array(value)) {
	      result = result.concat(flattenDeep(value));
	    } else {
	      result.push(value);
	    }
	  });
	  return result;
	}

	module.exports =  {
	  is: is,
	  assign: assign,
	  keys: _keys,
	  values: _values,
	  mapValues: mapValues,
	  flattenDeep: flattenDeep,
	  get: get
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var addons = __webpack_require__(4);
	var helper = __webpack_require__(2);

	module.exports = {
	  _map: function _map (source, mapper) {
	    var result, self = this;
	    if (mapper === '') return source;
	    if (helper.is.Empty(mapper) && typeof mapper !== 'function' && typeof mapper !== 'number') return mapper;
	    if ( mapper instanceof Array) {
	      result = [];
	      mapper.forEach(function (ref) {
	        if (typeof ref === 'string') {
	          result.push(self._map(source, ref));
	        } else {
	          result.push(self._zipObject(helper.mapValues(ref, function (val){
	            return self._map(source,val);
	          })));
	        }
	      });
	      return helper.flattenDeep(result);
	    }
	    if (typeof mapper === 'object') {
	      result = {};
	      helper.keys(mapper).forEach(function (key){
	        result[key] = self._map(source, mapper[key]);
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
	    keys = helper.keys(ob);
	    keysLen = keys.length;
	    values = helper.values(ob);

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

	    sourceChildArray.forEach(function (sourceChild) {
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
	    result =  ref.split('|').length === 2 ? helper.get(source,ref.split('|')[0]) : helper.get(source,ref);
	    result = result === undefined ? '' : result;
	    return addOn ? addOn(result) : result;
	  }
	};


/***/ },
/* 4 */
/***/ function(module, exports) {

	// var moment = require('moment');

	var addons = {
	  num: function(val) {
	    return +val;
	  },
	  // timestamp: function(val) {
	  //   if (+val + '' === val) {
	  //     return +val;
	  //   }
	  //   return +moment(val).format('x') || 0;
	  // },
	  bool: function(val) {
	    if (val === '0' || val === 'false') {
	      return false;
	    }
	    return !!val;
	  }
	};

	module.exports = addons;


/***/ }
/******/ ])
});
;