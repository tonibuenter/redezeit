var REDEZEIT_mobile = REDEZEIT_mobile || {};

/**
 * 
 */

(function() {

  var ls = APP_base.ls;
  var Page = {};

  function initPage() {

    Page.headerTop = $('#header-top');
    Page.centerTop = $('#center-top');
    Page.footerTop = $('#footer-top');

    Page.log = $('#log');
    Page.main = $('#main');
    Page.welcome = $('#welcome');
    // toolbar button
    Page.logo = $('#logo');
    Page.logoMain = $('#logo-main');

    Page.speakerTime = $('#speaker-time');
    Page.chessClock = $('#chess-clock');
    Page.misc = $('#misc');

    initMain();

  }
  REDEZEIT_mobile.initPage = initPage;

  function initMain(userInfo) {

    Page.main.addClass(_.isObject(userInfo) ? 'user-logged-in' : 'no-user');

    Page.welcome.show();

    Page.main.empty();

    $('.slider').slider();
    Page.welcome.find('ul.indicators').hide();
    Page.welcome.find('.slider').click(function() {
      Page.welcome.hide();
      startMainToolbar(userInfo);
    });

    // for debug
    Page.welcome.hide();
    startMainToolbar(userInfo);

  }

  function startMainToolbar(userInfo) {

    var switchSupport = APP_ui.switchSupport();
    var speakerTimeUi, chessClockUi, miscUi;

    Page.main.removeClass('initial-hidden');

    switchSupport.put('logo', Page.logoMain);
    switchSupport.show('logo');
    Page.logo.click(function() {
      switchSupport.show('logo');
    });

    Page.speakerTime.click(function() {
      if (!speakerTimeUi) {
        speakerTimeUi = REDEZEIT_mobile.speakerTimeUi();

        switchSupport.put('speakerTime', speakerTimeUi);
      }
      switchSupport.show('speakerTime');
    });

    Page.chessClock.hide();

    Page.misc.hide();

  }

  //
  // SPEAKER TIME UI
  //
  function speakerTimeUi(settings) {

    var ui, view$, userListPanel$;
    var footer$, footerUl$, group$, reset$, settings$, next$, dialogUi;

    var intervalId = null, redelist = [], userList = [], userMap = {}, current, timeLimitMillis;

    ui = APP_ui.templateUi();
    view$ = ui.view().addClass('speaker-time-ui section');
    footer$ = APP_ui.nav();
    // view$.append('speakerTimeUi');

    userListPanel$ = APP_ui.div('user-panel row');

    view$.append(userListPanel$);

    Page.main.append(view$);
    // 
    footer$.append(APP_ui.div('nav-wrapper black darken-3').append(
        footerUl$ = APP_ui.ul('row')));

    group$ = APP_ui.li('', 'col s3 m3 l2').append(
        APP_ui.i('group', 'material-icons')).click(manageUsers);

    reset$ = APP_ui.li('', 'col s3 m3 l2').text('reset').click(resetPlay);

    settings$ = APP_ui.li('', 'col s3 m3 l2').append(
        APP_ui.i('settings', 'material-icons large')).click(manageMode);

    next$ = APP_ui.li('', 'col s3 m3 l2').append(
        APP_ui.i('forward', 'material-icons large')).click(nextUser);

    footerUl$.append(group$, reset$, settings$, next$);
    Page.footerTop.append(footer$);

    //
    dialogUi = APP_ui.dialogUi();

    userList = ls('userList') || [];
    timeLimitMillis = ls('timeLimitMillis') || null;
    updateTitle();

    ui.show = show;
    ui.hide = hide;

    initPlay();

    return ui;

    function resetPlay() {
      // stopTimer();
      _.each(userMap || {}, function(userEntry, name) {
        userEntry.ui.view().removeClass('selected');
        userEntry.speakTime = 0;
        updateDisplay(userEntry);
      });
      current = null;
    }

    function initPlay() {

      startTimer();

      //
      userListPanel$.empty();
      _.each(userList,
          function(name) {
            var userUi, name$, time$, canvas$, canvasHolder$, userEntry;

            userEntry = userMap[name];

            if (!_.isObject(userEntry)) {
              userMap[name] = (userEntry = {
                'name' : name,
                'speakTime' : 0,
              });
            }

            userUi = APP_ui.templateUi();
            userUi.view().addClass('user ' + name);

            name$ = APP_ui.div(name, 'name');
            time$ = APP_ui.div('--', 'time');
            canvas$ = $('<canvas>');
            canvasHolder$ = APP_ui.div('canvas-holder').hide();

            userUi.view().append(name$, time$);
            userUi.view().append(canvasHolder$.append(canvas$));
            userListPanel$.append(APP_ui.div('col l3 m4 s6').append(
                userUi.view()));
            userUi.view().click(function() {
              startUser(userEntry);
            });

            userEntry.ui = userUi;
            userEntry.time$ = time$;
            userEntry.name$ = name$;
            userEntry.canvas$ = canvas$;
            userEntry.canvasHolder$ = canvasHolder$;

            //
            // Doughnut Chart
            //
            window.setTimeout(function() {
              var data = {
                labels : [ "used", "remain" ],
                datasets : [ {
                  data : [ 0, 1 ],
                  backgroundColor : [ 'hsla(0, 66%, 47%, 1)', 'transparent' ],
                  borderColor : [ 'transparent', 'transparent' ]
                } ]
              };

              var chart = new Chart(userEntry.canvas$[0], {
                type : 'doughnut',
                'data' : data,
                'options' : {
                  'cutoutPercentage' : 40,
                  'legend' : {
                    'display' : false
                  },
                  'labels' : {
                    'display' : false
                  },
                  'tooltips' : {
                    'enabled' : false
                  },
                  'showTooltips' : false,
                  'animation' : {
                    'duration' : 0
                  },
                  'responsive' : true
                }
              });

              userEntry.chart = chart;
            }, 0);

            _.each(userMap, updateDisplay);

          });

    }

    function update(ctm) {
      ctm = _.isFinite(ctm) ? ctm : APP_base.currentTimeMillis();
      if (current) {
        current.speakTime += (ctm - current.start);
        current.start = ctm;
        updateDisplay(current);
        if (current.setSelected) {
          current.ui.view().addClass('selected');
          current.setSelected = null;
        }
      }
    }

    function updateDisplay(userEntry) {
      if (userEntry) {
        if (timeLimitMillis) {
          remain = timeLimitMillis - userEntry.speakTime;
          remain = remain < 0 ? 0 : remain;
          userEntry.time$.text(formatDuration(remain));
          userEntry.canvasHolder$.show();
          if (userEntry.chart) {
            userEntry.chart.config.data.datasets[0].data = [
                timeLimitMillis - remain, remain ]
            userEntry.chart.update();
          }
        } else {
          userEntry.time$.text(formatDuration(userEntry.speakTime));
          userEntry.canvasHolder$.hide();
        }
      }
    }

    function nextUser() {
      var index = 0;
      if (current) {
        index = _.indexOf(userList, current.name) + 1;
        index = index % userList.length;
      }
      startUser(userMap[userList[index]]);
      scrollToCurrent();
    }

    function startUser(userEntry) {

      var ctm = APP_base.currentTimeMillis();

      if (!current) {
        // start
        current = userEntry;
        current.start = ctm;
        current.ui.view().addClass('selected');
      } else if (current.name == userEntry.name) {
        // pause
        update(ctm);
        current.ui.view().removeClass('selected');
        current = null;
      } else {
        // change user
        current.ui.view().removeClass('selected');
        update(ctm);
        redelist.push({
          'name' : current.name,
          'speakTime' : current.speakTime
        });
        current = userEntry;
        current.start = ctm;
        current.ui.view().addClass('selected');

        // window.setTimeout(scrollToCurrent, 1000);

      }

    }

    function manageUsers() {

      var content$, save$, close$;

      _userList = _.clone(userList);

      content$ = APP_ui.div('section');
      prepareContent();

      save$ = APP_ui.link('save', function() {
        var _userMap = {};
        userList = _userList;
        ls('userList', userList);
        _userMap = {};
        _.each(userList, function(name) {
          var userEntry = userMap[name];
          if (userEntry) {
            _userMap[name] = userEntry;
            if (current && current.name == name) {
              current.setSelected = true;
            }
          }
        });
        userMap = _userMap;
        initPlay();
        dialogUi.close();
      });
      close$ = APP_ui.link('close', dialogUi.close);
      dialogUi.content(content$);
      dialogUi.footer(save$, close$);
      dialogUi.open();

      function prepareContent() {
        content$.empty();
        _.each(_userList, function(name, i) {
          var line$, name$, del$;
          line$ = APP_ui.div('user row ' + (i % 2 == 0 ? 'even' : 'odd'));
          name$ = APP_ui.div('name col s8').append(APP_ui.div(name, 'userName'));
          del$ = APP_ui.iconButton('clear', function() {
            _userList = _.without(_userList, name);
            line$.animateCss('zoomOut', 'hide');
          }).css('font-size','2em');
          content$.append(line$.append(name$, del$.addClass('col s4')));
        });
        //
        (function() {
          var line$, name$, add$, inputUi;
          line$ = APP_ui.div('user-add row');
          inputUi = APP_ui.inputUi({
            'label' : 'new user'
          });
          name$ = APP_ui.div('name col s8').append(inputUi.view());
          add$ = APP_ui.iconButton('add_circle').css('font-size','2em').one('click', function() {
            _userList.push(inputUi.value());
            prepareContent();
          });
          content$.append(line$.append(name$, add$.addClass('col s4')));
        })();
      }
    }

    function manageMode() {

      var content$, ul$, inputUi, useTimeLimitBt$, noTimeLimitBt$, close$;

      content$ = APP_ui.div('section');
      ul$ = APP_ui.ul().addClass('collapsible').attr('data-collapsible',
          'accordion');
      window.setTimeout(function() {
        ul$.collapsible();
      }, 0);
      // time limit

      inputUi = APP_ui.inputUi({
        'label' : 'Time Limit in Minutes'
      });

      if (_.isFinite(timeLimitMillis) && timeLimitMillis > 0) {
        inputUi.value('' + Math.floor(timeLimitMillis / (1000 * 60)));
      }

      useTimeLimitBt$ = APP_ui.button('Use Time Limit', function() {
        var t;
        t = +inputUi.value();
        if (_.isFinite(t) && t > 0 && t < 24 * 60 * 7) {
          APP_ui.toast('Set limit to ' + t + ' minutes.');
          updateTitle();
          timeLimitMillis = t * 60 * 1000;
          ls('timeLimitMillis', timeLimitMillis);
          updateTitle();
          dialogUi.close();
          _.each(userMap, updateDisplay);
        } else {
          APP_ui.toast('Limit value is out of range or not a number!');
        }
      });

      // content$.append(APP_ui.div('section').append(inputUi.view()));

      ul$.append(APP_ui.li().append(
          APP_ui.div('Set Time Limit', 'collapsible-header xx-active'),
          APP_ui.div('collapsible-body').append(inputUi.view(),
              useTimeLimitBt$)));

      // no time limit

      noTimeLimitBt$ = APP_ui.button('No Limit', function() {
        timeLimitMillis = null;
        ls('timeLimitMillis', null);
        updateTitle();
        _.each(userMap, updateDisplay);
        dialogUi.close();
      });

      ul$.append(APP_ui.li().append(
          APP_ui.div('No Time Limit', 'collapsible-header'),
          APP_ui.div('collapsible-body section').append(noTimeLimitBt$)));

      content$.append(ul$);

      // close
      close$ = APP_ui.link('close', dialogUi.close);
      dialogUi.content(content$);
      dialogUi.footer(close$);
      dialogUi.open();
    }

    function stopTimer() {
      if (_.isNumber(intervalId)) {
        window.clearInterval(intervalId);
        intervalId = null;
      }
    }

    function startTimer() {
      if (intervalId === null) {
        intervalId = window.setInterval(update, 100);
      }
    }

    function updateTitle() {
      if (timeLimitMillis) {
        Page.speakerTime
            .text(Math.floor(timeLimitMillis / 1000 / 60) + ' Min!');
      } else {
        Page.speakerTime.text('No limit!');
      }
    }

    function scrollToCurrent() {
      // stopTimer() ;
      if (current) {
        Page.centerTop.scrollTo(current.ui.view(), {
          'duration' : 800,
          margin : true,
          'onAfter' : function() {
            startTimer();

            // alert('done');
          }
        });
      }
    }

    function hide() {
      // Page.log.append(APP_ui.div('hide speakerTimeUi'));
      view$.hide();
      footer$.hide();
    }
    function show() {
      // Page.log.append(APP_ui.div('show speakerTimeUi'));
      view$.show();
      footer$.show();
    }
  }
  REDEZEIT_mobile.speakerTimeUi = speakerTimeUi;

  //
  // CHESS CLOCK UI
  //

  function chessClockUi(settings) {
    var ui, view$;
    ui = APP_ui.templateUi();
    view$ = ui.view().addClass('chess-clock-ui');
    view$.append('chessClockUi');
    return ui;
  }
  REDEZEIT_mobile.chessClockUi = chessClockUi;

  function miscUi(settings) {
    var ui, view$;
    ui = APP_ui.templateUi();
    view$ = ui.view().addClass('misc-ui');
    view$.append('miscUi');
    return ui;
  }
  REDEZEIT_mobile.miscUi = miscUi;

  //
  //
  // COMMONS
  //
  //
  function formatDuration(durationMs) {
    var m, s, ten, rest = durationMs;
    //
    m = Math.floor(rest / 60000);
    rest -= m * 60000;
    //
    s = Math.floor(rest / 1000);
    rest -= s * 1000;
    //
    ten = Math.floor(rest / 100);
    m = APP_base.rest('0' + m, 2);
    s = APP_base.rest('0' + s, 2);
    return m + ':' + s + '.' + ten;
  }
  REDEZEIT_mobile.formatDuration = formatDuration;

})();
