//
// Basic Extensions :: String
//

String.prototype.endsWith = function(suffix) {
  return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

var APP_base = APP_base || {};

(function() {

  var counter = 0;
  var logFn;

  //
  // NEW ID
  //
  /**
   * @memberOf APP_base
   */
  function newId() {
    return counter++;
  }
  APP_base.newId = newId;

  //
  // IS EMPTY
  //
  /**
   * @memberOf APP_base
   */
  function isEmpty(arg) {
    if (arg === undefined || arg === null || arg === '') {
      return true;
    }
    if (_.isArray(arg)) {
      return arg.length === 0 ? true : false;
    }
    if (_.isObject(arg)) {
      return _.size(arg) === 0 ? true : false;
    }
    return false;
  }
  APP_base.isEmpty = isEmpty;

  /**
   * @memberOf APP_base
   */
  function sortObjectArray(objectArray, getCompareStringFun) {
    objectArray
        .sort(function(a, b) {
          var nameA = getCompareStringFun(a).toLowerCase(), nameB = getCompareStringFun(
              b).toLowerCase();
          if (nameA < nameB) // sort string ascending
            return -1;
          if (nameA > nameB)
            return 1;
          return 0; // default return value (no sorting)
        });
  }
  APP_base.sortObjectArray = sortObjectArray;

  //
  // ORD
  //
  /**
   * @memberOf APP_base
   */
  function ord(arg0) {
    var i, res;
    if (_.isString(arg0)) {
      res = arg0.split('.');
      return res;
    }
    if (_.isArray(arg0)) {
      res = arg0.join('.');
      return res;
    }
  }
  APP_base.ord = ord;

  //
  // ORD SORT
  //
  /**
   * @memberOf APP_base
   */
  function ordSort(arg0, arg1) {
    var i, res;
    arg1 = arg1 || 'ord';
    if (_.isArray(arg0)) {
      arg0.sort(function(a, b) {

      });
    }
  }

  //
  // VALUE 2
  //
  /**
   * @memberOf APP_base
   */
  function getValue2(object, navigationalName) {
    var name, names = navigationalName.split(".");
    var i;
    var value = object;
    for (i = 0; i < names.length; i++) {
      if (!_.isObject(value)) {
        return;
      }
      name = names[i];
      value = value[name];
    }
    return value;
  }
  APP_base.getValue2 = getValue2;

  //
  // GROUP BY
  //
  /**
   * @memberOf APP_base
   */
  function groupBy(objectArray, attributeName) {
    var map = {}, i, o, t;
    if (_.isArray(objectArray)) {
      for (i = 0; i < objectArray.length; i++) {
        o = objectArray[i];
        t = map[o[attributeName]];

        if (_.isArray(t)) {
          t.push(o);
        } else {
          map[o[attributeName]] = [ o ];
        }
      }
    }
    return map;
  }
  APP_base.groupBy = groupBy;

  //
  // INDEXER
  //
  /**
   * @memberOf APP_base
   */
  function indexer(array) {
    var indexer = {};
    var i;
    for (i = 0; i < array.length; i++) {
      indexer[array[i]] = i;
    }
    return indexer;
  }
  APP_base.indexer = indexer;

  /**
   * @memberOf APP_base
   */
  APP_base.languages = [ [ 'de', 'Deutsch' ], [ 'en', 'English' ],
      [ 'it', 'Italiano' ], [ 'fr', 'Francais' ], [ 'es', 'Espaniol' ] ];

  //
  // Date / Calendar functions
  //
  /**
   * @memberOf APP_base
   */
  APP_base.weekDayNames = [ 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun' ];

  /**
   * @memberOf APP_base
   */
  APP_base.monthNames = [ 'jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul',
      'aug', 'sep', 'oct', 'nov', 'dec' ];

  /**
   * @memberOf APP_base
   */
  APP_base.monthLongNames = [ 'january', 'february', 'march', 'april', 'mai',
      'june', 'july', 'august', 'september', 'october', 'november', 'december' ];

  /**
   * @memberOf APP_base
   */
  function toIsoYearMonth(date) {
    if (date === undefined) {
      date = new Date();
    }
    var monthStr = ("-" + (date.getMonth() + 101)).substring(2);
    return date.getFullYear() + "-" + monthStr;
  }
  APP_base.toIsoYearMonth = toIsoYearMonth;

  /**
   * @memberOf APP_base
   */
  function toIsoDate(date) {
    if (_.isString(date)) {
      date = new Date(window.parseInt(date));
    }
    if (_.isNumber(date)) {
      date = new Date(date);
    }
    if (date === undefined) {
      date = new Date();
    }
    var monthStr = ("-" + (date.getMonth() + 101)).substring(2);
    var dayStr = ("-" + (date.getDate() + 100)).substring(2);
    return date.getFullYear() + "-" + monthStr + "-" + dayStr;
  }
  APP_base.toIsoDate = toIsoDate;

  /**
   * @memberOf APP_base
   */
  function valuesToIsoDate(year, month, day) {
    var monthStr = ("-" + (month + 100)).substring(2);
    var dayStr = ("-" + (day + 100)).substring(2);
    return year + "-" + monthStr + "-" + dayStr;
  }
  APP_base.valuesToIsoDate = valuesToIsoDate;

  /**
   * @memberOf APP_base
   */
  function toWeekday(arg0) {
    var date;
    if (_.isString(arg0)) {
      date = new Date(arg0);
    } else {
      date = arg0;
    }
    return APP_base.weekDayNames[(date.getDay() + 6) % 7];
  }
  APP_base.toWeekday = toWeekday;

  /**
   * @memberOf APP_base
   */
  function toMonth(arg0) {
    var date;
    if (_.isString(arg0)) {
      date = new Date(arg0);
    } else {
      date = arg0;
    }
    return APP_base.monthNames[date.getMonth()];
  }
  APP_base.toMonth = toMonth;

  /**
   * @memberOf APP_base
   */
  function toIsoDateTime(date) {

    if (_.isString(date)) {
      date = new Date(window.parseInt(date));
    }
    if (_.isNumber(date)) {
      date = new Date(date);
    }
    if (date === undefined) {
      date = new Date();
    }

    var monthStr = ("-" + (date.getMonth() + 101)).substring(2);
    var dayStr = ("-" + (date.getDate() + 100)).substring(2);
    var hStr = ("-" + (date.getHours() + 100)).substring(2);
    var mStr = ("-" + (date.getMinutes() + 100)).substring(2);
    return date.getFullYear() + "-" + monthStr + "-" + dayStr + " " + hStr
        + ":" + mStr;
  }
  APP_base.toIsoDateTime = toIsoDateTime;

  function monthIndex(isoDate) {
    return (new Date(isoDate)).getMonth();
  }
  APP_base.monthIndex = monthIndex;

  /**
   * @memberOf APP_base
   */
  function currentMonthIndex() {
    return (new Date()).getMonth();
  }
  APP_base.currentMonthIndex = currentMonthIndex;

  /**
   * @memberOf APP_base
   */
  function currentTimeMillis() {
    return (new Date()).getTime();
  }
  APP_base.currentTimeMillis = currentTimeMillis;

  /**
   * @memberOf APP_base
   */
  function currentMonth() {
    return (new Date()).getMonth() + 1;
  }
  APP_base.currentMonth = currentMonth;

  /**
   * @memberOf APP_base
   */
  function currentYearMonth() {
    APP_base.toIsoDate().substring(0, 7);
  }
  APP_base.currentYearMonth = currentYearMonth;

  /**
   * @memberOf APP_base
   */
  function currentYear() {
    return (new Date()).getFullYear();
  }
  APP_base.currentYear = currentYear;

  /**
   * @memberOf APP_base
   */
  function currentYearFirstDayIso() {
    return (new Date()).getFullYear() + '-01-01';
  }
  APP_base.currentYearFirstDayIso = currentYearFirstDayIso;

  /**
   * @memberOf APP_base
   */
  function currentYearLastDayIso() {
    return (new Date()).getFullYear() + '-12-31';
  }
  APP_base.currentYearLastDayIso = currentYearLastDayIso;

  /**
   * @memberOf APP_base
   */
  function isoDatesOfMonth(isoDate) {
    var date = new Date(isoDate);
    var i;
    var dateTmp;
    var res = [];
    for (i = 1; i < 32; i++) {
      dateTmp = new Date(date.getFullYear(), date.getMonth(), i);
      if (dateTmp.getMonth() === date.getMonth()) {
        res.push(APP_base.toIsoDate(dateTmp));
      }
    }
    return res;
  }
  APP_base.isoDatesOfMonth = isoDatesOfMonth;

  /**
   * @memberOf APP_base
   */
  APP_base.MILLIS_PER_SECOND = 1000;
  /**
   * @memberOf APP_base
   */
  APP_base.MILLIS_PER_MINUTE = 60 * APP_base.MILLIS_PER_SECOND;
  /**
   * @memberOf APP_base
   */
  APP_base.MILLIS_PER_HOUR = 60 * APP_base.MILLIS_PER_MINUTE;
  /**
   * @memberOf APP_base
   */
  APP_base.MILLIS_PER_DAY = 24 * APP_base.MILLIS_PER_HOUR;

  /**
   * @memberOf APP_base
   */
  function unixTimeToIso(unixTime) {
    if (_.isString(unixTime)) {
      unixTime = parseInt(unixTime);
    }
    if (_.isNumber(unixTime)) {
      return APP_base.toIsoDateTime(new Date(unixTime));
    }
    return unixTime;
  }
  APP_base.unixTimeToIso = unixTimeToIso;

  /**
   * @memberOf APP_base
   */
  function toDurationString(millis) {
    var unitsUsed = 0, s = ' ', n;
    var m = moment.duration(_.isString(millis) ? parseInt(millis) : millis);

    // days
    n = m.days();
    if (n) {
      s += n + " days ";
      unitsUsed++;
    }

    // hours
    n = m.hours();
    if (n) {
      s += n + " hours ";
      unitsUsed++;
    }

    // minutes
    n = m.minutes();
    if (n) {
      s += n + " min ";
      unitsUsed++;
    }

    // seconds
    n = m.seconds();
    if (n) {
      s += n + " sec ";
      unitsUsed++;
    }
    s = s.trim();
    return s || "0 sec";
  }
  APP_base.toDurationString = toDurationString;

  /**
   * @memberOf APP_base
   */
  function abbr(s, max) {
    if (s && s.length > max)
      return s.substring(0, max - 3) + '...';
    return s;
  }
  APP_base.abbr = abbr;

  /**
   * @memberOf APP_base
   */
  function sum4array(array) {
    var sum = 0.0;
    $.each(array, function(index, value) {
      sum += APP_base.parseFloat(value);
    });
    return sum;
  }

  /**
   * @memberOf APP_base
   */
  function avg4array(array) {
    if (array.length === 0) {
      return 0.0;
    }
    return APP_base.sum4array(array) / array.length;
  }
  APP_base.sum4array = sum4array;

  /**
   * @memberOf APP_base
   */
  function toJson(string) {
    var json;
    if (typeof (string) === 'object') {
      return string;
    }
    try {
      json = window.eval(eval("(" + string + ")"));
    } catch (ex) {
      json = string;
    }
    return json;
  }
  APP_base.toJson = toJson;

  //
  // LOGGER
  //

  /**
   * @memberOf APP_base
   */
  APP_base.msgCodes = {
    'userOk' : 10,
    'userWarning' : 20,
    'userError' : 30,
    'ok' : 1000,
    'warning' : 2000,
    'error' : 3000,
    'system' : 4000
  };

  APP_base.logger = APP_base.logger || {};

  APP_base.logger.logFn = function() {
  };
  APP_base.logger.info = function() {
  };
  APP_base.logger.error = function() {
  };
  APP_base.logger.warn = function() {
  };
  APP_base.logger.log = function() {
  };

  APP_base.log = {
    'init' : function() {
      var log$;
      if (logFn === undefined) {
        log$ = $('<div>').addClass('app-log').appendTo($('body'));
        log(function(level, arguments) {
          var line$ = $('<div>').addClass(level).appendTo(log$);
          $.each(arguments, function(i, v) {
            $('<span>').addClass('row-' + i).text(v).appendTo(line$);
          });
        });
      }
    },
    'set' : function(fn) {
      log(fn);
    },
    'debug' : function() {
      log('debug', arguments);
    },
    'info' : function() {
      log('info', arguments);
    },
    'warn' : function() {
      log('warn', arguments);
    },
    'error' : function() {
      log('error', arguments);
    }
  };

  function log(arg0, arg1) {
    if (arg0 === undefined) {
      return logFn;
    }
    if (typeof arg0 === 'function') {
      logFn = arg0;
      return;
    }
    if (typeof logFn === 'function') {
      logFn(arg0, arg1);
    }
  }

  /**
   * @memberOf APP_base
   */
  function parseFloat(s) {
    if (!s) {
      return 0.0;
    }
    try {
      s = window.parseFloat(s);
      if (_.isNaN(s)) {
        return 0.0;
      }
    } catch (e) {
      return 0.0;
    }
    return s;
  }
  APP_base.parseFloat = parseFloat;

  /**
   * @memberOf APP_base
   */
  function toFloat(value) {
    return value ? parseFloat(value) : 0;
  }
  APP_base.toFloat = toFloat;

  /**
   * @memberOf APP_base
   */
  function toFixed(value, fix) {
    return value.toFixed(fix);
  }
  APP_base.toFixed = toFixed;

  /**
   * @memberOf APP_base
   */
  function formatNumber(value, fix, tSeparator) {
    try {
      value = +value;
      value = value.toFixed(fix).replace(/(\d)(?=(\d{3})+\.)/g,
          "$1" + tSeparator);
    } catch (e) {
      return value;
    }
    return value;
  }
  APP_base.formatNumber = formatNumber;

  /**
   * @memberOf APP_base
   */
  function round(s) {
    if (_.isString(s)) {
      s = parseFloat(s);
    }
    s = Math.round(s);
    return _.isNaN(s) ? '' : s;
  }
  APP_base.round = round;

  //
  // GPS, geo location
  //
  /**
   * @memberOf APP_base
   */
  function geoLocation(cb) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, function() {
        cb('');
      });
    } else {
      cb('');
    }

    function success(pos) {
      // alert("Längengrad: " + pos.coords.longitude + " und Breitengrad: "
      // + pos.coords.latitude);
      cb(pos.coords.longitude + ';' + pos.coords.latitude);
    }

  }
  APP_base.geoLocation = geoLocation;

  //
  // GEO ADDRESS FUN
  //
  /**
   * @memberOf APP_base
   */
  function geoAddressFun() {

    var geocoder;
    var addresses = {};

    return getAddress;

    function getAddress(geolocation, cb) {
      var parts, latLng;
      // check cache first
      if (_.isString(addresses[geolocation])) {
        cb(addresses[geolocation]);
        return;
      }
      if (_.isArray(addresses[geolocation])) {
        addresses[geolocation].push(cb);
        return;
      }
      addresses[geolocation] = [];
      try {

        geocoder = geocoder || new google.maps.Geocoder();
        // geolocation : 8.531459766642389;47.36182698252959
        if (geocoder && _.isString(geolocation) && geolocation.length > 2) {
          parts = geolocation.split(';');
          latLng = new google.maps.LatLng(parts[1], parts[0]);
          geocoder.geocode({
            'latLng' : latLng
          }, function(results, status) {
            var res = '';
            var cbs = addresses[geolocation];
            if (status == google.maps.GeocoderStatus.OK) {
              res = results[0].formatted_address;

              cb(results[0].formatted_address);
            }
            addresses[geolocation] = res;
            $.each(cbs, function(i, cb) {
              cb(res);
            });
          });
        }

      } catch (e) {
        cb();
      }
    }
  }
  APP_base.geoAddress = geoAddressFun();

  //
  // sArray
  //
  /**
   * @memberOf APP_base
   */
  function sArray() {

    var list = [];
    var hash = {};
    var index = {};
    var i = 0;

    // var intern = {
    // list : list,
    // hash : hash,
    // index : index
    // };

    return {
      'put' : put,
      'append' : put,
      'prepend' : prepend,
      'get' : get,
      'getAt' : getAt,
      'getKeyAt' : getKeyAt,
      'size' : size,
      'length' : size,
      'remove' : remove,
      'containsKey' : containsKey,
      'containsValue' : containsValue,
      'list' : listFn,
      'hash' : hashFn,
      'iterate' : iterate,
      'iterateIf' : iterateIf,
      '_hash' : hash,
      '_index' : index,
      '_i' : i
    };

    function put(key, value) {
      if (index[key] === undefined) {
        list[i] = value;
        index[key] = i;
        i++;
      }
      hash[key] = value;
      // check();
    }

    function prepend(key, value) {
      var k;
      remove(key);
      // hash
      hash[key] = value;
      // list
      list.splice(0, 0, value);
      // index
      for (k in index) {
        if (typeof index[k] === 'number') {
          index[k] = index[k] + 1;
        }
      }
      index[key] = 0;
    }

    function get(key) {
      return hash[key];
    }

    function getAt(index) {
      return list[index];
    }

    function getKeyAt(_index) {
      return index[_index];
    }

    function size() {
      return list.length;
    }

    function remove(key) {
      var k, res = [], ii;
      ii = index[key];
      if (ii !== undefined) {
        res = list.splice(ii, 1);
        i--;
        delete hash[key];
        delete index[key];
        for (k in index) {
          if (typeof index[k] === 'number' && index[k] > ii) {
            index[k] = index[k] - 1;
          }
        }
      }
      return res[0];
    }

    function containsKey(key) {
      return index[key] ? true : false;
    }

    function containsValue(key) {
      var i = 0;
      for (i = 0; i < list.length; i++) {
        if (list[i] === value) {
          return true;
        }
      }
      return false;
    }
    function listFn() {
      return list;
    }
    function hashFn(key) {
      return hash;
    }
    /**
     * @param key
     *          key element
     * @param ifKeyFn
     *          function applied element key
     * @param elseFn
     *          applied for all element execpt the key ones
     */
    function iterateIf(key, ifKeyFn, elseFn) {
      var k, v;
      for (k in hash) {
        try {
          v = hash[k];
          if (k === key) {
            ifKeyFn(k, v);
          } else {
            if (elseFn !== undefined) {
              elseFn(k, v);
            }
          }

        } catch (e) {
          // TODO: handle exception
        }
      }
    }

    function iterate(fn) {
      var k, v;
      for (k in hash) {
        try {
          v = hash[k];
          fn(k, v);
        } catch (e) {
          // TODO: handle exception
        }
      }
    }
  }
  APP_base.sArray = sArray;

  //
  // sArray2
  //
  /**
   * @memberOf APP_base
   */
  function sArray2() {

    // index -> value
    var list = [];
    // key -> index
    var hash = {};

    return {
      'put' : put,
      'get' : get,
      'getAt' : getAt,
      'getKeyAt' : getKeyAt,
      'containsKey' : containsKey,
      'size' : size,
      'list' : _list
    };

    function put(key, value) {
      var index = hash[key];
      if (index === undefined) {
        list.push(value);
        hash[key] = list.length - 1;
      } else {
        list[index] = value;
      }
    }

    function get(key) {
      return list[hash[key]];
    }

    function getAt(index) {
      return list[index];
    }

    function getKeyAt(index) {
      var i, res;
      _.each(hash, function(e, n) {
        if (e === index) {
          res = n;
        }
      });
      return res;
    }

    function size() {
      return list.length;
    }

    function remove(key) {
      var k, res = [], ii;
      ii = hash[key];
      if (ii !== undefined) {
        res = list.splice(ii, 1);
        delete hash[key];
      }
      return res[0];
    }

    function containsKey(key) {
      return _.isNumber(hash[key]) ? true : false;
    }

    function containsValue(value) {
      var i;
      for (i = 0; i < list.length; i++) {
        if (list[i] === value) {
          return true;
        }
      }
      return false;
    }

    function _list() {
      return list;
    }

  }
  APP_base.sArray2 = sArray2;

  //
  // LOCAL STORAGE
  //
  /**
   * @memberOf APP_base
   */
  APP_base.localStorage = {
    'set' : function(n, v) {
      try {
        localStorage.setItem(n, v);
      } catch (e) {
        alert('sorry, localStorage does not work: ' + e.message);
      }
      return '';
    },
    'get' : function(n) {
      try {
        return localStorage.getItem(n);
      } catch (e) {
        alert('sorry, localStorage does not work: ' + e.message);
      }
      return '';
    },
    'remove' : function(n) {
      try {
        localStorage.removeItem(n);
      } catch (e) {
        alert('sorry, localStorage does not work: ' + e.message);
      }
    }
  };

  //
  // LS
  //
  /**
   * @memberOf APP_base
   */
  function ls(name, value) {
    var t;
    if (!_.isUndefined(value)) {
      if (value === null) {
        localStorage.removeItem(name);
      } else {
        localStorage.setItem(name, JSON.stringify(value));
      }
    }
    t = localStorage.getItem(name);
    if (_.isString(t)) {
      return JSON.parse(localStorage.getItem(name));
    }
    return;
  }
  APP_base.ls = ls;

  //
  // LOCAL SECURITY
  //
  /**
   * @memberOf APP_base
   */
  function localSecurity() {

    var namedPassphrases = {};

    return {
      'decData' : decData,
      'encData' : encData,
      'namedPassphrases' : namedPassphrases
    };

    function encData(passphraseName, passphrase, dataString) {

      var encrypted = CryptoJS.AES.encrypt(dataString, passphrase);
      var encryptedString = encrypted.toString();
      var obj = {
        'd' : encryptedString,
        'n' : passphraseName
      };

      return JSON.stringify(obj);

    }

    function decData(encObj) {

      var passphrase = namedPassphrases[encObj.n];
      if (_.isUndefined(passphrase)) {
        passphrase = prompt("please enter passphrase for " + encObj.n);
        namedPassphrases[encObj.n] = passphrase;
      }

      var decrypted = CryptoJS.AES.decrypt(encObj.d, passphrase);
      return decrypted.toString(CryptoJS.enc.Utf8);

    }

  }
  APP_base.localSecurity = localSecurity();

  //
  // KEY STRING
  //
  /**
   * @memberOf APP_base
   */
  function keyString(rowObject, keys) {
    var i, s;
    if (_.isArray(keys)) {
      s = '';
      for (i = 0; i < keys.length; i++) {
        s += (rowObject[keys[i]] || '') + '-';
      }
    }
    return s;
  }
  APP_base.keyString = keyString;

  //
  // TO TEXT -begin-
  //
  /**
   * @memberOf APP_base
   */
  function toText() {
    return JSON.stringify(arguments, null, '\t');
  }
  APP_base.toText = toText;

  //
  // TEXTING
  //
  /**
   * @memberOf APP_base
   */
  function texting(templateString, map) {
    var name = null, value, r;
    if (!_.isObject(map) || !_.isString(templateString)) {
      return templateString;
    }
    for (name in map) {
      value = map[name];
      if (_.isString(value) || _.isNumber(value)) {
        r = new RegExp('\\:' + name, 'g');
        templateString = templateString.replace(r, value);
      }
    }
    return templateString;
  }
  APP_base.texting = texting;

  //
  // GUID and UUID
  //

  (function() {
    var lut = [];
    for (var i = 0; i < 256; i++) {
      lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
    }
    function e7() {
      var d0 = Math.random() * 0xffffffff | 0;
      var d1 = Math.random() * 0xffffffff | 0;
      var d2 = Math.random() * 0xffffffff | 0;
      var d3 = Math.random() * 0xffffffff | 0;
      return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff]
          + lut[d0 >> 24 & 0xff] + '-' + lut[d1 & 0xff] + lut[d1 >> 8 & 0xff]
          + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-'
          + lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-'
          + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] + lut[d3 & 0xff]
          + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
    }

    function generateQuickGuid() {
      return Math.random().toString(36).substring(2, 15)
          + Math.random().toString(36).substring(2, 15);
    }

    /**
     * @memberOf APP_base
     */
    APP_base.guid = e7;// generateQuickGuid;
    /**
     * @memberOf APP_base
     */
    APP_base.uuid = e7;// generateQuickGuid;
  })();

  //
  // FIND FUNCTION
  //
  /**
   * @memberOf APP_base
   */
  function findFunction(arg0, fallback) {
    var fn = arg0;
    if (_.isString(arg0)) {
      try {
        fn = eval(arg0);
      } catch (e) {
        // logger.debug
      }
    }
    return _.isFunction(fn) ? fn : fallback;
  }
  APP_base.findFunction = findFunction;

  //
  // FIND OBJECT -begin-
  //
  /**
   * @memberOf APP_base
   */
  function findObject(arg0, fallback) {
    var t, obj = arg0, newArgs;
    if (_.isString(arg0)) {
      try {
        t = eval(arg0);
        if (_.isObject(t)) {
          return t;
        }
      } catch (e) {
      }

      arg0 = APP_base.findFunction(arg0);
    }
    if (_.isFunction(arg0)) {
      newArgs = _.toArray(arguments);
      newArgs.splice(0, 1);
      obj = arg0.apply(this, newArgs);
    }
    return _.isObject(obj) ? obj : fallback;
  }
  APP_base.findObject = findObject;

  //
  // FIND VALUE
  //
  /**
   * @memberOf APP_base
   */
  function findValue(fn) {
    var arguments2;
    if (_.isFunction(fn)) {
      try {
        arguments2 = _.toArray(arguments);
        arguments2.splice(0, 1);
        return fn.apply(this, arguments2);
      } catch (e) {
      }
    } else {
      return fn;
    }
  }
  APP_base.findValue = findValue;

  //
  // ECHO
  //
  /**
   * @memberOf APP_base
   */
  function echo(arg0) {
    return arg0;
  }
  APP_base.echo = echo;

  //
  // ALERT
  //
  /**
   * @memberOf APP_base
   */
  function _alert(arg0) {
    alert(arg0);
  }
  APP_base.alert = _alert;

  //
  // URL PARAMETER
  //
  /**
   * @memberOf APP_base
   */
  function urlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)), sURLVariables = sPageURL
        .split('&'), sParameterName, i;
    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : sParameterName[1];
      }
    }
  }
  APP_base.urlParameter = urlParameter;

  //
  // DEC SECVAL
  //
  /**
   * @memberOf APP_base
   */
  function decSecval(secval) {
    var key, encValue;
    if (secval.isEmpty === true) {
      secval.encValue = '';
      secval.value = '';
      return true;
    }
    key = APP_base.ls(APP_ui.secvalGlobal.lsPrefixKey + secval.keyName);
    encValue = secval.encValue;
    secval.value = '';
    if (!_.isString(key) || key.length == 0) {
      // message = 'no key for keyName ' + secval.keyName;
      return false;
    } else if (!_.isString(encValue) || encValue.length === 0) {
      // message = 'empty encValue';
      secval.isEmpty = true;
      secval.value = '';
      secval.encValue = '';
      return true;
    } else {
      try {
        secval.value = CryptoJS.AES.decrypt(encValue, key).toString(
            CryptoJS.enc.Utf8);
        if (secval.value.length === 0) {
          return false;
        }
      } catch (e) {
        // message = e.message;
        return false;
      }
    }
    return true;
  }
  APP_base.decSecval = decSecval;

  //
  // ENC SECVAL
  //
  /**
   * @memberOf APP_base
   */
  function encSecval(secval) {
    var message = null, key, value;
    key = APP_base.ls(APP_ui.secvalGlobal.lsPrefixKey + secval.keyName);
    secval.isEmpty = false;
    value = secval.value;
    secval.encValue = '';
    if (!_.isString(key) || key.length == 0) {
      message = 'empty value';
    } else if (value.length === 0) {
      message = 'empty value';
      secval.isEmpty = true;
      secval.encValue = '';
    } else {

      try {
        secval.encValue = CryptoJS.AES.encrypt(value, key).toString();
      } catch (e) {
        message = e.message;
      }
    }
    secval.value = '';
    secval.time = (new Date()).getTime();
    return message;
  }
  APP_base.encSecval = encSecval;

  //
  // SECVAL FORMATTER -begin-
  //

  /**
   * Possible value and their returns: ser === not JSON parsable string -> ser || ''
   * ser JSON parsable and decryptable -> value ser JSON parsable and not
   * decryptable -> '#secval#'
   */
  /**
   * @memberOf APP_base
   */
  function secvalFormatter(ser) {
    var b, obj;
    try {
      obj = JSON.parse(ser);

    } catch (e) {
      return ser || '';
    }
    if (_.isObject(obj)) {
      b = APP_base.decSecval(obj);
      if (b) {
        return obj.value;
      } else {
        return '#secval#';
      }
    }
    return obj;
  }
  APP_base.secvalFormatter = secvalFormatter;

  //
  // SECVAL FORMATTER -end-
  //

  //
  // BOOL
  //
  /**
   * @memberOf APP_base
   */
  function bool(arg0, defaultBool) {
    if (_.isBoolean(arg0)) {
      return arg0;
    }
    if ('true' === arg0) {
      return true;
    }
    if ('false' === arg0) {
      return false;
    }
    return defaultBool;
  }
  APP_base.bool = bool;

  //
  // getScripts
  //
  /**
   * @memberOf APP_base
   */
  function getScripts(resources, callback) {
    var counter = 0, deferreds, handler, idx;

    length = resources.length, handler = function() {
      counter++;
    }, deferreds = [], counter = 0, idx = 0;

    for (; idx < length; idx++) {
      deferreds.push($.getScript(resources[idx], handler));
    }

    $.when.apply(null, deferreds).then(callback, callback);

  }
  APP_base.getScripts = getScripts;

  
  /**
   * @memberOf APP_base
   */
  function deepClone(jsonObject) {
    var s = JSON.stringify(jsonObject);
    return JSON.parse(s);
  }
  APP_base.deepClone = deepClone;

  
}).call(this);
