var APP_instance = {
  userInfo : {},
  role : {},
  apps : {}
};

$(function() {

  var L = APP_data.getLabel;
  var D = APP_data.getDescription;
  // var apps = [ 'ts', 'hrm', 'vip', 'ting', 'acc', 'ps', 'sys', 'dev' ];

  var indexHeaderPanel$ = $('#index-header-panel').addClass(
      'index-header-panel').hide();
  var indexMainPanel$ = $('#index-main-panel').addClass('index-main-panel');
  var indexIconPanel$ = $('#index-icon-panel').addClass('index-icon-panel');
  var loginPanel$ = $('#index-login-panel').hide();
  var indexHome$ = $('#index-home');
  var indexAppTitle$ = $('#index-app-title');
  var userDetailsLink$ = $('#index-logged-in-user-link');
  var logoutLink$ = $('#index-logout-link');
  var indexUserDetailsBackground$ = $('#index-user-details-background');
  var indexUserDetailsPanel$ = $('#index-user-details-panel');

  var lang = APP_base.localStorage.get('selected-lang');

  if (!_.isString(lang)) {
    APP_base.localStorage.set('selected-lang', 'en');
  }
  lang = APP_base.localStorage.get('selected-lang');

  APP_data.loadAppProperties(function() {
    APP_data.loadLabels(lang, function() {
      initMainAppPanel();
    });
  });

  //

  function initMainAppPanel() {

    var t, loginUi, langSelection;

    t = APP_data.appProperty('anakapa.languages', 'en');
    langSelection = t.split(',');

    init_langText();

    APP_data.setNoUserCallback(function(callee) {
      alert('your session has expired... ' + callee);
      window.location.reload(true);
    });

    indexHome$.click(function() {
      indexAppTitle$.empty();
      indexIconPanel$.show("slow");
      indexMainPanel$.empty().hide();
    });

    //
    // start login ui
    //
    loginUi = APP_login.createLoginUi({
      'title' : '',
      'icon' : 'sys/img/anakapa-login-160.png',
      'deviceMode' : 'workstation',
      'langSelection' : langSelection
    });

    loginUi.done(loginDoneFun);

    loginPanel$.append(loginUi.view()).show();

    function loginDoneFun(userInfo) {
      lang = APP_base.localStorage.get('selected-lang');

      // APP_data.loadAppJson(init);
      APP_data.loadDataPostLogin(lang, init);

      function init() {
        var adminAppIcon$, t;
        APP_instance.userInfo = userInfo;

        loginPanel$.hide();

        t = lang ? ' (' + lang + ')' : '';
        userDetailsLink$.find('span').text(userInfo.userId + t);
        logoutLink$.click(function() {
          $('body').hide();
          rQ.call('UserLogin', {
            'action' : 'logout'
          });
          window.location.reload(true);
        });

        indexHeaderPanel$.show();

        userDetailsLink$.click(function() {
          indexUserDetailsPanel$.empty().append(
              JGROUND_base.userInfoUi(userInfo).view());
          indexUserDetailsPanel$.append(APP_ui.link(' close', function() {
            window.setTimeout(function() {
              indexUserDetailsPanel$.hide();
              indexUserDetailsBackground$.hide();
            }, 0);
          }).addClass('fa fa-times'));
          indexUserDetailsPanel$.show();
          indexUserDetailsBackground$.show();
        });

        userInfo.apps = APP_data.appList();
        initApps(userInfo);

        if (userInfo.hasRole('APP_ADMIN')) {
          adminAppIcon$ = appIcon('admin', userInfo, JGROUND_admin);
          indexIconPanel$.append(adminAppIcon$);
        }
      }

    }

    //
    // INIT APPS -start-
    //

    function initApps(userInfo) {
      var resources = [];
      var lastApp = APP_base.localStorage.get('last-app');

      //
      // DYNAMIC LOADING OF JS AND CSS -start-
      //
      $.each(userInfo.apps, function(i, app) {
        var ui, appIcon$, APP = app.toUpperCase(), app = app.toLowerCase();
        var appObject = APP_base.findObject(APP + '_base');
        if (!_.isObject(appObject)) {
          resources.push('app/' + app + '/' + app + '.js');
          $('head').append(
              $('<link>').attr(
                  'href',
                  'app/' + app + '/' + app + '.css?_time='
                      + (new Date()).getTime()).attr('type', 'text/css').attr(
                  'rel', 'stylesheet'));
          //          
          // <link href="sys/app-ui.css" type="text/css" rel="stylesheet" />
        }
      });

      APP_base.getScripts(resources, continueFun);

      function continueFun() {
        $.each(userInfo.apps, function(i, app) {
          var ui, appIcon$, APP = app.toUpperCase(), app = app.toLowerCase();
          var appUserRole = APP + '_USER';
          var appAdminRole = APP + '_ADMIN';
          var appObject = APP_base.findObject(APP + '_base');

          if ((userInfo.hasRole(appUserRole) || userInfo.hasRole(appAdminRole))
              && _.isObject(appObject)) {
            appIcon$ = appIcon(app, userInfo, appObject);
            indexIconPanel$.append(appIcon$);
          }
        });
        indexIconPanel$.show();
      }

    }

    function appIcon(app, userInfo, appObject) {
      var icon$, appCreateFun = appObject.appUi, title$;
      if (!_.isFunction(appCreateFun)) {
        return null;
      }
      icon$ = $('<a>', {
        'href' : '#' + app,
        'class' : 'app-icon app-icon-' + app
      });
      if (_.isFunction(appObject.icon)) {
        icon$.append(appObject.icon());
      } else {
        icon$.append(APP_ui.icon(L(app + '-icon-name')));
      }
      icon$.append($('<div>', {
        'class' : 'app-code app-code-' + app,
        'text' : L(app)
      }));

      title$ = $('<div>', {
        'class' : 'app-icon-title app-icon-title-' + app,
        'text' : L(app + '-icon-title')
      }).attr('title', D(app + '-icon-title'));
      if (title$.tooltip) {
        title$.tooltip();
      }
      icon$.append(title$);

      icon$.click(function() {
        var appUi = appCreateFun(userInfo);
        indexIconPanel$.hide();
        indexMainPanel$.empty().append(appUi.view()).show();
        indexAppTitle$.empty().append(APP_ui.icon(L(app + '-icon-name')),
            $('<span>', {
              'text' : ' ' + L(app + '-home-title')
            }));
        appUi.done(function() {
          indexIconPanel$.show();
          indexMainPanel$.empty();
        });
      });
      return $('<div>').addClass('app-icon-holder').append(icon$);
    }

  }

  function init_langText() {
    $('.langText').each(function() {
      var that$ = $(this);
      var tmp = that$.text();
      that$.text(L(tmp));
    });
  }

  return;

});
