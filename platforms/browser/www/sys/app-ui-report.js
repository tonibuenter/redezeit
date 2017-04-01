var APP_ui_report = APP_ui_report || {};

(function() {

  var L = APP_data.getLabel;
  var D = APP_data.getDescription;

  var calculationMap = {
    'sum' : function(array) {
      return APP_base.sum4array(array).toFixed(2);
    },
    'avg' : function(array) {
      return APP_base.avg4array(array).toFixed(2);
    },
    'empty' : function() {
      return '-';
    }
  };

  var columnFunctions = {
    'monthLabel' : function(value) {
      return L(APP_base.monthNames[value - 1]);
    },
    'id' : function(value) {
      return value;
    },
    'fixed2' : function(value) {
      try {
        value = window.parseFloat(value);
        return APP_base.toFixed(value, 2);
      } catch (e) {
        return value;
      }
    },
    'fixed2amount' : function(value) {
      return APP_base.formatNumber(value, 2, '\'');
    },
    'date' : function(value) {
      try {
        return APP_base.toIsoDate(value);
      } catch (e) {
        return value;
      }
    },
    'unixdate' : function(value) {
      try {
        return APP_base.toIsoDate(parseInt(value));
      } catch (e) {
        return value;
      }
    },
    'unixdatetime' : function(value) {
      try {
        return APP_base.toIsoDateTime(parseInt(value));
      } catch (e) {
        alert(e);
        return value;
      }
    }

  };

  var transformValue = function(func, value) {
    var fun = columnFunctions[func];
    if (typeof (fun) === 'function') {
      return fun(value);
    } else {
      return value;
    }
  };

  function callForPdf2(reportListDef, callback) {
    var reportListDef_string = JSON.stringify(reportListDef);
    rQ.call('ReportService', {
      'reportListDef' : reportListDef_string
    }, function(serviceData) {
      var row;
      try {
        row = serviceData.table[0];
        callback(row[0], row[1]);
      } catch (e) {
        callback();
      }
    });
  }

  /**
   * def.label : displayed name, def.serviceId : T_SERVICEQUERIES.key,
   * def.parameters : {}, def.constants, output panel
   */
  function create(settings) {

    // panels and uis
    var mainUi, mainPanel$, titlePanel$, parametersPanel$, messagePanel$, resultPanel$, buttonPanel$, runBt$, runPrintBt$, runSpreadsheetBt$;
    var parameterUis = [], parametersTableUi;
    var initUi, createParameters, processReport;
    var rqRequest;

    if (settings.rqRequest === undefined) {
      rqRequest = {
        'serviceId' : settings.serviceId
      };
    } else {
      rqRequest = settings.rqRequest;
    }

    mainUi = APP_ui.templateUi();
    mainPanel$ = mainUi.view().addClass('reportMainPanel');
    titlePanel$ = $('<div>').addClass('title').appendTo(mainPanel$);
    parametersPanel$ = $('<div>').addClass('parameters').appendTo(mainPanel$);
    messagePanel$ = $('<div>').addClass('message').appendTo(mainPanel$);
    resultPanel$ = $('<div>').addClass('result').appendTo(mainPanel$);

    initUi = function() {
      var title;
      var parametersTable$;
      //
      // title
      //
      title = settings.title || L(settings);
      titlePanel$.text(title);
      //
      // create parameterUis
      //
      parametersTableUi = APP_ui.simpleTableUi();
      if (settings.parameters) {
        $.each(settings.parameters, function(i, param) {
          var ui = APP_ui.widgetUi(param, processReport);
          var label = param.label || param.name || '';
          var name = param.name || '';
          var defaultValue = param.defaultValue || null;
          if (defaultValue) {
            ui.setValue(defaultValue);
          }
          parameterUis.push({
            'name' : name,
            'ui' : ui,
            'param' : param
          });
          parametersTableUi.add(label || '', ui.view());
        });
      }
      parametersPanel$.append(parametersTableUi.view());

      runBt$ = APP_ui.buttonUi({
        'text' : L('run')
      }, function() {
        processReport();
      }).view();

      buttonPanel$ = $('<div>').addClass('buttons').append(runBt$);
      parametersPanel$.append(buttonPanel$);

      //
      // PDF BUTTON
      //

      if (settings.pdf) {
        if (settings.version === 2) {
          runPrintBt$ = APP_ui.buttonUi(
              {
                'text' : L('run-pdf')
              },
              function() {
                var lang, reportDef, reportDef2, reportListDef;
                lang = APP_base.localStorage.get('selected-lang') || 'de';

                reportDef = $.extend({
                  'serviceId' : rqRequest.serviceId
                }, settings);
                reportDef.parameters = createParameters();

                // CONVERT TO VERSION 2 / MULTI SQs
                reportDef2 = $.extend({}, reportDef);

                reportListDef = {
                  'title' : reportDef.title || L(reportDef),
                  'filename' : reportDef.serviceId + '.pdf',
                  'pdf' : reportDef.layout === 'landsape' ? true : false,
                  'layout' : reportDef.layout || 'portrait',
                  'lang' : lang,
                  'creator' : reportDef.userId,
                  'reportDefs' : [ reportDef2 ]
                };

                APP_ui_report.callForPdf2(reportListDef, function(fileTid,
                    fileName) {
                  APP_ui.openDbFile(fileTid, fileName);
                });

                writeInfo(L('see-new-window-for-pdf-report'));
                return;
              }).view();
        } else {
          runPrintBt$ = APP_ui.buttonUi({
            'text' : L('run-pdf')
          }, function() {
            var this$ = $(this);
            var requestData = createParameters();
            requestData.output = 'pdf';
            var p = jQuery.param(requestData);
            var url = APP_data.sqUrl + rqRequest.serviceId + '?' + p;
            writeInfo(L('start-pdf-report-processing-ellipsis'));
            APP_ui.openWindow(url, L('report-as-pdf'));
            writeInfo(L('see-new-window-for-pdf-report'));
            return false;
          }).view();
        }

        //
        // for memory safety reason, pdf button turned off !!
        //

        buttonPanel$.append('&nbsp;&nbsp;', runPrintBt$);
      }

      //
      // SPREADSHEET BUTTON
      //

      if (settings.spreadsheet) {
        runSpreadsheetBt$ = APP_ui.buttonUi(
            {
              'text' : L('run-spreadsheet')
            },
            function() {

              var requestJson, reportDefJson, innerRequest = {
                'serviceId' : rqRequest.serviceId
              };
              writeInfo(L('running-spreadsheet-processing'));
              innerRequest.parameters = createParameters();

              requestJson = JSON.stringify(innerRequest);
              reportDefJson = JSON.stringify(settings);
              spreadsheetJson = JSON.stringify(settings.spreadsheetJson || {});

              rQ.call('SpreadsheetData.result', {
                'requestJson' : requestJson,
                'reportDefJson' : reportDefJson,
                'spreadsheetJson' : spreadsheetJson
              }, function(data) {
                var f, list = rQ.toList(data);
                if (list.length > 0) {
                  f = list[0];
                  writeInfo(L('see-new-window-for-spreadsheet-file') + ' : '
                      + f.filename);
                  // APP_ui.openFile(f);
                  writeInfo(APP_ui.downloadLink(f));
                } else {
                  APP_base.alert(L('no-file-returned-from-server'));
                }
              });

              return;
            }).view();
        buttonPanel$.append('&nbsp;&nbsp;', runSpreadsheetBt$);
      }
      //

    };

    function writeError(text) {
      messagePanel$.empty();
      messagePanel$.append($('<div>', {
        'class' : 'ui-widget ui-state-error  ui-corner-all',
        'text' : text
      }).css('padding', '3px'));
    }

    function writeInfo(text) {
      var v$ = $('<div>', {
        'class' : 'ui-widget ui-state-highlight ui-corner-all'
      }).css('padding', '3px');

      messagePanel$.empty();
      messagePanel$.append(v$);
      if (_.isObject(text)) {
        v$.append(text);
      } else {
        v$.text(text);
      }
    }

    createParameters = function() {
      var requestData = _.clone(rqRequest.parameters || {});
      $.each(parameterUis, function(index, nameUiObj) {
        var name = nameUiObj.name;
        var ui = nameUiObj.ui;
        var param = nameUiObj.param;
        if (name && ui && ui.getValue && ui.getValue()) {
          requestData[name] = ui.getValue();
        } else {
          requestData[name] = param.defaultValue;
        }
      });
      if (!requestData.title) {
        requestData.title = settings.title || L(settings);
      }
      requestData.sessionId = APP_data.sessionId();
      return requestData;
    };

    processReport = function(isReport) {

      var key = rqRequest.serviceId;
      var textAligns = settings.textAligns || [];
      var columnFunctions = settings.columnFunctions || [];
      var columnNamePrefix = settings.columnNamePrefix || '';
      var sumRow = settings.sumRow || [];
      var sumRowValues = [];
      var hasSumRow = sumRow.length > 0;
      var requestData = createParameters();
      writeInfo(L('start-report-processing-ellipsis'));

      rQ.call(key, requestData, function(data) {
        var table, header, table$, thead$, tbody$, tr$, isEven, col = 0;
        writeInfo(L('report-processing-done'));
        resultPanel$.empty();
        if (data.exception) {
          writeError(data.exception);
        } else if (!data.table || data.table.length === 0) {
          writeInfo(L('sorry-no-data-found-for-service') + ' : ' + key + '!');
        } else {
          writeInfo(L('found') + ' : ' + data.table.length + '!');
          table$ = $('<table>', {
            'class' : 'ui-widget ui-widget-content'
          }).appendTo(resultPanel$);

          table = data.table;
          header = data.header;

          if (header) {
            thead$ = $('<thead>').appendTo(table$);
            tr$ = $('<tr>', {
              'class' : 'ui-widget-header'
            }).appendTo(thead$);

            $.each(header, function(index, element) {
              tr$.append($('<th>', {
                text : L(columnNamePrefix + element),
                title : D(columnNamePrefix + element)
              }));
            });
          }
          tbody$ = $('<tbody>').appendTo(table$);
          isEven = true;
          $.each(table, function(rowIndex, row) {
            col = 0;
            isEven = !isEven;
            tr$ = $('<tr>').appendTo(tbody$).addClass(isEven ? 'even' : 'odd');
            $.each(row, function(index, value) {
              var align = textAligns[col];
              var colFun = columnFunctions[col];
              value = transformValue(colFun, value);
              tr$.append($('<td>', {
                text : value
              }).css({
                'text-align' : align || 'left'
              }));
              if (_.isArray(sumRowValues[index])) {
                sumRowValues[index].push(value);
              } else {
                sumRowValues[index] = [ value ];
              }
              col++;

            });
          });
          //
          // sum row
          //
          if (hasSumRow) {
            try {
              tr$ = $('<tr>').appendTo(tbody$).addClass('sumRow');
              for (col = 0; col < header.length; col++) {
                var align = textAligns[col];
                var calcFunName = sumRow[col] || 'empty';
                var value = calculationMap[calcFunName](sumRowValues[col]);
                tr$.append($('<td>', {
                  text : value
                }).css({
                  'text-align' : align || 'left'
                }));
              }
            } catch (e) {
              alert(e);
            }
          }
        }
      });
    };

    initUi();

    mainUi.run = runFn;

    return mainUi;

    function runFn() {
      runBt$.click();
    }
  }

  APP_ui_report.create = create;
  APP_ui_report.createUi = function(settings) {
    var r = create(settings);
    return {
      'view' : r.view,
      'refresh' : r.run
    };
  };
  APP_ui_report.callForPdf2 = callForPdf2;

})();