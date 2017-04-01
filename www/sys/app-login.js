//     APP_login 1.0.0
//     http://www.ooit.org
//     (c) 2009-2012 Toni Buenter, ooit.com.
//     APP_login may be freely distributed under the MIT license.

var APP_login = APP_login || {};

(function() {

  var L = APP_data.getLabel;
  var D = APP_data.getDescription;

  /**
   * 
   * @memberOf APP_login
   */
  function createLoginUi(settings) {

    var view$, title$, loginPanel$, changePasswordPanel$, messages$;
    var doneFn = null;
    var userId = APP_base.localStorage.get('userId');// localStorage.getItem('userId')
    var lang = APP_base.localStorage.get('selected-lang') || 'en';

    messages$ = $('<div>').css({
      'padding' : '10px',
      'color' : 'red'
    });

    // ||
    // '';
    var password = APP_base.localStorage.get('tspw') || '';

    settings = settings || {};
    settings.title = _.isUndefined(settings.title) ? 'welcomeLogin'
        : L(settings.title);
    view$ = $('<div>', {
      'class' : 'ui-widget'
    }).addClass('app-login');

    loginPanel$ = createLoginPanel(settings);
    changePasswordPanel$ = createChangePasswordPanel();
    changePasswordPanel$.hide();

    if (_.isString(settings.icon)) {
      view$.append($('<div>').append($('<img>', {
        'src' : settings.icon
      })).addClass('loginIcon'));
    }
    view$.append(title$ = $('<div>').text(L(settings.title)).addClass(
        'loginTitle'));
    view$.append(loginPanel$, changePasswordPanel$);
    view$.append(messages$);

    return {
      'view' : view,
      'setLoginSuccessCallback' : setLoginSuccessCallback,
      'done' : setLoginSuccessCallback,
      // 'trySessionId' : trySessionId,
      'title' : function(arg0) {
        if (_.isString(arg0)) {
          title$.text(arg0);
        }
      }
    };

    function loginSuccessFun(serviceData) {
      var userInfo, list;
      if (serviceData === false) {
        messages$.text(L('sorry-login-failed'));
      } else {
        list = rQ.toList(serviceData);
        if (list.length > 0) {
          userInfo = list[0];
          userInfo.loginLang = lang;
          APP_data.sessionId(userInfo.sessionId);
          APP_base.localStorage.set('userId', userId);
          APP_base.localStorage.set('tspw', password);
          extendUserInfo(userInfo);
          if (_.isFunction(doneFn)) {
            doneFn(userInfo);
          } else {
            alert(L('login-successful'));
          }
          // when session expires -> reload
          rQ.noSession(function() {
            window.location.reload(true);
          });
        }
      }
    }

    function extendUserInfo(userInfo) {

      userInfo.roleNames = userInfo.roles || '';
      userInfo.roleNames = userInfo.roleNames.split(',');
      userInfo.roles = (userInfo.roles || '').split(',');

      if (!_.isFunction(userInfo.hasRole)) {
        userInfo.hasRole = hasRole;
      }

      function hasRole(role) {
        return _.contains(userInfo.roleNames, role);
      }
    }

    function resetMessages() {
      messages$.text('');
    }

    // *******************
    // *** loginPanel$ ***
    // *******************

    function createLoginPanel(settings) {
      var t$, more$, moreBt$, isMore = false;
      var userId$, passwordUi, langSelectUi;
      var changePasswordBt$, sentNewPasswordBt$, clearAllBt$, loginBt$;
      var langSelection = settings.langSelection;
      var moreSupp = APP_ui.switchSupport();

      userId$ = $('<input>', {
        name : 'userId',
        value : userId,
        type : 'email'
      }).addClass('userId');

      passwordUi = APP_ui.inputUi({
        'type' : 'password',
        'value' : password
      });
      if (_.isArray(langSelection) && langSelection.length > 1) {

        langSelectUi = APP_ui.selectUi2({
          'list' : langSelection
        });

        langSelectUi.value(APP_base.localStorage.get('selected-lang'));

        langSelectUi.change(function(langCode) {
          lang = langCode;
          APP_base.localStorage.set('selected-lang', lang);
          window.location.reload(true);
        });
        // langSelectUi.view().attr('placeholder', 'select language');
      }

      function loginFun() {
        var pwhash = null;
        userId = userId$.val();
        password = passwordUi.value();
        if (typeof (password) === 'string') {
          pwhash = CryptoJS.SHA1(password).toString(CryptoJS.enc.Hex);
        }

        rQ.noSession(function noSession() {
          loginSuccessFun(false);
        });

        rQ.call('UserLogin', {
          'action' : 'logIn',
          'userId' : userId,
          'pwhash' : pwhash
        }, loginSuccessFun);
      }

      clearAllBt$ = APP_ui.button(L('clear-all'), function() {
        userId = '';
        password = '';
        userId$.val(userId);
        passwordUi.setValue(password);
        APP_base.localStorage.set('userId', userId);
        APP_base.localStorage.set('tspw', password);
        messages$.text(L('all-cleared...'));
      }, D('all-cleared...'));

      loginBt$ = APP_ui.button(L('login'), function() {
        loginFun();
        return false;
      }).css({
        'border-width' : '2px'
      });

      passwordUi.view().addClass('password');

      passwordUi.action(loginFun);

      sentNewPasswordBt$ = APP_ui.button(L('create-new-password'), function() {

        var u = userId$.val();
        resetMessages();
        if (u === '') {
          messages$.text(L('please-fillout-the-userid-field'));
          return;
        }
        userId = u;
        APP_base.localStorage.set('userId', userId);

        rQ.call('UserLogin.newPasswordByMail', {
          'userId' : userId
        }, function(data) {
          APP_base.localStorage.set('tspw', '');
          userId$.text(userId);
          messages$.text(L('new-password-sent'));
        });

      });

      changePasswordBt$ = APP_ui.button(L('change-password'), function() {
        resetMessages();
        loginPanel$.hide();
        changePasswordPanel$.show();
      });

      t$ = $('<div>').css({
        'padding' : '4px'
      });

      // if (APP_login.mobile) {
      //
      // 'new' for mobile
      //
      userId$.attr('placeholder', 'userId/email');
      t$.append($('<div>').addClass('app-ui-login-userId mobile').append(
          userId$));
      t$.append($('<div>').addClass('app-ui-login-password mobile').append(
          passwordUi.view().attr('placeholder', 'password')));
      if (langSelectUi) {
        t$.append($('<div>').addClass('app-ui-login-langSelection mobile')
            .append(
                APP_ui.div().append(
                    APP_ui.div(L('lang-selection')).addClass('label'),
                    langSelectUi.view())));
      }

      more$ = $('<div>').addClass('buttons').append(changePasswordBt$,
          sentNewPasswordBt$, clearAllBt$);

      moreSupp.put('less', loginBt$);
      moreSupp.put('more', more$);

      moreBt$ = APP_ui.link(' ', function() {
        isMore = !isMore;
        if (isMore) {
          moreSupp.show('more');
          moreBt$.text(L('less...'));
        } else {
          moreSupp.show('less');
          moreBt$.text(L('more...'));
        }
        messages$.text('');
      });
      // setting it up

      isMore = true;
      moreBt$.click();

      t$.append($('<div>').addClass('app-login-login-button').append(loginBt$,
          moreBt$));

      t$.append(more$);
      return t$;
    }

    // *************************
    // *** newPasswordPanel$ ***
    // *************************

    function createChangePasswordPanel() {

      var t$, userId$, oldPassword$, newPassword$, newPassword2$, setNewPasswordBt$, cancelBt$;

      userId$ = $('<input>', {
        'name' : 'userId',
        'value' : userId,
        'placeholder' : L('userid-email')
      });

      oldPassword$ = $('<input>', {
        'type' : 'password',
        'placeholder' : L('old-password')
      });

      newPassword$ = $('<input>', {
        'type' : 'password',
        'placeholder' : L('new-password')
      });

      newPassword2$ = $('<input>', {
        'type' : 'password',
        'placeholder' : L('new-password-repeated')
      });

      setNewPasswordBt$ = APP_ui.button(L('set-new-password'), function() {
        var u = userId$.val();
        var p = oldPassword$.val();
        var p1 = newPassword$.val();
        var p2 = newPassword2$.val();
        if (p1 !== p2) {
          messages$.text(L('the-new-two-passwords-are-not-the-same'));
          return false;
        }
        if (p1.length < 6) {
          messages$.text(L('the-new-password-should-have-at-least-6-letters'));
          return false;
        }

        rQ.noSession(function noSession() {
          loginSuccessFun(false);
        });

        password = p1;

        rQ.call('UserLogin', {
          'action' : 'changePassword',
          'userId' : u,
          'pwhash' : CryptoJS.SHA1(p).toString(CryptoJS.enc.Hex),
          'newPwhash' : CryptoJS.SHA1(p1).toString(CryptoJS.enc.Hex)
        }, loginSuccessFun);

        return false;
      }).css({
        'border-width' : '2px'
      });

      cancelBt$ = APP_ui.button(L('cancel'), function() {
        loginPanel$.show();
        changePasswordPanel$.hide();
        resetMessages();
      });

      t$ = $('<div>').css({
        'padding' : '4px'
      });

      t$.append($('<div>').append(

          //
          APP_ui.fieldsPanel([ L('user-id'), L('old-password'),
              L('new-password'), L('new-password-2'), '' ], [ userId$,
              oldPassword$, newPassword$, newPassword2$, ])
      //        
      ));

      t$.append($('<div>').addClass('buttons').append(setNewPasswordBt$,
          cancelBt$));
      return t$;

    }

    function view() {
      return view$;
    }

    function setLoginSuccessCallback(cb) {
      doneFn = cb;
    }

  }
  APP_login.createLoginUi = createLoginUi;

  /**
   * 
   * @memberOf APP_login
   */
  function userInfo(cb) {

    rQ.call('UserLogin', {
      'userId' : userId,
      'pwhash' : pwhash
    }, cb);

  }
  APP_login.userInfo = userInfo;

}).call(this);