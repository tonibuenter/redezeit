var SOC_base = SOC_base || {};

(function() {

  var DEBUG = true;
  var root = this;

  if (root['SOC_base'] === undefined) {
    root['SOC_base'] = {};
  } else {
    return;
  }

  var L = APP_data.getLabel;
  var D = APP_data.getDescription;
  var M = APP_data.getMessage;

  // SQs

  var SQ_UserInfo = 'USER_DATA.mySelect';
  var SQ_getMeetingList = 'SOC.getMeetingList';
  var SQ_saveNewMeeting = 'SOC.saveNewMeeting';
  //
  // single meeting content
  //
  var SQ_getMeeting = 'SOC.getMeeting';
  var SQ_saveNewMeetingInstance = 'SOC.saveNewMeetingInstance';
  var SQ_saveMeeting = 'SOC.saveMeeting';
  var SQ_getAgendaList = 'SOC.getAgendaList';
  var SQ_getAgenda = 'SOC.getAgenda';
  var SQ_saveNewAgenda = 'SOC.saveNewAgenda';
  //
  var SQ_getAgendaFileList = 'SOC.getAgendaFileList';

  SOC_base.createUi = createUi;

  /**
   * @memberOf SOC_meeting
   */
  function createUi(settings) {
    // ui

    // FOR NOW
    //

    var ui = APP_ui_meeting.createUi();
    return ui;

    // FOR NOW
    //

    var view$;
    var main$;

    view$ = $('<div>').addClass('abc');
    main$ = $('<div>').addClass('main').appendTo(view$);

    if (DEBUG) {

    }

    startMain();

    return {
      'view' : view
    };

    function startMain() {
      main$.append(busyIcon());
      APP_data.callSqMulti([ {
        'serviceId' : SQ_UserInfo
      } ], function(prArray) {
        var userInfo = rQ.toList(prArray[0]);
        var ui = createMeetingTypeListUi(userInfo);
        main$.empty().append(ui.view());
      });
    }

    function view() {
      return view$;
    }
  }

  /**
   * @memberOf SOC_meeting
   */
  function createMeetingTypeListUi(userInfo, mtList) {

    var view$;
    var header$;
    var main$, meetingTypeList$, meetingType$, mtPanels, newMeeting$;
    var doneFn;

    view$ = $('<div>').addClass('mt-list');
    header$ = $('<div>').addClass('header');
    main$ = $('<div>').addClass('main');
    meetingTypeList$ = $('<div>').addClass('mt-list');
    meetingType$ = $('<div>').addClass('meeting-type');
    newMeeting$ = $('<div>').addClass('new-meeting-type');

    view$.append(header$, main$);
    main$.append(meetingTypeList$, meetingType$, newMeeting$);
    mtPanels = APP_base.sArray();

    init(mtList);

    return {
      'view' : view,
      'show' : show,
      'hide' : hide,
      'done' : done,
      'mini' : mini
    };

    function init(mtList) {
      var toolbar$;
      mtTitle('welcome-to-the-meeting-portal', 1).click(mini).appendTo(header$);
      toolbar$ = $('<div>').addClass('toolbar').appendTo(header$);
      mtButton('new-meeting-type', function() {
        var ui = createMeetingTypeNewUi();
        newMeeting$.empty().append(ui.view());
        ui.done(function(refresh) {
          if (refresh)
            initMeetingTypeList();
          showList();
        });
        showNew();
      }).appendTo(toolbar$);
      initMeetingTypeList(mtList);
    }

    function initMeetingTypeList(mtList) {
      meetingTypeList$.empty().append(busyIcon());
      showList();
      mtPanels = APP_base.sArray();
      if (_.isUndefined(mtList)) {
        APP_data.callSqMulti([ {
          'serviceId' : SQ_UserInfo
        }, {
          'serviceId' : SQ_getMeetingList
        } ], function(prArray) {
          var userInfo, mtList;

          userInfo = rQ.toList(prArray[0]);
          // MEETING_TYPE_TID MEETING_TYPE_ID NAME VIEW EDIT ADMIN
          mtList = rQ.toList(prArray[1]);
          // APP_base.logger.info('found ' + mtList.length + ' MeetingType
          // entries.');
          buildList(mtList);
        });
      }

      // MEETING_TYPE_TID MEETING_TYPE_ID NAME VIEW EDIT ADMIN
      function buildList(mtList) {
        meetingTypeList$.empty();
        if (mtList.length === 0) {
          meetingTypeList$.append(warnMsg('your-have-no-meeting-types'));
        } else {
          $.each(mtList, function(i, mt) {
            var mt$ = $('<div>').addClass('meeting-type-element');
            mt$.addClass(mt.meetingTypeTid);
            mt$.append($('<div>').text(mt.name).addClass('mt-meeting-name')
                .click(function() {
                  var ui;
                  if (mtPanels.containsKey(mt.meetingTypeTid)) {
                  } else {
                    ui = createMeetingTypeUi(mt);
                    ui.done(function() {
                      showList();
                    });
                    mtPanels.put(mt.meetingTypeTid, ui);
                    meetingType$.append(ui.view());
                  }
                  showMeetingType(mt.meetingTypeTid);
                }));
            mt$.append($('<div>').text(mt.nextMeetingTime).addClass(
                'mt-next-meeting-time'));
            if (mt.view) {
              mt$.append($('<div>').addClass('mt-small-icon mt-icon-view'));
            }
            if (mt.edit) {
              mt$.append($('<div>').addClass('mt-small-icon mt-icon-edit'));
            }
            meetingTypeList$.append(mt$);
          });
        }
      }
    }

    function showList() {
      meetingType$.hide('fast');
      newMeeting$.hide('fast');
      meetingTypeList$.show('fast');
    }

    function showNew() {
      meetingTypeList$.hide('fast');
      meetingType$.hide('fast');
      newMeeting$.show('fast');
    }

    function showMeetingType(meetingTypeTid) {
      meetingTypeList$.hide('fast');
      newMeeting$.hide('fast');
      meetingType$.show('fast');
      if (meetingTypeTid === undefined) {
        alert('oops, no panel open for: ' + meetingTypeTid);
        meetingTypeList$.show();
      }
      mtPanels.iterate(function(k, ui) {
        if (meetingTypeTid === k) {
          ui.show();
        } else {
          ui.hide();
        }
      });
    }

    function view() {
      return view$;
    }
    function show(arg0) {
      return view$.show();
    }
    function hide() {
      return view$.hide();
    }
    function done(arg0) {
      if (typeof arg0 === 'function') {
        doneFn = arg0;
      }
    }
    function mini(arg0) {
      view$.toggleClass('mini');
    }

  }

  /**
   * @memberOf SOC_meeting
   */
  function createMeetingTypeNewUi() {

    var i, view$, parameterUiList, u, table$, save$, done$;
    var doneFn;
    view$ = $('<div>');

    parameterUiList = uiDef('newMeeting');
    view$.append(mtTitle('new-meeting-type-title', 2));
    table$ = $('<table>').appendTo(view$);
    for (i = 0; i < parameterUiList.fields.length; i++) {
      u = parameterUiList.fields[i];
      table$.append($('<tr>').append(
      //
      $('<td>').text(L(u.label || u.name)),
      //
      $('<td>').append(u.ui.view())));
    }
    view$.append($('<div>').addClass('buttons').append(
        save$ = mtButton('save', function() {
          var params = parameterUiList.params();
          mtButtonBusy(save$);
          APP_data.callSq(SQ_saveNewMeeting, params, function(data) {
            alert(L('new-meeting-type-saved'));
            mtButtonDone(save$);
            done(true);
          });
        }), mtButton('cancel', function() {
          done();
        })));

    return {
      'view' : view,
      'done' : done,
      'show' : show,
      'hide' : hide
    };

    function view() {
      return view$;
    }
    function done(arg0) {
      if (typeof arg0 === 'function') {
        doneFn = arg0;
      } else {
        if (typeof doneFn === 'function') {
          doneFn(arg0);
        }
      }
    }
    function show(arg0) {
      view$.show(arg0);
    }
    function hide(arg0) {
      view$.hide(arg0);
    }

  }

  /**
   * @memberOf SOC_meeting
   */
  function createMeetingTypeUi(mt) {
    var view$, doneFn;
    var header$, main$, newMeetingPanel$, meetingList$, meetingPanel$;
    var meetingTypeTid = mt.meetingTypeTid;

    view$ = $('<div>').addClass('meeting-type');
    header$ = $('<div>').addClass('header');
    main$ = $('<div>').addClass('main');
    view$.append(header$, main$);
    newMeetingPanel$ = $('<div>').addClass('new-meeting-panel').hide();
    meetingPanel$ = $('<div>').addClass('meeting-panel').hide();
    meetingList$ = $('<div>').addClass('meeting-list-panel');
    main$.append(newMeetingPanel$, meetingList$, meetingPanel$);

    initMeetingTypeUi(mt);

    return {
      'view' : view,
      'show' : show,
      'hide' : hide,
      'done' : done
    };

    function initMeetingTypeUi(mt) {
      var done$, toolbar$;
      // header
      mtTitle('Meeting Type :: ' + mt.name, 2).appendTo(header$);
      toolbar$ = $('<div>').addClass('toolbar').appendTo(header$);
      mtButton('new-meeting', function() {
        var ui = createMeetingNewUi(mt);
        ui.done(function(arg0) {
          refreshMeetingList(arg0);
          showMeetingList();
        });
        newMeetingPanel$.empty().append(ui.view());
        showNewMeetingPanel();
      }).appendTo(toolbar$);
      mtButton('done', function() {
        done();
      }).appendTo(toolbar$);
      // main
      meetingList$.append(busyIcon());
      APP_data.callSq(SQ_getMeetingList, {
        'meetingTypeTid' : meetingTypeTid
      }, refreshMeetingList);
    }

    // 
    function refreshMeetingList(data) {
      var list = rQ.toList(data);
      var p$, table$, list$;
      var u, cb;
      meetingList$.empty();
      if (list.length === 0) {
        meetingList$.append(infoBox('you-have-no-meetings'));
      } else {
        // meetingList$.append(mtTitle('number-of-meetings : ' + list.length,
        // 3));

        p$ = $('<div>').addClass('meeting-list').appendTo(meetingList$);
        for (i = 0; i < list.length; i++) {
          u = list[i];
          cb = (function(u) {
            return function() {
              // get content for meeting
              /**
               * @memberOf multi
               */
              APP_data.callSqMulti([ {
                'serviceId' : SQ_getMeeting,
                parameters : {
                  'meetingTid' : u.meetingTid
                }
              }, {
                'serviceId' : SQ_getAgendaList,
                parameters : {
                  'meetingTid' : u.meetingTid
                }
              } ], function(prArray) {
                var ui, meeting, agendaList;
                meeting = rQ.toList(prArray[0])[0];
                agendaList = rQ.toList(prArray[1]);
                ui = createMeetingUi(meeting, agendaList);
                ui.done(showMeetingList);
                meetingPanel$.empty().append(ui.view());
                showMeetingPanel();
              });
            };
          })(u);
          p$.append($('<div>').addClass(i % 2 == 0 ? 'even' : 'odd').addClass(
              'meeting-list-element').append(
              //
              $('<div>').addClass('name').text(u.name),
              //
              $('<div>').addClass('description').text(u.description),
              //
              $('<div>').addClass('location').text(u.location),
              //
              $('<div>').addClass('startTime').text(
                  APP_base.toIsoDate(u.startTime)),
              //
              $('<div>').addClass('endTime')
                  .text(APP_base.toIsoDate(u.endTime)),
              //
              $('<div>').addClass('creatonUserId').text(u.creatonUserId),
              //
              $('<div>').addClass('actions').text('meeting-actions')
          //
          ).click(cb));
        }
      }
    }

    function showMeetingPanel() {
      newMeetingPanel$.hide('fast');
      meetingList$.hide('fast');
      meetingPanel$.show('fast');
    }

    function showMeetingList() {
      newMeetingPanel$.hide('fast');
      meetingPanel$.hide('fast');
      meetingList$.show('fast');
    }

    function showNewMeetingPanel() {
      meetingList$.hide('fast');
      meetingPanel$.hide('fast');
      newMeetingPanel$.show('fast');
    }

    function view() {
      return view$;
    }
    function show() {
      return view$.show();
    }
    function hide() {
      return view$.hide();
    }
    function done(arg0) {
      // register done
      if (typeof arg0 === 'function') {
        doneFn = arg0;
      } else {
        // trigger done
        if (typeof doneFn === 'function') {
          doneFn(arg0);
        }
      }
    }
  }

  /**
   * @memberOf SOC_meeting
   */
  function createMeetingNewUi(mt) {

    var view$;
    var doneFn;

    view$ = $('<div>').addClass('meeting-new');

    initMeetingNewUi();

    return {
      'view' : view,
      'done' : done,
      'show' : show,
      'hide' : hide
    };

    function initMeetingNewUi() {
      var i, parameterUiList, u, table$;
      parameterUiList = uiDef('newMeetingInstance');
      view$.append(mtTitle('New Meeting :: ' + mt.name, 2));
      table$ = $('<table>').appendTo(view$);
      for (i = 0; i < parameterUiList.fields.length; i++) {
        u = parameterUiList.fields[i];
        table$.append($('<tr>').append(
        //
        $('<td>').text(L(u.label || u.name)),
        //
        $('<td>').append(u.ui.view())));
      }
      view$.append($('<div>').addClass('buttons').append(
          mtButton('save', function() {
            var params = parameterUiList.params();
            var bi$;
            params.meetingTypeTid = mt.meetingTypeTid;
            view$.append(bi$ = busyIcon());
            APP_data.callSq(SQ_saveNewMeetingInstance, params, function(data) {
              bi$.remove();
              done(data);
            });
          }), mtButton('cancel', function() {
            done();
          })));
    }

    function view() {
      return view$;
    }
    function done(arg0) {
      if (typeof arg0 === 'function') {
        doneFn = arg0;
      } else {
        if (typeof doneFn === 'function') {
          doneFn(arg0);
        }
      }
    }
    function show(arg0) {
      view$.show(arg0);
    }
    function hide(arg0) {
      view$.hide(arg0);
    }

  }

  /**
   * @memberOf SOC_meeting
   */
  function createMeetingUi(meeting, agendaList) {

    var view$, doneFn;
    var header$, main$, newAgendaPanel$, agendaList$, agendaPanel$;

    view$ = $('<div>').addClass('meeting');
    header$ = $('<div>').addClass('header');
    main$ = $('<div>').addClass('main');
    view$.append(header$, main$);
    //
    newAgendaPanel$ = $('<div>').addClass('new-agenda-panel').hide();
    agendaList$ = $('<div>').addClass('agenda-list-panel');
    agendaPanel$ = $('<div>').addClass('agenda-panel').hide();
    main$.append(newAgendaPanel$, agendaList$, agendaPanel$);

    initMeetingUi(meeting, agendaList);

    return {
      'view' : view,
      'done' : done,
      'show' : show,
      'hide' : hide
    };

    function initMeetingUi(meeting, agendaList) {
      var done$, toolbar$;
      // header
      mtTitle(
          'Meeting :: ' + meeting.name + ' :: Date: '
              + APP_base.toIsoDate(meeting.startTime), 2).appendTo(header$);

      toolbar$ = $('<div>').addClass('toolbar').appendTo(header$);

      mtButton('new-agenda', function() {
        var ui = createAgendaNewUi(meeting);
        ui.done(function(arg0) {
          refreshAgendaList(arg0);
          showAgendaList();
        });
        newAgendaPanel$.empty().append(ui.view());
        showNewAgendaPanel();
      }).appendTo(toolbar$);
      mtButton('done', function() {
        done();
      }).appendTo(toolbar$);
      // main
      agendaList$.append(busyIcon());
      APP_data.callSq(SQ_getAgendaList, {
        'meetingTid' : meeting.meetingTid
      }, refreshAgendaList);
    }

    function view() {
      return view$;
    }
    function done(arg0) {
      if (typeof arg0 === 'function') {
        doneFn = arg0;
      } else {
        if (typeof doneFn === 'function') {
          doneFn(arg0);
        }
      }
    }
    function show(arg0) {
      view$.show(arg0);
    }
    function hide(arg0) {
      view$.hide(arg0);
    }

    function showAgendaPanel() {
      newAgendaPanel$.hide('fast');
      agendaList$.hide('fast');
      agendaPanel$.show('fast');
    }

    function showAgendaList() {
      newAgendaPanel$.hide('fast');
      agendaPanel$.hide('fast');
      agendaList$.show('fast');
    }

    function showNewAgendaPanel() {
      agendaList$.hide('fast');
      agendaPanel$.hide('fast');
      newAgendaPanel$.show('fast');
    }

    function refreshAgendaList(data) {
      var list = rQ.toList(data);
      var p$, table$, list$;
      var u, cb;
      agendaList$.empty();
      if (list.length === 0) {
        agendaList$.append(infoBox('meeting-has-no-agenda'));
      } else {
        // agendaList$.append(mtTitle('size-of-agenda-list : ' + list.length,
        // 3));
        p$ = $('<div>').addClass('agenda-list').appendTo(agendaList$);
        for (i = 0; i < list.length; i++) {
          u = list[i];
          cb = (function(u) {
            return function() {
              // get content for agenda
              /**
               * @memberOf multi
               */
              APP_data.callSqMulti([ {
                'serviceId' : SQ_getAgenda,
                parameters : {
                  'agendaTid' : u.agendaTid
                }
              } ], function(prArray) {
                var ui, agenda;
                agenda = rQ.toList(prArray[0]).pop();
                ui = createAgendaUi(meeting, agenda);
                ui.done(showAgendaList);
                agendaPanel$.empty().append(ui.view());
                showAgendaPanel();
              });
            };
          })(u);
          p$.append($('<div>').addClass(i % 2 == 0 ? 'even' : 'odd').addClass(
              'agenda-list-element').append(
              //
              $('<div>').addClass('name').text(u.name),
              //
              $('<div>').addClass('description').text(u.description),
              //
              $('<div>').addClass('creatorUserId').text(
                  APP_base.toIsoDate(u.creatorUserId)),
              //
              $('<div>').addClass('actions').text('agenda-actions')
          //
          ).click(cb));
        }
      }
    }

  }

  /**
   * @memberOf SOC_meeting
   */
  function createAgendaNewUi(meeting) {

    var view$;
    var doneFn;

    view$ = $('<div>').addClass('agenda-new');

    initAgendaNewUi(meeting);

    return {
      'view' : view,
      'done' : done,
      'show' : show,
      'hide' : hide
    };

    function initAgendaNewUi(meeting) {
      var i, parameterUiList, u, table$;
      parameterUiList = uiDef('newAgenda');
      view$.append(mtTitle('New Agenda for :: ' + meeting.name, 2));
      table$ = $('<table>').appendTo(view$);
      for (i = 0; i < parameterUiList.fields.length; i++) {
        u = parameterUiList.fields[i];
        table$.append($('<tr>').append(
        //
        $('<td>').text(L(u.label || u.name)),
        //
        $('<td>').append(u.ui.view())));
      }
      view$.append($('<div>').addClass('buttons').append(
          mtButton('save', function() {
            var params = parameterUiList.params();
            var bi$;
            params.meetingTid = meeting.meetingTid;
            view$.append(bi$ = busyIcon());
            APP_data.callSq(SQ_saveNewAgenda, params, function(data) {
              bi$.remove();
              done(data);
            });
          }), mtButton('cancel', function() {
            done();
          })));
    }

    function view() {
      return view$;
    }
    function done(arg0) {
      if (typeof arg0 === 'function') {
        doneFn = arg0;
      } else {
        if (typeof doneFn === 'function') {
          doneFn(arg0);
        }
      }
    }
    function show(arg0) {
      view$.show(arg0);
    }
    function hide(arg0) {
      view$.hide(arg0);
    }

  }

  /**
   * @memberOf SOC_meeting
   */
  function createAgendaUi(meeting, agenda, subAgendaList) {

    var view$;
    var main$;
    var header$, main$, documents$;
    var toolbar$;
    var doneFn;

    view$ = $('<div>').addClass('agenda');
    header$ = $('<div>').addClass('header');
    main$ = $('<div>').addClass('main');
    documents$ = $('<div>').addClass('documents');

    view$.append(header$, main$, documents$);

    init();

    return {
      'view' : view,
      'done' : done,
      'show' : show,
      'hide' : hide
    };

    function init() {
      mtTitle('Agenda :: ' + agenda.name, 2).appendTo(header$);
      toolbar$ = $('<div>').addClass('toolbar').appendTo(header$);

      mtButton('new-sub-agenda', function() {
        alert('not-yet-implemented');
      }).appendTo(toolbar$);
      mtButton('done', function() {
        done();
      }).appendTo(toolbar$);
      // main
    }

    function view() {
      return view$;
    }
    function done(arg0) {
      if (typeof arg0 === 'function') {
        doneFn = arg0;
      } else {
        if (typeof doneFn === 'function') {
          doneFn(arg0);
        }
      }
    }
    function show(arg0) {
      view$.show(arg0);
    }
    function hide(arg0) {
      view$.hide(arg0);
    }
  }

  /**
   * @memberOf SOC_meeting
   */

  function createDocumentListUi(agendaTid, settings) {

    var view$, header$, main$;
    var fileStruct;
    var toolbar$, files$, footer$, newDirectoryBt$, newDirectoryUi, showDotFiles$, deleteBt$, showIconView$;
    var display, currentDir, driveDir;

    settings = settings || {};
    display = settings.display || 'normal';
    driveDir = settings.driveDir || '';
    currentDir = settings.currentDir || settings.driveDir;

    view$ = $('<div>').addClass('document-list');
    header$ = $('<div>').addClass('header');
    main$ = $('<div>').addClass('main');
    view$.append(header$, main$);

    init(agendaTid);

    return {
      'view' : view,
      'show' : show,
      'hide' : hide
    };

    function init(agendaTid) {
      toolbar$ = $('<div>').addClass('toolbar').appendTo(header$);
      files$ = $('<div>').addClass('files').appendTo(main$);
      footer$ = $('<div>').addClass('document-list-footer').appendTo(main$);
      //
      if (agendaTid === undefined) {
        main$.text('agendaTid-missing');
      }
      refreshDocumentList();
    }

    function refreshDocumentList(data) {

      if (data === undefined) {
        APP_data.callSq(SQ_getAgendaFileList, {
          'agendaTid' : agendaTid
        }, refreshDocumentList);
        return;
      }

      var list;

      list = rQ.toList(data);
      buildUi(list);

      function buildUi(list) {
        files$.empty();
        fileStruct = processFiles(list);
        alert('fileStruct done!');
      }
    }

    // fileList :: filename, ord
    function processFiles(list) {

      var i, file, filename, main, hist;
      var files = {
        'hist' : {},
        'main' : {},
        'list' : [],
        'ordList' : ordList
      };

      for (i = 0; i < list.length; i++) {
        file = list[i];
        filename = file.filename;
        main = files.main[filename];
        if (main === undefined) {
          files.main[filename] = file;
          files.list.push(file);
        } else {
          hist = files.hist[filename];
          hist = hist ? hist : [];
          hist.push(file);
          files.hist[filename] = hist;
        }
      }
      return files;

      function move(index, movement) {
        moveElementInArray(files.list, index, movement);
      }

      function ordList() {
        var i, res = [];
        // [{'fileTid':'1234'},{'fileTid':'334'}]
        for (i = 0; i < files.list.length; i++) {
          res.push(files.list[i].fileTid);
        }
      }
    }

    //
    // COPIED OVER
    //

    function update(directory, fileList) {
      var fileList$ = createFileListView(fileList);
      files$.empty().append($('<div>', {
        'text' : directory,
        'class' : 'ui-explorer-files-currentdir'
      }), fileList$);
    }

    function createFileListView(fileList) {
      var files;
      var data;
      var header = [ 'fileTid', 'filename', 'owner', 'created', 'actions' ];
      var view$ = $('<div>').addClass('ui-explorer-detailview');
      if (fileList.length > 0) {
        var headerTable$, dataTable$;
        var tr$, i;

        // header
        headerTable$ = $('<table>').addClass('header').appendTo(view$);
        tr$ = $('<tr>').addClass('header');
        headerTable$.append(tr$);
        for (i = 0; i < header.length; i++) {
          var head = header[i];
          tr$.append($('<td>').text(L(head)).addClass(head).toggle(function() {
            fileSort(head, true);
          }, function() {
            fileSort(head, false);
          }));
        }

        // data
        dataTable$ = $('<table>').addClass('data').appendTo(view$);
        files = processFiles(fileList);

        function fileSort(name, rev) {
          if (files && files.list) {// sorting test
            files.list = _.sortBy(files.list, function(row) {
              var value = row['name'] || '-';
              if (name === 'length') {
                return parseInt(value, 10);
              }
              return value;
            });
            if (rev) {
              files.list.reverse();
            }
            refresh();
          }
        }

        refresh();

        function refresh() {
          dataTable$.empty();
          $.each(files.list, function(i, row) {
            // 0 : fileTid
            // 1 : filename
            // 
            var filename = row.filename;
            var isDotFile = filename.indexOf('.') == 0;
            var hist = files.hist[filename];
            var head, td$;

            tr$ = $('<tr>').addClass('data').appendTo(dataTable$);
            for (i = 0; i < header.length; i++) {
              head = header[i];
              td$ = $('<td>').addClass(head);
              if (head === 'actions') {
                td$.append(button('del', function() {
                  APP_data.callSq(SQ_delete, {
                    'fileTid' : row.fileTid,
                    'directory' : currentDir
                  }, function(data) {
                    gotoDir(currentDir, data);
                  });
                }));
                if (hist) {
                  td$.append(batch(hist.length + 1, function() {
                    var d$ = dialog();
                    var this$ = $(this);
                    d$.appendTo(this$);
                    $.each(hist, function(i, row) {
                      d$.append(button(row.created));
                    });
                  }));
                }
              } else if (head === 'fileTid') {
                if (showIconView$.hasClass('selected')) {
                  td$.append($('<img>', {
                    'src' : 'docu?opid=getIconFor&subid=' + row.fileTid,
                    'title' : filename
                  }).css('max-height', '60px'));
                } else {
                  td$.text(row[head]);
                }
              } else if (i == 1) {
                if (!isDotFile) {
                  td$.append($('<a>', {
                    'href' : 'docu?opid=getFile&subid=' + row.fileTid,
                    'target' : '_blank',
                    'title' : filename
                  }).text(filename));
                } else {
                  td$.text(row[head]);
                }
              } else {
                td$.text(row[head]);
              }
              tr$.append(td$);
            }
          });
        }
      } else {
        logger.error('No data available for ' + directory);
      }
      return view$;

    }

    function view() {
      return view$;
    }
    function show() {
      return view$.show();
    }
    function hide() {
      return view$.hide();
    }
  }

  /**
   * @memberOf SOC_meeting.uidef
   */
  function uiDef(name) {
    switch (name) {
    case 'newMeeting':
      return newMeeting();
    case 'newMeetingInstance':
      return newMeetingInstance();
    case 'newAgenda':
      return newAgenda();
    default:
      break;
    }
    return null;

    function newMeeting() {
      var def = {
        'fields' : [ {
          'name' : 'name',
          'label' : 'name-of-the-meeting-type',
          'uiType' : 'input'
        }, {
          'name' : 'description',
          'label' : 'description-of-the-meeting-type',
          'uiType' : 'input'
        }, {
          'name' : 'department',
          'label' : 'department',
          'uiType' : 'select'
        }, {
          'name' : 'internal',
          'label' : 'internal-meeting',
          'uiType' : 'button'
        }, {
          'name' : 'access',
          'label' : 'access',
          'uiType' : 'input',
          'value' : '1'
        } ]
      };
      def.views = viewsFn(def);
      def.params = paramsFn(def);
      // init
      def.views();
      return def;
    }

    function newMeetingInstance() {
      var def = {
        'fields' : [ {
          'name' : 'name',
          'label' : 'name-of-the-meeting',
          'uiType' : 'input'
        }, {
          'name' : 'description',
          'label' : 'description-of-the-meeting',
          'uiType' : 'textarea'
        }, {
          'name' : 'location',
          'label' : 'location-of-the-meeting',
          'uiType' : 'input',
          'value' : '-no-location-'
        }, {
          'name' : 'startTime',
          'label' : 'time-when-the-meeting-starts',
          'uiType' : 'date',
          'valueType' : 'ms'
        }, {
          'name' : 'endTime',
          'label' : 'time-when-the-meeting-ends',
          'uiType' : 'date',
          'valueType' : 'ms'
        }, {
          'name' : 'chair',
          'label' : 'default-chair',
          'uiType' : 'input',
          'valueType' : 'ms'
        } ]
      };
      def.views = viewsFn(def);
      def.params = paramsFn(def);
      // init
      def.views();
      return def;
    }

    function newAgenda() {
      var def = {
        'fields' : [ {
          'name' : 'name',
          'label' : 'name-of-the-agenda',
          'uiType' : 'input'
        }, {
          'name' : 'description',
          'label' : 'description-of-the-agenda',
          'uiType' : 'textarea'
        } ]
      };
      def.views = viewsFn(def);
      def.params = paramsFn(def);
      // init
      def.views();
      return def;
    }

  }

  function viewsFn(that) {
    return function() {
      var i, field, views = [];
      for (i = 0; i < that.fields.length; i++) {
        field = that.fields[i];
        if (!field.ui) {
          field.ui = APP_ui.widgetUi(field);
        }
        views.push(field.ui.view());
      }
      return views;
    };
  }

  function paramsFn(that) {
    return function() {
      var i, field, p, params = {};
      for (i = 0; i < that.fields.length; i++) {
        field = that.fields[i];
        if (field.ui) {
          params[field.name] = field.ui.value();
        }
      }
      return params;
    };
  }

  /**
   * @memberOf SOC_meeting.base
   */
  // Label
  function L(name) {
    return name;
  }
  /**
   * @memberOf SOC_meeting.base
   */
  // Description
  function D(name) {
    return name;
  }
  /**
   * @memberOf SOC_meeting.base
   */
  // Message
  function M() {
    var i = 0;
    var name;
    re = /{}/;

    try {
      $.each(arguments, function(i, v) {
        if (i == 0) {
          name = L(v);
        } else {
          name = name.replace(re, v);
        }
        i++;
      });
    } catch (e) {
      logger.error('' + e);
    }
    return name;
  }

  /**
   * @memberOf SOC_meeting.ui
   */
  // Message
  function busyIcon() {
    return $('<div>').addClass('mt-busy-icon');
  }
  /**
   * @memberOf SOC_meeting.ui
   */
  function warnMsg(msg) {
    return $('<div>').addClass('mt-warn-msg').text(msg);
  }

  /**
   * @memberOf SOC_meeting.ui
   */
  function mtButton(name, callback) {

    // var b$ = $('<div>').addClass('mt-button');
    // b$.append($('<span>').text(L(name)));
    // b$.click(function(e) {
    // if (callback) {
    // callback(e);
    // }
    // });
    // return b$;

    var b$ = APP_ui.button(L(name), function(e) {
      if (callback) {
        callback(e);
      }
    });
    return b$;
  }

  /**
   * @memberOf SOC_meeting.ui
   */
  function mtButtonBusy(b$) {
    b$.button('option', 'icons', {
      // primary: 'ui-icon-custom'
      secondary : 'ui-icon-custom-busy'
    });
    b$.button('option', 'text', true);
  }

  /**
   * @memberOf SOC_meeting.ui
   */
  function mtButtonDone(b$) {
    b$.button('option', 'icons', {});
    b$.button('option', 'text', true);
  }

  /**
   * @memberOf SOC_meeting.ui
   */
  function mtTitle(name, level) {
    var b$ = $('<div>').addClass('title' + level);
    b$.append($('<span>').text(L(name)));
    return b$;
  }

  /**
   * @memberOf SOC_meeting.ui
   */
  function infoBox(name) {
    return $('<div>').addClass('info-box').text(L(name));
  }

  function warnBox(name) {
    return $('<div>').addClass('warn-box').text(L(name));
  }

}).call(this);
