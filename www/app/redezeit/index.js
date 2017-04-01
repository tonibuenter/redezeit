$(function() {
  FastClick.attach(document.body);
});

$(document).ready(
    function() {

      var s;
      var ls = APP_base.ls;

      // http://stackoverflow.com/questions/2593139/ipad-web-app-detect-virtual-keyboard-using-javascript-in-safari
      // Without this snippet, the app container stayed in the up-scrolled
      // position until page refresh.
      document.addEventListener('focusout', function(e) {
        window.scrollTo(0, 0);
      });

      try {
        s = ls("lastTime");
      } catch (e) {
        // TODO: handle exception
      }
      // alert('redezeit lastTime : ' + ls("lastTime"));

      ls("lastTime", "-" + (new Date()));

      var header$ = $('#header').hide();
      var play$ = $('#play');

      var admin$ = $('#admin');
      var info$ = $('#info');
      var footer$ = $('#footer');
      var sw = APP_ui.switchSupport();
      var headerUi = createHeaderUi(sw, [ 'play', 'admin', 'info' ]);

      // play data
      var intervalId = null;
      var redelist = [];
      var users = [];

      // switch support
      sw.put('play', play$);
      sw.put('admin', admin$);
      sw.put('info', info$);

      //

      sw.show('play');
      initPlay();

      function initPlay() {
        var t$, v$, input$;
        var userPanel$ = $('<div>').addClass('users');
        var actionUi = APP_ui.switchUi();

        var usernames = ls('usernames') || [ 'pause' ];
        var currentUser;
        users = [];
        var sw = APP_ui.switchSupport();

        play$.empty().append(userPanel$, actionUi.view().addClass('actions'));
        if (intervalId === null) {
          intervalId = window.setInterval(update, 500);
        }

        userPanel$.empty();
        $.each(usernames, function(i, name) {
          var userUi = APP_ui.templateUi();
          var v$ = userUi.view();
          var name$, time$;
          name$ = $('<span>').text(name).addClass('name');
          time$ = $('<span>').text('-').addClass('time');
          v$.append(name$, time$);
          userPanel$.append(v$.addClass('user ' + name));
          users.push({
            'ui' : userUi,
            'name' : name,
            'time$' : time$,
            'name$' : name$
          });
          // click
          v$.click(buttonAnim(function() {
            if (currentUser === name) {
              // do nothing
            }
            if (currentUser !== name) {
              currentUser = name;
              redelist.push({
                'name' : name,
                'start' : moment()
              });
            }
          }, 500));
        });

        //
        // +Person
        //

        actionUi.put('main', button('+person', function() {

          actionUi.show('adduser');
          input$.select().focus().select().focus().click();
        }).addClass('adduser'));

        input$ = $('<input>').css({
          'display' : 'block'
        }).attr('placeholder', 'user');

        actionUi.put('adduser', input$);
        actionUi.put('adduser', button('add', (function(i$) {
          return function() {
            var name = i$.val();
            if (_.isString(name) && name.length > 0
                && !_.contains(usernames, name)) {
              usernames.push(name);
              usernames = ls('usernames', usernames);
              initPlay();
            }
          };
        })(input$)));

        actionUi.put('adduser', button('cancel', function() {
          actionUi.show('main');
        }));

        //
        // Clear
        //

        actionUi.put('main', button('clear', function() {
          redelist = [];
          if (_.isNumber(intervalId)) {
            window.clearInterval(intervalId);
            intervalId = null;
          }
          initPlay();
        }));
        //
        // Clear all
        //

        actionUi.put('main', button('clear all', function() {
          actionUi.show('clear-all');
        }));

        actionUi.put('clear-all', $('<div>').text(
            'do you want to clear all user data?').addClass('message'));

        actionUi.put('clear-all', button('yes', function() {
          ls('usernames', null);
          redelist = [];
          if (_.isNumber(intervalId)) {
            window.clearInterval(intervalId);
            intervalId = null;
          }
          initPlay();
        }));

        actionUi.put('clear-all', button('no', function() {
          actionUi.show('main');
        }));

        actionUi.show('main');

        return {
          destroy : function() {
            window.clearTimeout(timeoutId);
          }
        };
      }

      function update() {
        var i, t, sums = {}, former, last;
        if (redelist.length === 0) {
          return;
        }
        for (i = 0; i < redelist.length; i++) {
          t = redelist[i];
          if (i > 0) {
            sums[former.name] = sums[former.name] || 0;
            sums[former.name] += t.start.diff(former.start, 'seconds');
          }
          former = t;
        }

        last = redelist[redelist.length - 1];
        sums[last.name] = sums[last.name] || 0;
        sums[last.name] += moment().diff(last.start, 'seconds');

        $.each(users, function(i, user) {
          var time = sums[user.name] || '-';
          user.time$.text(time + '');
        });
      }
      /**
       * @memberOf ui
       */
      function createHeaderUi(sw, names) {
        var ui = APP_ui.templateUi({
          'view$' : header$
        });
        var ul$, t;

        header$.append(ul$ = $('<ul>'));

        $.each(names, function(i, name) {
          ul$.append($('<li>').text(name).click(function() {
            sw.show(name);
          }).addClass(name));
        });

        ui.show = function(arg0) {
          ul$.find('.' + arg0).click();
        };
        return ui;
      }

      function button(label, callback) {
        var b$ = $('<div>').css('display', 'inline-block').addClass('button')
            .append($('<span>').text(label));
        if (_.isFunction(callback)) {
          // b$.click(function() {
          // b$.addClass('button-anim', 400, function() {
          // b$.removeClass('button-anim', 400, callback);
          // });
          // });
          b$.click(buttonAnim(callback, 100));
        }

        return b$;
      }

      function buttonAnim(callback, duration) {
        duration = _.isNumber(duration) ? duration : 400;
        return function() {
          var b$ = $(this);
          b$.addClass('button-anim', duration, function() {
            b$.removeClass('button-anim', duration, callback);
          });
        };
      }

    });