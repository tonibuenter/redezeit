(function(root) {

 var DEBUG = false;

 var ACCESS = {
   '1': 'view',
   '5': 'admin',
   '6': 'manage'
 };

 if (root && root['APP_ui_meeting']) {
   return;
 }

 // ******
 // public
 // ******

 root['APP_ui_meeting'] = {
   'createUi': createUi,
   'createMeetingTypeListUi': createMeetingTypeListUi,
   'createMeetingTypeUi': createMeetingTypeUi,
   'createMeetingTypeNewUi': createMeetingTypeNewUi
 };

 // SQs

 var SQ_UserInfo = 'USER_DATA.mySelect';
 var SQ_getTypeList = 'MEETING.getTypeList';
 var SQ_insertType = 'MEETING.insertType';
 var SQ_deleteType = 'MEETING.deleteType';
 // meeting
 var SQ_getMeetingList = 'MEETING.getMeetingList';
 var SQ_insertMeeting = 'MEETING.insertMeeting';
 var SQ_deleteMeeting = 'MEETING.deleteMeeting';
 //
 // single meeting content
 //
 var SQ_getAgendaList = 'MEETING.getAgendaList';
 var SQ_insertAgenda = 'MEETING.insertAgenda';
 var SQ_deleteAgenda = 'MEETING.deleteAgenda';

 var SQ_saveAgendaMinute = 'MEETING.saveAgendaMinute';

 var SQ_getMeeting = 'MEETING.getMeeting';
 var SQ_getAgenda = 'MEETING.getAgenda';
 //
 var SQ_getAgendaFiles = 'MEETING.getAgendaFiles';
 var SQ_deleteAgendaFile = 'MEETING.deleteAgendaFile';
 var SQ_uploadAgendaFiles = 'MEETING.uploadAgendaFiles';
 //
 //

 //
 // live meeting support
 //
 var SQ_liveMeeting = 'MEETING.liveMeeting';

 var SQ_deleteFile = 'MEETING.deleteFile';
 var SQ_saveFileOrder = 'MEETING.saveFileOrder';

 // URLs
 var URL_ajaxLoader = 'img/ajax-loader.gif';
 var URL_trans = 'img/trans.gif';

 var logger = APP_base.logger;
 var busyIcon$;

 /**
  * @memberOf APP_ui_meeting
  */
 function createUi(settings) {
   // ui
   var view$, main$;
   var doneFn, logPanel$;

   view$ = $('<div>').addClass('mp');
   // busyIcon$ = $('<div>').addClass('mt-busy-icon').appendTo(view$);
   busyIcon$ = $('<div>').addClass('mp-cool-icon').appendTo(view$);
   coolBusyIcon(busyIcon$);

   main$ = $('<div>').addClass('main').appendTo(view$);

   if (DEBUG) {
     logPanel$ = createLogDialog().appendTo($('body'));
   }

   startMain();

   return {
     'view': view,
     'done': done
   };

   function startMain() {

     callMp(SQ_UserInfo, {}, function(data) {
       var userInfo = rQ.toList(data);
       var ui = createMeetingTypeListUi(userInfo, undefined, APP_base.localStorage.get('mp-typeTid'));
       main$.empty().append(ui.view());
     });

     // busyIcon();
     // APP_data.callSqMulti([ {
     // 'serviceId': SQ_UserInfo
     // } ], function(prArray) {
     // var userInfo = rQ.toList(prArray[0]);
     // var ui = createMeetingTypeListUi(userInfo);
     // main$.empty().append(ui.view());
     // });
   }

   function createLogDialog() {
     var log$ = $('<div>').addClass('log-panel');
     var content$ = $('<div>').addClass('content').appendTo(log$);
     var icon$ = $('<div>').addClass('icon').appendTo(log$);

     APP_base.logger.logFn(function(s, args) {
       var a;
       if (_.isArguments(args)) {
         for (a in args) {
           content$.append($('<div>').text(JSON.stringify(args[a])).addClass(s));
         }
       } else {
         content$.append($('<div>').text(JSON.stringify(args)).addClass(s));
       }
     });
     return log$;
   }

   function view() {
     return view$;
   }
   function done(arg0) {
     if (typeof arg0 === 'function') {
       doneFn = arg0;
     } else {
       logPanel$.remove();
       if (typeof doneFn === 'function') {
         doneFn(arg0);
       }
     }
   }
 }

 /**
  * @memberOf APP_ui_meeting
  */
 function createMeetingTypeListUi(userInfo, mtData, startWithTypeTid) {

   var view$;
   var header$;
   var main$, meetingTypeList$, meetingType$, mtPanels, newMeetingType$;
   var doneFn, currentMtMap;

   view$ = $('<div>').addClass('meeting-type-list-view');
   header$ = $('<div>').addClass('header');
   main$ = $('<div>').addClass('main');
   meetingTypeList$ = $('<div>').addClass('meeting-type-list');
   meetingType$ = $('<div>').addClass('meeting-type');
   newMeetingType$ = $('<div>').addClass('new-meeting-type');

   view$.append(header$, main$);
   main$.append(meetingTypeList$, meetingType$, newMeetingType$);
   mtPanels = APP_base.sArray();

   init(mtData);

   return {
     'view': view,
     'show': show,
     'hide': hide,
     'done': done,
     'refresh': refresh,
     'mini': mini
   };

   function init(mtData) {
     var toolbar$, left$, right$;
     toolbar$ = $('<div>').addClass('toolbar');
     left$ = $('<div>').addClass('float-left');
     right$ = $('<div>').addClass('float-right');
     left$.append(title('Welcome to the Meeting Portal', 1));
     right$.append(button('new meeting type', openMeetingTypeNewUi));
     right$.append(button('refresh', refresh));
     header$.append(toolbar$.append(left$, right$));
     initMeetingTypeList(mtData, true);

     //

     function openMeetingTypeNewUi() {
       var ui = createMeetingTypeNewUi();
       newMeetingType$.empty().append(ui.view());
       ui.done(function(refresh) {
         if (refresh)
           initMeetingTypeList();
         showList();
       });
       showNew();
     }
   }

   function refresh() {
     initMeetingTypeList();
   }

   function initMeetingTypeList(mtData, isInit) {
     showList();
     meetingTypeList$.empty();
     if (_.isUndefined(mtData)) {
       callMp(SQ_getTypeList, {}, function(data) {
         buildList(data);
       });
     } else {
       buildList(mtData);
     }

     // TYPE_TID ORD NAME DESCRIPTION ACCESS_RIGHT_TID
     function buildList(data) {
       var animFn;
       var t = (new Date()).getTime();
       var mtList = rQ.toList(data);
       var openStartFn;
       APP_base.logger.info('found ' + mtList.length + ' MeetingType entries.');

       currentMtMap = currentMtMap || {};
       meetingType$.empty();
       meetingTypeList$.empty().hide();
       mtPanels = APP_base.sArray();
       if (mtList.length === 0) {
         meetingTypeList$.append(warnMsg('You have no meeting types!'));
       } else {
         $.each(mtList, function(i, mt) {
           var mt$ = $('<div>').addClass('meeting-type-element').addClass('pointer');
           mt$.addClass(mt.typeTid);
           mt$.click(openMeetingType);
           //
           // detecting new meeting type
           //
           if (isInit && mt.typeTid === startWithTypeTid) {
             openStartFn = openMeetingType;
           }
           if (!isInit && currentMtMap[mt.typeTid] === undefined) {
             // alert('new-meeting-type');
             mt$.addClass("new-meeting-type");
             animFn = function() {
               meetingTypeList$.animate({
                 scrollTop: mt$.offset().top
               }, 2000);
             };
           }
           // TYPE_TID, ORD, NAME, DESCRIPTION, ACCESS_RIGHT_TID
           mt$.append($('<div>').addClass('float-left').text(typeTitle(mt)).addClass('meeting-type-meeting-name'));

           mt$.append($('<div>').addClass('float-right').append(
           //
           APP_ui.button('delete', deleteMeeting)
           //
           ));
           meetingTypeList$.append(mt$);

           //

           function openMeetingType() {
             var ui;
             if (mtPanels.containsKey(mt.typeTid)) {
             } else {
               ui = createMeetingTypeUi(mt);
               ui.done(function() {
                 showList();
               });
               mtPanels.put(mt.typeTid, ui);
               meetingType$.append(ui.view());
             }
             showMeetingType(mt.typeTid);
           }

           function deleteMeeting(e) {
             // alert('deleteMeeting');
             callMp(SQ_deleteType, {
               'typeTid': mt.typeTid
             }, buildList);
           }

         });
         meetingTypeList$.show();
         // alert('time used for buildList(mtList): ' + ((new Date()).getTime() - t));
       }
       if (_.isFunction(animFn)) {
         // animFn();
       }
       currentMtMap = APP_data.arrayObjectToMap(mtList, 'typeTid');
       if (_.isFunction(openStartFn)) {
         openStartFn();
       }
     }
   }

   function showList() {
     header$.show();
     meetingType$.hide('fast');
     newMeetingType$.hide('fast');
     meetingTypeList$.show('fast');
   }

   function showNew() {
     header$.show();
     meetingTypeList$.hide('fast');
     meetingType$.hide('fast');
     newMeetingType$.show('fast');
   }

   function showMeetingType(typeTid) {
     header$.hide();
     meetingTypeList$.hide('fast');
     newMeetingType$.hide('fast');
     meetingType$.show('fast');
     if (typeTid === undefined) {
       alert('oops, no panel open for: ' + typeTid);
       meetingTypeList$.show();
       return;
     }
     APP_base.localStorage.set('mp-typeTid', typeTid);
     mtPanels.iterate(function(k, ui) {
       if (typeTid === k) {
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
     var typeTid;
     if (_.isObject(arg0)) {
       typeTid = arg0.typeTid;

     }
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
  * @memberOf APP_ui_meeting
  */
 function createMeetingTypeNewUi() {

   var i, view$, parameterUiList, u, table$, save$, done$;
   var doneFn;
   view$ = $('<div>');

   parameterUiList = uiDef('newMeetingType');
   view$.append(title('New Meeting Type ...', 2));
   table$ = $('<table>').appendTo(view$);
   for (i = 0; i < parameterUiList.fields.length; i++) {
     u = parameterUiList.fields[i];
     table$.append($('<tr>').append(
     //
     $('<td>').text(L(u.label || u.name)),
     //
     $('<td>').append(u.ui.view())));
   }
   view$.append($('<div>').addClass('buttons').append(save$ = button('save', function() {
     var params = parameterUiList.params();
     callMp(SQ_insertType, params, function(data) {
       done(true);
     });
   }), button('cancel', function() {
     done();
   })));

   return {
     'view': view,
     'done': done,
     'show': show,
     'hide': hide
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
  * @memberOf APP_ui_meeting
  */
 function createMeetingTypeUi(mt) {
   var view$, doneFn;
   var header$, main$, newMeetingPanel$, meetingList$, meetingPanel$;
   var typeTid = mt.typeTid;

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
     'view': view,
     'show': show,
     'hide': hide,
     'done': done
   };

   function initMeetingTypeUi(mt) {
     var toolbar$, left$, right$;
     // header
     toolbar$ = $('<div>').addClass('toolbar');
     left$ = $('<div>').addClass('float-left');
     right$ = $('<div>').addClass('float-right');

     left$.append(title(typeTitle(mt), 2));
     right$.append(button('new meeting', openNewMeeting), button('done', function() {
       done();
     }), button('refresh', refresh));

     header$.append(toolbar$.append(left$, right$));
     refresh();

     //

     function openNewMeeting() {
       var ui = createMeetingNewUi(mt);
       ui.done(function(arg0) {
         refreshMeetingList(arg0);
       });
       newMeetingPanel$.empty().append(ui.view());
       showNewMeetingPanel();
     }
   }

   function refresh() {
     refreshMeetingList();
   }

   // MEETING_TID TYPE_TID ORD NAME DESCRIPTION LOCATION
   // START_TIME STATUS_TID ACCESS_RIGHT_TID
   function refreshMeetingList(data) {
     showMeetingList();

     if (data === undefined) {
       callMp(SQ_getMeetingList, {
         'typeTid': typeTid
       }, buildList);
     } else {
       buildList(data);
     }

     function buildList(data) {
       var list = rQ.toList(data);
       var p$, table$, list$;
       var row$, m, cb;
       meetingList$.empty();
       if (list.length === 0) {
         meetingList$.append(infoBox('you-have-no-meetings'));
       } else {
         // meetingList$.append(title('number-of-meetings : ' + list.length, 3));

         p$ = $('<div>').addClass('meeting-list').appendTo(meetingList$);
         for (i = 0; i < list.length; i++) {
           m = list[i];
           cb = (function(m) {
             return function() {
               callMp(SQ_getAgendaList, {
                 'meetingTid': m.meetingTid,
                 'typeTid': mt.typeTid
               }, function(data) {
                 var ui = createMeetingUi(m, data);
                 ui.done(showMeetingList);
                 meetingPanel$.empty().append(ui.view());
                 showMeetingPanel();
               });
             };
           })(m);

           row$ = $('<div>').addClass(i % 2 == 0 ? 'even' : 'odd').addClass('meeting-list-element');
           row$.click(cb);
           row$.append($('<div>').addClass('float-left').append(
           //
           $('<div>').addClass('name').text(m.name),
           //
           $('<div>').addClass('description').text(m.description)));
           // delete button
           row$.append($('<div>').addClass('float-right').append(APP_ui.button('delete', (function(m) {
             return function() {
               callMp(SQ_deleteMeeting, {
                 'meetingTid': m.meetingTid,
                 'typeTid': typeTid
               }, function(data) {
                 refreshMeetingList(data);
               });
             };
           })(m))
           // ...
           ));
           // open agenda list

           p$.append(row$);
         }
       }
     }
   }

   function showMeetingPanel() {
     header$.hide();
     newMeetingPanel$.hide('fast');
     meetingList$.hide('fast');
     meetingPanel$.show('fast');
   }

   function showMeetingList() {
     header$.show();
     newMeetingPanel$.hide('fast');
     meetingPanel$.hide('fast');
     meetingList$.show('fast');
   }

   function showNewMeetingPanel() {
     header$.show();
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

 function typeTitle(mt) {
   return (DEBUG ? ('MT :: ' + mt.typeTid + ', ') : '') + mt.name + " (" + ACCESS[mt.accessRightTid] + ")";
 }

 /**
  * @memberOf APP_ui_meeting
  */
 function createMeetingNewUi(mt) {

   var view$;
   var doneFn;

   view$ = $('<div>').addClass('meeting-new');

   initMeetingNewUi();

   return {
     'view': view,
     'done': done,
     'show': show,
     'hide': hide
   };

   function initMeetingNewUi() {
     var i, parameterUiList, u, table$;
     parameterUiList = uiDef('newMeeting');
     view$.append(title('New Meeting for : ' + mt.name, 2));
     table$ = $('<table>').appendTo(view$);
     for (i = 0; i < parameterUiList.fields.length; i++) {
       u = parameterUiList.fields[i];
       table$.append($('<tr>').append(
       //
       $('<td>').text(L(u.label || u.name)),
       //
       $('<td>').append(u.ui.view())));
     }
     view$.append($('<div>').addClass('buttons').append(button('save', function() {
       var params = parameterUiList.params();
       params.typeTid = mt.typeTid;
       callMp(SQ_insertMeeting, params, function(data) {
         done(data);
       });
     }), button('cancel', function() {
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
  * @memberOf APP_ui_meeting
  */
 function createMeetingUi(meeting, agendaListData) {

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

   initMeetingUi(meeting, agendaListData);

   return {
     'view': view,
     'done': done,
     'show': show,
     'hide': hide,
     'refresh': refresh
   };

   function initMeetingUi(meeting, agendaListData) {
     var toolbar$, left$, right$;
     toolbar$ = $('<div>').addClass('toolbar');
     left$ = $('<div>').addClass('float-left');
     right$ = $('<div>').addClass('float-right');

     left$.append(title(meetingTitle(meeting), 2));

     right$.append(button('new-agenda', openNewAgenda),
     //
     button('done', function() {
       done();
     }),
     //
     button('refresh', refresh));

     header$.append(toolbar$.append(left$, right$));
     refresh();

     //

     function openNewAgenda() {
       var ui = createAgendaNewUi(meeting);
       ui.done(function(data) {
         refreshAgendaList(data);
         showAgendaList();
       });
       newAgendaPanel$.empty().append(ui.view());
       showNewAgendaPanel();
     }

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
   function refresh() {
     refreshAgendaList();
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

   function openAgendaPanel(a) {
     var ui = createAgendaUi(a);
     ui.done(refresh);
     ui.select(function(agenda) {
       openAgendaPanel(agenda);
     });
     agendaPanel$.empty().append(ui.view());
     showAgendaPanel();
   }

   function refreshAgendaList(data) {
     if (data === undefined) {
       callMp(SQ_getAgendaList, {
         'meetingTid': meeting.meetingTid
       }, buildList);
     } else {
       buildList(data);
     }

     function buildList(data) {
       var list = rQ.toList(data);
       var p$, row$, table$, list$;
       var a, cb;
       agendaList$.empty();
       if (list.length === 0) {
         agendaList$.append(infoBox('Meeting has no agenda'));
       } else {
         // agendaList$.append(title('size-of-agenda-list : ' + list.length, 3));
         p$ = $('<div>').addClass('agenda-list');
         for (i = 0; i < list.length; i++) {
           a = list[i];
           cb = (function(a) {
             return function() {
               openAgendaPanel(a);
             };
           })(a);

           row$ = $('<div>').addClass(i % 2 == 0 ? 'even' : 'odd').addClass('agenda-list-element');
           row$.click(cb);
           row$.append(
           // left :: name etc
           $('<div>').addClass('float-left').append(
           //
           $('<div>').addClass('name').text(agendaTitle(a))
           //
           ),
           // right :: buttons
           $('<div>').addClass('float-right').append(APP_ui.button('delete', function() {
             callMp(SQ_deleteAgenda, {
               'agendaTid': a.agendaTid,
               'meetingTid': a.meetingTid
             }, refreshAgendaList);
           })));

           p$.append(row$);
           agendaList$.append(p$);
         }
       }
       showAgendaList();
     }
   }

 }

 function meetingTitle(meeting) {
   return (DEBUG ? ('Meeting :: ' + meeting.meetingTid + ', ') : '') + meeting.name;
 }

 /**
  * @memberOf APP_ui_agenda
  */
 function createAgendaNewUi(meeting) {

   var view$;
   var doneFn;

   view$ = $('<div>').addClass('agenda-new');

   initAgendaNewUi(meeting);

   return {
     'view': view,
     'done': done,
     'show': show,
     'hide': hide
   };

   function initAgendaNewUi(meeting) {
     var i, parameterUiList, u, table$;
     parameterUiList = uiDef('newAgenda');
     view$.append(title('New Agenda for :: ' + meeting.name, 2));
     table$ = $('<table>').appendTo(view$);
     for (i = 0; i < parameterUiList.fields.length; i++) {
       u = parameterUiList.fields[i];
       table$.append($('<tr>').append(
       //
       $('<td>').text(L(u.label || u.name)),
       //
       $('<td>').append(u.ui.view())));
     }
     view$.append($('<div>').addClass('buttons').append(button('save', function() {
       var params = parameterUiList.params();
       params.meetingTid = meeting.meetingTid;
       callMp(SQ_insertAgenda, params, function(data) {
         done(data);
       });
     }), button('cancel', function() {
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
  * @memberOf APP_ui_agenda
  */
 function createAgendaBreadCrumbsUi(agenda) {

   var view$, selectFn;
   var flag = true, size = 0;
   view$ = $('<ul>').addClass('breadcrumbs');

   refresh();

   return {
     'view': view,
     'refresh': refresh,
     'select': select,
     'size': function() {
       return size;
     }
   };

   function refresh(data) {
     if (_.isUndefined(data)) {
       callMp(SQ_getAgendaList, {
         'meetingTid': agenda.meetingTid
       }, function(data) {
         build(data);
       });
     } else {
       build(data);
     }
     //
     function build(data) {
       var list = rQ.toList(data);
       view$.empty();
       if (list.length > 1) {

         $.each(list, function(i, a) {
           var a$ = $('<a>', {
             'href': '#'
           }).text(a.name);
           if (a.agendaTid === agenda.agendaTid) {
             a$.addClass('current');
             a$.click(toggleMin);
           } else {
             a$.click(function(e) {
               e.preventDefault();
               e.stopPropagation();
               select(a);
             });
           }
           view$.append($('<li>').append(a$));
         });
       }
     }

   }
   function toggleMin(e) {
     e.preventDefault();
     e.stopPropagation();
     if (flag) {
       view$.find('li').hide();
       view$.find('a.current').parent().show();
     } else {
       view$.find('li').show();
     }
     flag = !flag;
   }

   function select(arg0) {
     if (_.isFunction(arg0)) {
       selectFn = arg0;
     } else if (_.isFunction(selectFn))
       selectFn.apply(this, arguments);
   }
   function view() {
     return view$;
   }
 }

 /**
  * @memberOf APP_ui_agenda
  */
 function createAgendaUi(agenda) {

   var view$;
   var main$;
   var header$, main$, documents$, meetingMinutesUi, documentListUi;
   var agendaBreadCrumbsUi, selectAgendaFn;
   var toolbar$;
   var doneFn;

   view$ = $('<div>').addClass('agenda');
   header$ = $('<div>').addClass('header');
   main$ = $('<div>').addClass('main');

   documents$ = $('<div>').addClass('documents');

   view$.append(header$, main$, documents$);

   initAgendaUi(agenda);

   return {
     'view': view,
     'done': done,
     'show': show,
     'hide': hide,
     'refresh': refresh,
     'select': selectAgenda
   };

   function initAgendaUi(agenda) {
     var agendaList$, p$, toolbar$, left$, right$;
     //

     // agenda bread crumbs list
     agendaList$ = $('<div>').addClass('agenda-breadcrumb');
     agendaBreadCrumbsUi = createAgendaBreadCrumbsUi(agenda);
     p$ = agendaBreadCrumbsUi.view();
     agendaList$.append(p$);
     agendaBreadCrumbsUi.select(selectAgenda);
     // toolbar
     toolbar$ = $('<div>').addClass('toolbar');
     left$ = $('<div>').addClass('float-left');
     right$ = $('<div>').addClass('float-right');
     left$.append(title(agendaTitle(agenda), 2));

     right$.append(button('new comment', openNewComment), button('done', function() {
       done();
     }), button('refresh', refresh));

     toolbar$.append(left$, right$);
     header$.append(agendaList$, toolbar$
     // , toolbar$.append(left$, right$)
     );
     //
     // documents
     //
     meetingMinutesUi = createMinuteUi();
     meetingMinutesUi.value(agenda);
     main$.append(meetingMinutesUi.view());
     documents$.append(meetingMinutesUi.view());
     documentListUi = createDocumentListUi(agenda);
     documents$.append(documentListUi.view());

     // refresh();

     //

     function openNewComment() {
       alert('openNewComment - nyi');
       // var ui = createMeetingNewUi(mt);
       // ui.done(function(arg0) {
       // refreshMeetingList(arg0);
       // });
       // newMeetingPanel$.empty().append(ui.view());
       // showNewMeetingPanel();
     }

     function openNewSubMeeting() {
       alert('openNewComment - nyi');
       // var ui = createMeetingNewUi(mt);
       // ui.done(function(arg0) {
       // refreshMeetingList(arg0);
       // });
       // newMeetingPanel$.empty().append(ui.view());
       // showNewMeetingPanel();
     }

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
   function refresh() {
     documentListUi.refresh();
   }
   function selectAgenda(arg0) {
     if (_.isFunction(arg0)) {
       selectAgendaFn = arg0;
     } else if (_.isFunction(selectAgendaFn)) {
       selectAgendaFn.apply(this, arguments);
     }
   }

 }

 function agendaTitle(agenda) {
   return (DEBUG ? ('Agenda :: ' + agenda.agendaTid + ', ') : '') + agenda.name;
 }

 /**
  * @memberOf APP_ui_mp_document
  *
  */

 function createDocumentListUi(agenda, settings) {

   var view$, header$, main$;
   var fileStruct;
   var files$, footer$, newDirectoryBt$, newDirectoryUi, showDotFiles$, deleteBt$;
   var display, currentDir, driveDir;

   settings = settings || {};
   display = settings.display || 'normal';
   driveDir = settings.driveDir || '';
   currentDir = settings.currentDir || settings.driveDir;

   view$ = $('<div>').addClass('document-list');
   header$ = $('<div>').addClass('header');
   main$ = $('<div>').addClass('main');
   view$.append(header$, main$);

   initDocumentListUi();

   return {
     'view': view,
     'show': show,
     'hide': hide,
     'refresh': refresh
   };

   function initDocumentListUi() {
     var toolbar$ = $('<div>').addClass('toolbar'), title$ = $('<div>').addClass('title2').text('Documents');
     var process$, fileInput, form$;

     fileInput = APP_ui.fileInputUi({
       'multiple': true
     });
     form$ = $('<form>');
     process$ = button('Upload', function() {
       busyIcon(SQ_uploadAgendaFiles);
       APP_data.callSqForm(form$, {
         '$SERVICEID': SQ_uploadAgendaFiles,
         'directory': '/mp/' + agenda.agendaTid + '/',
         'agendaTid': agenda.agendaTid
       }, function(data) {
         busyIconHide(SQ_uploadAgendaFiles);
         refreshDocumentList(data);
       });
     });
     form$.append(fileInput.view(), process$);

     toolbar$.append(form$);

     header$.append(title$, toolbar$);

     //

     files$ = $('<div>').addClass('files');
     footer$ = $('<div>').addClass('document-list-footer');

     main$.append(files$, footer$);

     refreshDocumentList();
   }

   function refreshDocumentList(data) {

     if (data === undefined) {
       callMp(SQ_getAgendaFiles, {
         'agendaTid': agenda.agendaTid
       }, buildList);
       return;
     } else {
       buildList(data);
     }

     function buildList(data) {
       var list = rQ.toList(data);
       var fileList$;
       files$.empty();

       // alert('fileStruct done!');
       fileList$ = renderFileList(list);
       files$.append(fileList$);
     }
   }

   // fileList :: filename, ord
   function processFiles(list) {

     var i, file, filename, main, hist;
     var files = {
       'hist': {},
       'main': {},
       'list': [],
       'ordList': ordList
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
       // [{'fileTid':'1234',...},...]
       for (i = 0; i < files.list.length; i++) {
         res.push(files.list[i].fileTid);
       }
     }
   }

   function renderFileList(list) {
     var view$ = $('<div>').addClass('mp-file-list');
     var fileStruct = processFiles(list);

     $.each(fileStruct.list, function(i, f) {
       //
       var hist = fileStruct.hist[f.filename];
       var p$ = $('<div>').addClass('mp-file');
       var img$ = $('<div>').addClass('mp-file-image');
       var a$;
       var name$ = $('<div>').addClass('mp-file-name').text(f.filename);
       var created$ = $('<div>').addClass('mp-file-date').text(f.created);
       var owner$ = $('<div>').addClass('mp-file-owner').text(f.owner);
       ;
       var actions$ = $('<div>').addClass('mp-file-actions');
       var dialog$ = $('<div>').addClass('mp-file-dialog');

       // skip dot files
       if (f.filename.indexOf('.') == 0) {
         return;
       }

       actions$.append(button('del', deleteAgendaFile));

       if (hist) {
         actions$.append(button('versions:' + hist.length, function() {
           var historyUi = APP_ui.dialogUi();
           var p$ = $('<div>').addClass('mp-files-history-list');
           p$.append($('<h1>').text("File history for " + f.filename));
           $.each(hist, function(i, hf) {
             p$.append($('<div>').addClass('mp-file-history').append($('<a>', {
               'href': 'docu?opid=getFile&subid=' + hf.fileTid,
               'target': '_blank',
               'title': hf.created,
               'text': hf.created + ' (' + hf.owner + ')'
             }).addClass('mp-file-link'),
             //
             APP_ui.button('del', function deleteAgendaFile() {
               callMp(SQ_deleteAgendaFile, {
                 'fileTid': hf.fileTid,
                 'agendaTid': agenda.agendaTid
               }, function() {
                 historyUi.view().remove();
                 refreshDocumentList.apply(this, arguments);
               });
             })));
           });
           historyUi.content(p$);
           historyUi.done(function() {
             historyUi.view().remove();
           });
           historyUi.show();
         }));
       }

       a$ = $('<a>', {
         'href': 'docu?opid=getFile&subid=' + f.fileTid,
         'target': '_blank',
         'title': f.filename,
         'text': f.filename
       }).addClass('mp-file-link');

       img$.append($('<a>', {
         'href': 'docu?opid=getFile&subid=' + f.fileTid,
         'target': '_blank',
         'title': f.filename
       }).append($('<img>', {
         'src': 'docu?opid=getIconFor&subid=' + f.fileTid,
         'title': f.filename
       })));

       p$.append(img$, a$, owner$, created$, actions$);
       view$.append(p$);

       //

       function deleteAgendaFile() {
         callMp(SQ_deleteAgendaFile, {
           'fileTid': f.fileTid,
           'agendaTid': agenda.agendaTid
         }, refreshDocumentList);
       }
     });
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
   function refresh() {
     refreshDocumentList();
   }
 }

 /**
  * @memberOf APP_ui_meetingMinutes
  */
 function createMinuteUi() {

   var view$, title$, saveBt$, tabUi;
   var titleUi = APP_ui.inputUi();
   var textUi = APP_ui.textareaUi();
   var agenda;

   title$ = $('<div>').addClass('title2').text('Minute');
   saveBt$ = button('save', function() {
     if (!_.isObject(agenda)) {
       return;
     }
     callMp(SQ_saveAgendaMinute, {
       'agendaTid': agenda.agendaTid,
       'minuteTitle': titleUi.value(),
       'minuteText': textUi.value()
     }, function(data) {
       var agenda = rQ.toList(data)[0];
       value(agenda);
     });
   });
   view$ = $('<div>');

   view$.append(title$, titleUi.view().hide(), $('<br>'), textUi.view(), $('<div>').append(saveBt$));

   return APP_ui.wrapAsUi({
     'view': view,
     'value': value
   });

   function value(arg0) {
     if (_.isObject(arg0)) {
       titleUi.value(arg0.minuteTitle);
       textUi.value(arg0.minuteText);
       agenda = arg0;
     }
     return {
       'minuteTitle': titleUi.value(),
       'minuteText': textUi.value
     };
   }
   function view() {
     return view$;
   }
 }

 var meetingDef = {
   'fields': [ {
     'name': 'meetingName',
     'label': 'Meeting name',
     'uiType': 'input'
   }, {
     'name': 'meetingDescription',
     'label': 'Description',
     'uiType': 'textarea'
   }, {
     'name': 'location',
     'label': 'Location',
     'uiType': 'input',
     'value': '-no-location-'
   }, {
     'name': 'startTime',
     'label': 'Start Date',
     'uiType': 'date',
     'valueType': 'ms'
   }, {
     'name': 'duration',
     'label': 'Duration (h)',
     'uiType': 'input'
   }, {
     'name': 'chair',
     'label': 'Chair',
     'uiType': 'input'
   } ]
 };

 /**
  * @memberOf APP_ui_meeting.uidef
  */
 function uiDef(name) {
   switch (name) {
     case 'newMeetingType':
       return newMeetingType();
     case 'newMeeting':
       return newMeeting(meetingDef);
     case 'newAgenda':
       return newAgenda();
     default:
       break;
   }
   return null;

   function newMeetingType() {
     var def = {
       'fields': [ {
         'name': 'typeName',
         'label': 'Name',
         'uiType': 'input'
       }, {
         'name': 'typeDescription',
         'label': 'Description',
         'uiType': 'textarea'
       } ]
     };
     def.views = viewsFn(def);
     def.params = paramsFn(def);
     // init
     def.views();
     return def;
   }

   function newMeeting(def) {
     def.views = viewsFn(def);
     def.params = paramsFn(def);
     // init
     def.views();
     return def;
   }

   function newAgenda() {
     var paramUiList = [];
     var def = {
       'fields': [ {
         'name': 'agendaName',
         'label': 'Name',
         'uiType': 'input'
       }, {
         'name': 'agendaDescription',
         'label': 'Description',
         'uiType': 'textarea'
       } ]
     };

     def.views = viewsFn(def);
     def.params = paramsFn(def);
     // init
     def.views();
     return def;
   }

 }

 /**
  * @memberOf APP_ui
  */
 function buildPUi(uiDefs) {
   var puiList = [];
   var fields = uiDefs.fields || uiDefs;
   var pUi;
   for (i = 0; i < fields.length; i++) {
     field = that.fields[i];
     if (!field.ui) {
       pUi = APP_ui.widgetUi(field);
       pUi.name = field.name;
       pUi.label = field.label || field.name;
       pUi.description = field.description;
     }
     puiList.push(pUi);
   }
   return puiList;
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
  * @memberOf APP_ui_meeting.base
  */
 // Label
 function L(name) {
   return name;
 }
 /**
  * @memberOf APP_ui_meeting.base
  */
 // Description
 function D(name) {
   return name;
 }
 /**
  * @memberOf APP_ui_meeting.base
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
  * @memberOf APP_ui_meeting.base
  */
 // Message
 function callMp(serviceId, parameters, callback) {
   busyIcon(serviceId);
   parameters = parameters || {};
   APP_data.callSqMulti([ {
     'serviceId': serviceId,
     'parameters': parameters
   } ], function(prArray) {
     busyIconHide(serviceId);
     callback(prArray[0]);
   });
 }

 /**
  * @memberOf APP_ui_meeting.ui
  */
 // Message
 function busyIcon(text) {
   busyIcon$.show();
   // busyIcon$.__startTime = (new Date()).getTime();
   // // return $('<div>').addClass('mt-busy-icon');
   // busyIcon$.text(text).show().addClass('running');
 }

 /**
  * @memberOf APP_ui_meeting.ui
  */
 function busyIconHide() {
   busyIcon$.hide();
   // var t = busyIcon$.__startTime;
   // t = busyIcon$.text() + ' : time used: ' + (((new Date()).getTime()) - t);
   // busyIcon$.text(t).show().removeClass('running');
   // // return $('<div>').addClass('mt-busy-icon');
   // // busyIcon$.hide();
 }
 /**
  * @memberOf APP_ui_meeting.ui
  */
 function warnMsg(msg) {
   return $('<div>').addClass('meeting-type-warn-msg').text(msg);
 }

 /**
  * @memberOf APP_ui_meeting.ui
  */
 function button(name, callback) {

   var b$ = APP_ui.button(L(name), function(e) {
     if (callback) {
       callback(e);
     }
   });
   return b$;
 }

 /**
  * @memberOf APP_ui_meeting.ui
  */
 function buttonBusy(b$) {
   b$.button('option', 'icons', {
     // primary: 'ui-icon-custom'
     secondary: 'ui-icon-custom-busy'
   });
   b$.button('option', 'text', true);
 }

 /**
  * @memberOf APP_ui_meeting.ui
  */
 function buttonDone(b$) {
   b$.button('option', 'icons', {});
   b$.button('option', 'text', true);
 }

 function batch(text, callback) {
   var e = $('<div>', {
     'class': 'ui-explorer-batch',
     'text': '' + text
   });
   if (typeof callback === 'function') {
     e.click(callback);
     e.addClass('ui-explorer-clickable');
   }
   return e;
 }

 /**
  * @memberOf APP_ui_meeting.ui
  */
 function title(name, level) {
   var b$ = $('<div>').addClass('title' + level);
   b$.append($('<span>').text(L(name)));
   return b$;
 }

 /**
  * @memberOf APP_ui_meeting.ui
  */
 function infoBox(name) {
   return $('<div>').addClass('info-box').text(L(name));
 }

 function warnBox(name) {
   return $('<div>').addClass('warn-box').text(L(name));
 }

 /**
  * @memberOf APP_ui_meeting.just_for_fun
  */
 function coolBusyIcon(view$) {

   var width = 500, height = 500, radius = 80, x = Math.sin(2 * Math.PI / 3), y = Math.cos(2 * Math.PI / 3);

   var offset = 0, speed = 4, start = Date.now();

   // var svg = d3.select("body").append("svg").attr("width", width).attr("height", height).append("g").attr("transform",
   // "translate(" + width / 2 + "," + height / 2 + ")scale(.55)").append("g");
   var svg = d3.select(view$[0]).append("svg").attr("width", width).attr("height", height).append("g").attr("transform",
       "translate(" + width / 2 + "," + height / 2 + ")scale(.55)").append("g");

   var frame = svg.append("g").datum({
     radius: Infinity
   });

   frame.append("g").attr("class", "annulus").datum({
     teeth: 80,
     radius: -radius * 5,
     annulus: true
   }).append("path").attr("d", gear);

   frame.append("g").attr("class", "sun").datum({
     teeth: 16,
     radius: radius
   }).append("path").attr("d", gear);

   frame.append("g").attr("class", "planet").attr("transform", "translate(0,-" + radius * 3 + ")").datum({
     teeth: 32,
     radius: -radius * 2
   }).append("path").attr("d", gear);

   frame.append("g").attr("class", "planet").attr("transform", "translate(" + -radius * 3 * x + "," + -radius * 3 * y + ")").datum({
     teeth: 32,
     radius: -radius * 2
   }).append("path").attr("d", gear);

   frame.append("g").attr("class", "planet").attr("transform", "translate(" + radius * 3 * x + "," + -radius * 3 * y + ")").datum({
     teeth: 32,
     radius: -radius * 2
   }).append("path").attr("d", gear);

   d3.selectAll("input[name=reference]").data([ radius * 5, Infinity, -radius ]).on("change", function(radius1) {
     var radius0 = frame.datum().radius, angle = (Date.now() - start) * speed;
     frame.datum({
       radius: radius1
     });
     svg.attr("transform", "rotate(" + (offset += angle / radius0 - angle / radius1) + ")");
   });

   d3.selectAll("input[name=speed]").on("change", function() {
     speed = +this.value;
   });

   function gear(d) {
     var n, r2, r0, r1, r3, da, a0, i, path;
     n = d.teeth;
     r2 = Math.abs(d.radius);
     r0 = r2 - 8;
     r1 = r2 + 8;
     // r3 = d.annulus ? (r3 = r0, r0 = r1, r1 = r3, r2 + 20) : 20;
     if (d.annulus) {
       r3 = r0;
       r0 = r1;
       r1 = r3;
       r2 + 20;
     } else {
       r3 = 20;
     }
     da = Math.PI / n;
     a0 = -Math.PI / 2 + (d.annulus ? Math.PI / n : 0);
     i = -1;
     path = [ "M", r0 * Math.cos(a0), ",", r0 * Math.sin(a0) ];
     while (++i < n)
       path.push("A", r0, ",", r0, " 0 0,1 ", r0 * Math.cos(a0 += da), ",", r0 * Math.sin(a0), "L", r2 * Math.cos(a0), ",", r2 * Math.sin(a0), "L", r1
           * Math.cos(a0 += da / 3), ",", r1 * Math.sin(a0), "A", r1, ",", r1, " 0 0,1 ", r1 * Math.cos(a0 += da / 3), ",", r1 * Math.sin(a0), "L", r2
           * Math.cos(a0 += da / 3), ",", r2 * Math.sin(a0), "L", r0 * Math.cos(a0), ",", r0 * Math.sin(a0));
     path.push("M0,", -r3, "A", r3, ",", r3, " 0 0,0 0,", r3, "A", r3, ",", r3, " 0 0,0 0,", -r3, "Z");
     return path.join("");
   }
   d3.timer(function() {
     var angle = (Date.now() - start) * speed, transform = function(d) {
       return "rotate(" + angle / d.radius + ")";
     };
     frame.selectAll("path").attr("transform", transform);
     frame.attr("transform", transform); // frame of reference
   });

   return view$;
 }

})(this);