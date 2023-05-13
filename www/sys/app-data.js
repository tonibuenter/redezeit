var APP_data = APP_data || {};
(function() {

  var noUserCallback;
  var labelsMap;
  var codeTableMap;
  var appJsonMap;
  var propertiesMap;
  var _sessionId;

  APP_data.docuUrl = 'docu/';

  //
  // LOAD APP PROPERTIES
  //
  /**
   * @memberOf APP_data
   */
  // function loadAppProperties(callback) {
  //   rQ.call('AppProperties.anakapa', {}, function(data) {
  //     propertiesMap = rQ.toMap(data, 'name');
  //     callback(propertiesMap);
  //   });
  // }
  // APP_data.loadAppProperties = loadAppProperties;

  //
  // APP PROPERTY -start-
  //
  /**
   * @memberOf APP_data
   */
  function appProperty(name, defaultValue) {
    var t = propertiesMap[name];
    return _.isObject(t) ? t.value : defaultValue;
  }
  APP_data.appProperty = appProperty;

  //
  // LOAD LABELS
  //
  /**
   * @memberOf APP_data
   */
  // function loadLabels(lang, callback) {
  //   if (_.isFunction(lang)) {
  //     callback = lang;
  //     lang = null;
  //   }
  //   lang = lang || APP_base.localStorage.get('selected-lang');
  //
  //   rQ.call('Labels.selectAll', {
  //     'lang' : lang
  //   }, function(data) {
  //     labelsMap = rQ.toMap(data, 'name');
  //     callback(data);
  //   });
  // }
  // APP_data.loadLabels = loadLabels;

  //
  // LOAD DATA POST LOGIN
  //
  /**
   * @memberOf APP_data
   */
  // function loadDataPostLogin(lang, callback) {
  //   var requests = [];
  //
  //   requests.push({
  //     'serviceId' : 'CodeTable.selectAll',
  //     'parameters' : {
  //       'lang' : lang
  //     }
  //   });
  //
  //   requests.push({
  //     'serviceId' : 'AppJson.selectAll'
  //   });
  //
  //   rQ.callRqMulti(requests, function(serviceDataList) {
  //     codeTableMap = rQ.toListMap(serviceDataList[0], 'tableName');
  //     appJsonMap = rQ.toMap(serviceDataList[1], 'name');
  //     callback(serviceDataList);
  //   });
  //
  // }
  // APP_data.loadDataPostLogin = loadDataPostLogin;

  //
  // LOAD APP JSON
  //
  /**
   * @memberOf APP_data
   */
  // function loadAppJson(callback) {
  //
  // rQ.call('AppJson.selectAll', {}, function(data) {
  // appJsonMap = rQ.toMap(data, 'name');
  // callback(appJsonMap);
  // });
  //
  // }
  // APP_data.loadAppJson = loadAppJson;
  //
  // LOAD APP JSON
  //
  /**
   * @memberOf APP_data
   */
  function getAppJson(name) {
    var e = appJsonMap[name];
    if (e) {
      return JSON.parse(e.json);
    }
    return null;
  }
  APP_data.getAppJson = getAppJson;

  //
  // app list
  //
  /**
   * @memberOf APP_data
   */
  function appList() {
    var e = propertiesMap['anakapa.apps'];
    if (e) {
      return e.value.split(',');
    }
    return [ 'jground' ];
  }
  APP_data.appList = appList;

  //
  // SESSION ID
  //
  /**
   * @memberOf APP_data
   */
  function sessionId(s) {
    if (s) {
      _sessionId = s;
    }
    return _sessionId;
  }
  APP_data.sessionId = sessionId;

  function setNoUserCallback(callback) {
    noUserCallback = callback;
  }
  APP_data.setNoUserCallback = setNoUserCallback;

  /**
   * @memberOf APP_data
   */
  function _getLabel(arg0) {
    var res, map = labelsMap || {};
    if (_.isString(arg0)) {
      res = map[arg0] || arg0;
    } else if (_.isObject(arg0)) {
      res = arg0.label || map[arg0.labelId] || map[arg0.name] || arg0.labelId
          || arg0.name || '';
    }
    return res;
  }

  /**
   * @memberOf APP_data
   */
  function _getDescription(arg0) {
    var res, map = labelsMap || {};
    if (_.isString(arg0)) {
      res = map[arg0] || arg0;
    } else if (_.isObject(arg0)) {
      res = arg0.label || map[arg0.labelId] || map[arg0.name] || arg0.labelId
          || arg0.name || '';
    }
    return res;
  }

  //
  // GET LABEL
  //
  /**
   * @memberOf APP_data
   */
  function getLabel(arg0, arg1) {
    var l = _getLabel(arg0);
    if (_.isObject(l)) {
      l = l.label;
    }
    if (_.isObject(arg1)) {
      l = APP_base.texting(l, arg1);
    }
    return l;
  }
  APP_data.getLabel = getLabel;

  //
  // GET DESCRIPTION
  //
  /**
   * @memberOf APP_data
   */
  function getDescription(arg0, arg1) {
    var l = _getLabel(arg0);
    if (_.isObject(l)) {
      l = l.description;
    }
    if (_.isObject(arg1)) {
      l = APP_base.texting(l, arg1);
    }
    return l;
  }
  APP_data.getDescription = getDescription;

  //
  // GET MESSAGE
  //
  /**
   * @memberOf APP_data
   */
  function getMessage() {
    var i = 0;
    var name;
    var re = /{}/;

    try {
      $.each(arguments, function(i, v) {
        if (i == 0) {
          name = getLabel(v);
        } else {
          name = name.replace(re, v);
        }
        i++;
      });
    } catch (e) {
      name = '-no message-';
    }
    return name;
  }
  APP_data.getMessage = getMessage;

  //
  // GET CODE TABLE
  //
  /**
   * @memberOf APP_data
   */
  function codeTable(tableName) {
    return codeTableMap[tableName];
  }
  APP_data.codeTable = codeTable;

  //
  // FIRST OBJECT
  //
  /**
   * @memberOf APP_data
   */
  // function firstObject(data) {
  //   var list, r;
  //   if (data) {
  //     if (_.isBoolean(data.hasMore)) {
  //       list = rQ.toList(data);
  //       if (list.length > 0) {
  //         r = list[0];
  //       }
  //     } else if (_.isArray(data)) {
  //       if (data.length > 0) {
  //         r = data[0];
  //       }
  //     } else if (_.isObject(data)) {
  //       r = data;
  //     }
  //   }
  //   return r;
  // }
  // APP_data.firstObject = firstObject;

  //
  // USER MESSAGES
  //
  /**
   * @memberOf APP_data
   */
  function userMessages(data) {
    var ums = [];

    var pInfo = data ? (data.processLog || data) : undefined;

    if (_.isString(data)) {
      return [ {
        'message' : data,
        'level' : 'OK'
      } ];
    }
    if (_.isArray(pInfo) && pInfo.length == 0) {
      return pInfo;
    }
    if (_.isArray(pInfo) && pInfo[0].level) {
      return pInfo;
    }

    if (!pInfo || !pInfo.lines) {
      return ums;
    }

    pInfo.lines.sort(function(a, b) {
      var x = a.time;
      var y = b.time;
      return -1 * ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });

    $.each(pInfo.lines, function(i, line) {
      var code = line.code + '';
      var um = {};
      switch (code) {
      case '10':
        um.level = 'OK';
        break;
      case '20':
        um.level = 'Warning';
        break;
      case '30':
        um.level = 'Error';
        break;
      }

      if (um.level) {
        um.message = line.message;
        ums.push(um);
      }
    });
    return ums;
  }
  APP_data.userMessages = userMessages;

  //
  // PREVIEW URL
  //
  /**
   * @memberOf APP_data
   */
  function previewUrl(file) {
    var url, p = file.previewFileTid;
    p = +p;
    if (_.isNaN(p) || p === -1) {
      // "<i class="fa fa-file-o"></i>"
      return null;
    } else {
      url = 'docu/sha/' + file.previewFileTid + '/preview.png';
    }
    return url;
  }
  APP_data.previewUrl = previewUrl;

  //
  // SETTING RQ
  //
  /**
   * @memberOf APP_data
   */
  // rQ.noSession(function noSession() {
  //   window.location.reload(true);
  // });

  //
  // INDEX DB / IDB
  //

  function openIndexDB(name, cb) {
    var indexDB = window.indexedDB = window.indexedDB || window.webkitIndexedDB
        || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB, IDBTransaction = window.IDBTransaction
        || window.webkitIDBTransaction
        || window.OIDBTransaction
        || window.msIDBTransaction, dbVersion = 1;

    var db, osName, request;

    osName = "name-value-hash";
    request = indexDB.open(name, dbVersion);
    request.onerror = function(event) {
      // Handle errors.
    };

    request.onupgradeneeded = function(event) {
      db = event.target.result;
      objectStore = db.createObjectStore(osName);
      // returnCb();
    };

    request.onsuccess = function(event) {
      db = request.result;
      returnCb();
    };

    function get(key, cb) {
      if (!_.isFunction(cb)) {
        return;
      }
      var transaction = db.transaction([ osName ], 'readonly');
      var objectStore = transaction.objectStore(osName);
      var request = objectStore.get(key);
      request.onerror = cb;
      request.onsuccess = function() {
        cb(request);
      };
    }

    function put(key, value, cb) {
      var transaction = db.transaction([ osName ], "readwrite");
      transaction.oncomplete = cb;
      transaction.onerror = cb;
      transaction.objectStore(osName).put(value, key);
    }

    function returnCb() {
      if (cb) {
        cb({
          'get' : get,
          'put' : put
        });
        cb = null;
      }
    }
  }

  APP_data.openIndexDB = openIndexDB;

  function callIdb(request) {
    var idb;
    APP_data.openIndexDB(request.dbname, function(arg0) {
      idb = arg0;
      if (request.value === undefined) {
        idb.get(request.key, request.callback);
      } else {
        idb.put(request.key, request.value, function() {
          idb.get(request.key, request.callback);
        });
      }
    });
  }

  APP_data.callIdb = callIdb;


  //
  // DATA TREE
  //

  function dataTree(dataList) {
    var result = {}, i, e, branch, currentBranch, name, svalue, t;
    for (i = 0; i < dataList.length; i++) {
      e = dataList[i];
      branch = e.branch;
      currentBranch = findBranch(branch.split('.'));
      if (e.indx == '-1') {
        currentBranch[e.name] = e.svalue;
      } else {
        currentBranch[e.name] = currentBranch[e.name] || [];
        currentBranch[e.name][+e.indx] = e.svalue;
      }

    }
    return result;

    function findBranch(names) {
      var i, n, current;
      current = result;
      for (i = 0; i < names.length; i++) {
        n = names[i];
        current[n] = current[n] || {};
        current = current[n];
      }
      return current;
    }
  }

  APP_data.dataTree = dataTree;


})();
