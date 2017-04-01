var JGROUND_base = JGROUND_base || {};
var JGROUND_admin = JGROUND_admin || {};

(function() {

  var L = APP_data.getLabel;
  var D = APP_data.getDescription;
  var LABEL_INSERT_AND_UPDATE = false;

  //
  // UserInfoUi
  //

  function userInfoUi(userInfo) {

    var tabUi = APP_ui.tabUi();
    var ttui, userData1Ui;

    if (!_.contains(userInfo.roleNames, 'HRM_USER')) {
      ttui = APP_ui.anakapaViewUi({
        'action' : {
          'serviceId' : 'User.mySelect',
          'forward' : 'User.mySelect'
        }
      }, {
        'defMap' : defMap(),
        'serviceFn' : rQ.call
      });

      tabUi.tab({
        'label' : L('my-user-data')
      }).append(ttui.view());
    }

    //
    userData1Ui = APP_ui.fieldsUi(defMap().UserData1);
    userData1Ui.value(userInfo);
    tabUi.tab({
      'label' : L('my-connection-data')
    }).append(userData1Ui.view());

    tabUi.select(0);

    return tabUi;

    function defMap() {
      var t, map = {}, fieldsHolder;
      fieldsHolder = APP_data.getAppJson('jground_userDataFields');
      t = {
        'name' : 'User.mySelect',
        'uiType' : 'APP_ui.fieldsUi',
        'fields' : fieldsHolder.fields,
        'actions' : [ {
          'name' : 'update',
          'serviceId' : 'User.myUpdate'
        } ]
      };
      map[t.name] = t;

      t = {
        'name' : 'UserData1',
        'uiType' : 'APP_ui.fieldsUi',
        'fields' : [ {
          'name' : 'userId',
          'editable' : false
        }, {
          'name' : 'sessionId',
          'editable' : false
        }, {
          'name' : 'roleNames',
          'editable' : false,
          'uiType' : 'APP_ui.textareaUi'
        }, {
          'name' : 'apps',
          'editable' : false
        } ]
      };
      map[t.name] = t;

      return map;
    }
  }
  JGROUND_base.userInfoUi = userInfoUi;

  //
  // APP ADMIN UI
  //

  function appAdminUi(userInfo) {
    var tabUi = APP_ui.tabUi();
    var settings = {};
    settings.defMap = JGROUND_base.appAdminDefMap(userInfo);

    // user

    settings.startNames = [ 'User.select', 'Role.select' ];

    tabUi.tab({
      'label' : L('app-admin-user-tab')
    }).append(
        JGROUND_base.adminUi(userInfo, settings).view().addClass(
            'jground-admin-ui'));

    // data and document upload
    tabUi.tab({
      'label' : L('app-admin-data-upload-tab')
    }).append(JGROUND_base.fileUploadUi().view());

    // misc
    settings.startNames = [ 'Labels.select', 'CodeTable.select',
        'TreeSupport.select', 'AppProperties.select' ];
    tabUi.tab({
      'label' : L('app-admin-misc-tab')
    }).append(
        JGROUND_base.adminUi(userInfo, settings).view().addClass(
            'jground-admin-ui'));

    tabUi.select(0);
    tabUi.view().addClass('jground-admin');
    return tabUi;
  }
  JGROUND_admin.appUi = appAdminUi;

  //
  // ADMIN UI
  //

  function adminUi(userInfo, settings) {
    var ui, view$, partUi;

    ui = APP_ui.templateUi();
    view$ = ui.view();

    partUi = APP_ui.partUi({
      'L' : L,
      'D' : D,
      'appId' : 'jground',
      'backLabelId' : 'overview'
    });

    view$.append(partUi.view());

    $.each(settings.startNames, function(i, startName) {
      partUi.add(startName, settings.defMap);
    });

    return ui;

  }
  JGROUND_base.adminUi = adminUi;

  //
  // FILE UPLOAD UI -begin-
  //

  function fileUploadUi(settings) {

    settings = settings || {};

    var L = APP_data.getLabel;
    var D = APP_data.getDescription;
    var defMap = initDefMap();

    var ttui = APP_ui.anakapaViewUi('DataAndDocuments.myUploads', {
      'defMap' : defMap,
      'serviceFn' : rQ.call
    });

    return ttui;

    function initDefMap() {

      var processTypeList, defMap = {}, t, t1, t2;

      processTypeList = [ {
        'value' : 'data',
        'label' : L('spreadsheetData')
      }, {
        'value' : 'helpDocuments',
        'label' : L('helpDocuments')
      } ];

      t = {
        'name' : 'DataAndDocuments.myUploads',
        'uiType' : 'APP_ui.tableUi',
        'label' : 'Uploaded Files',
        'description' : 'This is the list of the files you (and if you are admin, others as well) have uploaded.',
        'fields' : [ {
          'name' : 'fileTid'
        }, {
          'name' : 'filename',
          'cellRenderer' : 'APP_ui.downloadFileCellRenderer'
        }, {
          'name' : 'created',
          'formatter' : 'APP_base.unixTimeToIso'
        }, {
          'name' : 'owner'
        } ],
        'actions' : [ {
          'name' : 'refresh',
          'type' : 'refresh',
          'serviceId' : 'DataAndDocuments.myUploads'
        }, {
          'name' : 'showReport',
          'source' : 'rowSelect',
          'serviceId' : 'ShaFile.documentProcessing.getProcessLog',
          'forward' : 'Show.processLog'
        }, {
          'name' : 'newUpload',
          'forward' : 'SpreadsheetData.newUpload'
        } ]
      };

      defMap[t.name] = t;

      t = {
        'name' : 'SpreadsheetData.newUpload',
        'uiType' : 'APP_ui.fieldsUi',
        'label' : 'New Upload',
        'description' : 'New Upload ',
        'fields' : [
        // {
        // 'name' : 'processingType',
        // 'uiType' : 'APP_ui.selectUi2',
        // 'list' : processTypeList
        // },
        {
          'name' : 'fileTid',
          'label' : 'XLSX File Upload ...',
          'uiType' : 'APP_ui.fileUploadUi',
          'uploadServiceId' : 'ShaFile.tempUpload',
          'version' : 'RQ'
        } ],
        'actions' : [ {
          'name' : 'processing-data',
          'serviceId' : 'ShaFile.documentProcessing',
          'parameters' : {
            'documentFolder' : settings.documentFolder,
            'processingType' : 'data'
          },
          'forward' : 'Show.processLog'
        }, {
          'name' : 'help-documents',
          'serviceId' : 'ShaFile.documentProcessing',
          'parameters' : {
            'documentFolder' : settings.documentFolder,
            'processingType' : 'helpDocuments'
          },
          'forward' : 'Show.processLog'
        }, {
          'name' : 'analysis',
          'serviceId' : 'FileProcess.analysis',
          'forward' : 'FileProcess.viewResult'
        } ]
      };

      defMap[t.name] = t;

      t = {
        'name' : 'Show.processLog',
        'uiType' : 'APP_ui.fileListProcessLogUi'
      };

      t = {
        'name' : 'Show.processLog',
        'uiType' : function() {
          var ui = APP_ui.resultUi({
            'onlyProcessLog' : true,
            'defaultLevels' : [ 'Error', 'Ok', 'Warn' ]
          });
          var resultUidata = ui.data;
          ui.data = data;
          return ui;

          function data(serviceData) {
            var list = rQ.toList(serviceData);
            var e = list[0];
            if (e && e.processLogJson) {
              serviceData.processLog = JSON.parse(e.processLogJson);
            }
            resultUidata(serviceData);
          }
        }
      };
      defMap[t.name] = t;

      //

      t = {
        'name' : 'FileProcess.viewResult',
        'uiType' : FileProcessResultUi,
        'renderAvActions' : true,
        'actions' : [ {
          'name' : 'run',
          'serviceId' : 'FileProcess.run',
          'forward' : 'FileProcess.viewResult_2'
        } ]
      };
      defMap[t.name] = t;

      //

      t = {
        'name' : 'FileProcess.viewResult_2',
        'uiType' : FileProcessResultUi
      };
      defMap[t.name] = t;

      return defMap;

      function FileProcessResultUi() {
        var fileTid, analysisResult;
        var ui, view$, json$;

        var ui = APP_ui.templateUi();
        ui.view().append(json$ = APP_ui.div());
        ui.data = data;
        ui.value = value;

        return ui;

        function data(serviceData) {
          var list = rQ.toList(serviceData);
          var e = list[0];
          if (e && e.analysisResult) {
            analysisResult = JSON.parse(e.analysisResult);
            if (json$.jsonView) {
              json$.jsonView(analysisResult);
            } else {
              json$.empty().text(JSON.stringify(analysisResult));
            }
          }
        }

        function value(p) {
          if (_.isObject(p)) {
            fileTid = p.fileTid;
          }
          return fileTid;
        }
      }
    }
  }
  JGROUND_base.fileUploadUi = fileUploadUi;

  //
  // FILE UPLOAD UI -end-
  //

  function appAdminDefMap(userInfo) {

    var t, defMap = {};

    t = {
      'name' : 'User.select',
      'uiType' : 'APP_ui.tableUi',
      'fields' : [ {
        'name' : 'userTid'
      }, {
        'name' : 'userId',
        'filter' : 'startWith'
      }, {
        'name' : 'officeId',
        'filter' : 'startWith'
      } ],
      'actions' : [ {
        'name' : 'refresh',
        'type' : 'refresh',
        'serviceId' : 'User.select'
      }, {
        'name' : 'update',
        'source' : 'rowSelect',
        'serviceId' : 'User.update',
        'forward' : 'User.update'
      }, {
        'name' : 'new',
        'forward' : 'User.insert'
      } ]
    };

    defMap[t.name] = t;

    t = {

      'name' : 'User.update',
      'uiType' : 'APP_ui.fieldsUi',
      'fields' : [ {
        'name' : 'userTid',
        'editable' : false
      }, {
        'name' : 'userId',
        'editable' : false
      }, {
        'name' : 'officeId'
      } ],
      'actions' : [ {
        'name' : 'update',
        'type' : 'close',
        'serviceId' : 'User.update'
      }, {
        'name' : 'delete',
        'type' : 'close',
        'serviceId' : 'USER_DATA.delete',
        'confirmation' : 'User.update-delete-confirmation'
      } ]

    };

    defMap[t.name] = t;

    t = {
      'name' : 'User.insert',
      'uiType' : 'APP_ui.fieldsUi',
      'fields' : [ {
        'name' : 'userId'
      }, {
        'name' : 'officeId'
      }, {
        'name' : 'password'
      }, ],
      'actions' : [ {
        'name' : 'insert',
        'type' : 'close',
        'serviceId' : 'User.insert'
      } ]

    };

    defMap[t.name] = t;

    //
    // ROLES
    //

    t = {
      'name' : 'Role.select',
      'uiType' : 'APP_ui.tableUi',
      'fields' : [ {
        'name' : 'userId',
        'filter' : 'startWith'
      }, {
        'name' : 'roleName',
        'filter' : 'startWith'
      } ],
      'actions' : [
          {
            'name' : 'refresh',
            'type' : 'refresh',
            'serviceId' : 'Role.select'
          },
          {
            'name' : 'new',
            'forward' : 'Role.insert'
          },
          {
            'name' : 'add',
            'source' : 'row',
            'forward' : 'Role.insert'
          }
          // , {
          // 'name' : 'update',
          // 'source' : 'rowSelect',
          // 'forward' : 'Roles.update'
          // }
          ,
          {
            'name' : 'delete',
            'source' : 'row',
            'type' : 'update',
            'confirmation' : 'Do you really want to delete the role :roleName for user :userId?',
            'serviceId' : 'Role.delete'
          } ]
    };

    defMap[t.name] = t;

    //

    // t = {
    // 'name' : 'Roles.update',
    // 'uiType' : 'APP_ui.fieldsUi',
    // 'fields' : [ {
    // 'name' : 'userId',
    // 'editable' : false
    // }, {
    // 'name' : 'roleName',
    // 'editable' : false
    // } ],
    // 'actions' : [ {
    // 'name' : 'delete',
    // 'type' : 'close',
    // 'serviceId' : 'Role.delete',
    // 'confirmation' : 'Do you really want to delete the role :roleName for
    // user :userId?'
    // } ]
    // };
    //
    // defMap[t.name] = t;

    //

    t = {
      'name' : 'Role.insert',
      'uiType' : 'APP_ui.fieldsUi',
      'fields' : [ {
        'name' : 'userId'
      }, {
        'name' : 'roleName'
      } ],
      'actions' : [ {
        'name' : 'insert',
        'type' : 'close',
        'serviceId' : 'Role.insert'
      } ]
    };

    defMap[t.name] = t;

    //
    // APP PROPERTIES
    //

    t = {
      'name' : 'AppProperties.select',
      'uiType' : 'APP_ui.tableUi',
      'fields' : [ {
        'name' : 'name',
        'filter' : 'startWith'
      }, {
        'name' : 'value',
        'filter' : 'startWith'
      } ],
      'actions' : [ {
        'name' : 'refresh',
        'type' : 'refresh',
        'serviceId' : 'AppProperties.select'
      }, {
        'name' : 'new',
        'forward' : 'AppProperties.insert'
      }, {
        'name' : 'update',
        'source' : 'rowSelect',
        'forward' : 'AppProperties.update'
      } ]
    };

    defMap[t.name] = t;

    //

    t = {
      'name' : 'AppProperties.update',
      'uiType' : 'APP_ui.fieldsUi',
      'fields' : [ {
        'name' : 'name',
        'editable' : false
      }, {
        'name' : 'value'
      } ],
      'actions' : [ {
        'name' : 'update',
        'type' : 'close',
        'serviceId' : 'AppProperties.update'
      }, {
        'name' : 'delete',
        'type' : 'close',
        'serviceId' : 'AppProperties.delete',
        'confirmation' : 'Do you really want to delete the property :name ?'
      } ]
    };

    defMap[t.name] = t;

    //

    t = {
      'name' : 'AppProperties.insert',
      'uiType' : 'APP_ui.fieldsUi',
      'fields' : [ {
        'name' : 'name'
      }, {
        'name' : 'value'
      } ],
      'actions' : [ {
        'name' : 'insert',
        'type' : 'close',
        'serviceId' : 'AppProperties.insert'
      } ]
    };

    defMap[t.name] = t;

    //
    // LABELS
    //

    t = {
      'name' : 'Labels.select',
      'uiType' : 'APP_ui.tableUi',
      'fields' : [ {
        'name' : 'name',
        'filter' : 'startWith'
      }, {
        'name' : 'lang',
        'filter' : 'startWith'
      }, {
        'name' : 'label',
        'filter' : 'startWith'
      }, {
        'name' : 'description',
        'filter' : 'startWith'
      } ],
      'actions' : [ {
        'name' : 'refresh',
        'type' : 'refresh',
        'serviceId' : 'Labels.select'
      } ]
    };

    if (LABEL_INSERT_AND_UPDATE) {
      t.actions.push({
        'name' : 'new',
        'forward' : 'Labels.insert'
      });
      t.actions.push({
        'name' : 'update',
        'source' : 'rowSelect',
        'forward' : 'Labels.update'
      });
    }

    defMap[t.name] = t;

    //

    t = {
      'name' : 'Labels.update',
      'uiType' : 'APP_ui.fieldsUi',
      'fields' : [ {
        'name' : 'name',
        'editable' : false
      }, {
        'name' : 'lang',
        'editable' : false
      }, {
        'name' : 'label'
      }, {
        'name' : 'description',
        'uiType' : 'textarea'
      } ],
      'actions' : [
          {
            'name' : 'update',
            'type' : 'close',
            'serviceId' : 'Labels.save'
          },
          {
            'name' : 'delete',
            'type' : 'close',
            'serviceId' : 'Labels.delete',
            'confirmation' : 'Do you really want to delete the label :name (:label) for language :lang?'
          } ]
    };

    defMap[t.name] = t;

    //

    t = {
      'name' : 'Labels.insert',
      'uiType' : 'APP_ui.fieldsUi',
      'fields' : [ {
        'name' : 'name'
      }, {
        'name' : 'lang'
      }, {
        'name' : 'label'
      }, {
        'name' : 'description',
        'uiType' : 'textarea'
      } ],
      'actions' : [ {
        'name' : 'insert',
        'type' : 'close',
        'serviceId' : 'Labels.insert'
      } ]
    };

    defMap[t.name] = t;

    //

    // --
    // --
    // -- SERVICE_ID = CodeTable.selectAll
    // --
    //

    t = {
      'name' : 'CodeTable.select',
      'uiType' : 'APP_ui.tableUi',
      'fields' : [ {
        'name' : 'tableName',
        'filter' : 'startWith'
      }, {
        'name' : 'name',
        'filter' : 'startWith'
      }, {
        'name' : 'indx'
      }, {
        'name' : 'ord'
      }, {
        'name' : 'svalue'
      }, {
        'name' : 'label'
      }, {
        'name' : 'description'
      } , {
        'name' : 'lang',
        'filter' : 'startWith'
      } ],
      'actions' : [ {
        'name' : 'refresh',
        'type' : 'refresh',
        'serviceId' : 'CodeTable.select'
      } ]
    };

    defMap[t.name] = t;

    // --

    // --
    // -- SERVICE_ID = TreeSupport.select
    // -- ROLES = APP_ADMIN
    // --
    //

    t = {
      'name' : 'TreeSupport.select',
      'uiType' : 'APP_ui.tableUi',
      'fields' : [ {
        'name' : 'trunk'
      }, {
        'name' : 'branch'
      }, {
        'name' : 'name'
      }, {
        'name' : 'indx'
      }, {
        'name' : 'svalue'
      }, {
        'name' : 'nvalue'
      } ],
      'actions' : [ {
        'name' : 'refresh',
        'type' : 'refresh',
        'serviceId' : 'TreeSupport.select'
      } ]
    };

    defMap[t.name] = t;

    return defMap;
  }

  JGROUND_base.appAdminDefMap = appAdminDefMap;

})();