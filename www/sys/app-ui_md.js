(function() {

  function dialogUi(settingsIn) {

    var ui = APP_ui.templateUi();
    var view$ = ui.view().addClass('modal modal-fixed-footer');
    var modalContent$ = APP_ui.div('', 'modal-content');
    var modalFooter$ = APP_ui.div('', 'modal-footer');
    var close$ = APP_ui.link('close', function() {
      close();
    });

    modalFooter$.append(close$);
    view$.append(modalContent$, modalFooter$).hide().appendTo($('body'));

    ui.content = content;
    ui.footer = footer;
    ui.open = open;
    ui.show = open;
    ui.hide = close;
    ui.close = close;

    window.setTimeout(function() {
      view$.modal();
    }, 0);

    return ui;

    function content(arg0) {
      modalContent$.empty().append(arg0);
    }
    function footer() {
      modalFooter$.empty();
      _.each(arguments, function(arg) {
        modalFooter$.append(arg);
      });
    }

    function open() {
      view$.modal('open');
    }

    function close(arg0) {
      view$.modal('close');
    }

  }
  delete APP_ui.createDialogUi;
  APP_ui.dialogUi = dialogUi;

  //
  // LINK
  //
  function link(label, cb) {
    return APP_ui.linkSimple(label, cb).addClass(
        'waves-effect waves-green btn-flat');
  }
  APP_ui.link = link;

  function linkSimple(label, cb) {
    var a$ = APP_ui.a().attr('href', '#').text(label).click(cb);
    return a$;
  }
  APP_ui.linkSimple = linkSimple;

  //
  // BUTTON
  //
  function button(label, cb) {
    var a$ = APP_ui.a().attr('href', '#').text(label).click(cb);
    a$.addClass('waves-effect waves-green btn');
    return a$;
  }
  APP_ui.button = button;

  //
  // BUTTON
  //
  function iconButton(icon, cb) {
    var a$ = APP_ui.a('', 'btn-flat waves-effect waves-teal icon-button').attr('href', '#')
        .click(cb).append(APP_ui.i(icon, 'material-icons'));
    return a$;
  }
  APP_ui.iconButton = iconButton;

  //
  // BUTTON FAB
  //
  function iconButtonFAB(icon, cb) {
    var a$ = APP_ui.a('', 'btn-floating waves-effect waves-teal').attr('href',
        '#').click(cb).append(APP_ui.i(icon, 'material-icons'));
    return a$;
  }
  APP_ui.iconButtonFAB = iconButtonFAB;

  //
  // BUTTON RAISED
  //
  function iconButtonRaised(icon, cb) {
    var a$ = APP_ui.a('',
        'waves-effect waves-light btn waves-effect waves-teal').attr('href',
        '#').click(cb).append(APP_ui.i(icon, 'material-icons'));
    return a$;
  }
  APP_ui.iconButtonRaised = iconButtonRaised;

  //
  // MOBILE TOOLBAR
  //

  // <nav>
  // <div class="nav-wrapper">
  // <a href="#!" class="brand-logo">Logo</a>
  // <a href="#" data-activates="mobile-demo" class="button-collapse"><i
  // class="material-icons">menu</i></a>
  // <ul class="right hide-on-med-and-down">
  // <li><a href="sass.html">Sass</a></li>
  // <li><a href="badges.html">Components</a></li>
  // <li><a href="collapsible.html">Javascript</a></li>
  // <li><a href="mobile.html">Mobile</a></li>
  // </ul>
  // <ul class="side-nav" id="mobile-demo">
  // <li><a href="sass.html">Sass</a></li>
  // <li><a href="badges.html">Components</a></li>
  // <li><a href="collapsible.html">Javascript</a></li>
  // <li><a href="mobile.html">Mobile</a></li>
  // </ul>
  // </div>
  // </nav>

  /**
   * @memberOf APP_ui_tabletool
   */
  function mobileToolbarUi() {

    var ui, view$, nav$, navWrapper$, title$, actionUl$, menuUl$, busy$, menuIcon$, sideNav$;
    var refresh$, refreshCb, done$, doneCb;
    var toolbarMsg$, icons = {}, id;
    id = APP_base.newId();
    ui = APP_ui.templateUi();
    view$ = ui.view().addClass('tt-toolbar');
    nav$ = APP_ui.nav();
    navWrapper$ = APP_ui.div('', 'nav-wrapper');
    title$ = APP_ui.span('-title-', 'brand-logo  right tt-toolbar-title');

    menuIcon$ = APP_ui.a('', 'button-collapse').attr('href', '#').attr(
        'data-activates', id).append(APP_ui.i('menu', 'material-icons'));

    actionUl$ = APP_ui.ul();
    menuUl$ = APP_ui.ul('', 'left hide-on-med-and-down');
    sideNav$ = APP_ui.ul('', 'side-nav').attr('id', id);
    toolbarMsg$ = APP_ui.div('', 'tt-toolbar-msg');
    busy$ = APP_ui.div('', 'progress').append(APP_ui.div('', 'indeterminate'));

    view$.append(nav$.append(title$, menuIcon$, actionUl$, menuUl$, sideNav$),
        busy$, toolbarMsg$);

    ui.message = message;
    ui.title = title;
    ui.refresh = refresh;
    ui.addIcon = addIcon;
    ui.removeIcon = removeIcon;
    ui.addMenu = addMenu;
    ui.reset = reset;
    ui.busy = busy;
    ui.nav$ = nav$;

    window.setTimeout(function() {
      menuIcon$.sideNav();
    }, 1);

    busy(false);
    return ui;

    function message(arg0) {
      toolbarMsg$.text('');
    }
    function refresh(cb) {
      refreshCb = cb;
    }
    function done(arg0) {
      if (_.isFunction(arg0)) {
        doneCb = arg0;
        done$.show();
      } else {
        if (_.isFunction(doneCb)) {
          doneCb.apply(this, arguments);
        }
      }
    }

    function addMenu(menuLabel) {
      var menu$ = APP_ui.li().append(
          APP_ui.a().attr('href', '#').text(menuLabel));
      menuUl$.append(menu$);

      sideNav$.append(APP_ui.li().append(
          APP_ui.a().attr('href', '#').text(menuLabel).click(function() {
            menuIcon$.sideNav('hide');
            menu$.click();
          })));

      return menu$;
    }

    function addIcon(iconName) {
      var icon$ = APP_ui.li().append(
          APP_ui.a().attr('href', '#').append(
              APP_ui.i(iconName, 'material-icons')));
      removeIcon(iconName);
      actionUl$.append(icon$);
      icons[iconName] = icon$;

      return icon$;
    }

    function getIcon(iconName) {
      return icons[iconName];
    }

    function removeIcon(iconName) {
      if (icons[iconName] && icons[iconName].remove) {
        icons[iconName].remove();
        delete icons[iconName];
      }
    }

    function title(arg0) {
      if (_.isUndefined(arg0)) {
        return title$.text();
      } else {
        title$.text(arg0);
      }
    }

    function reset() {
      actionUl$.empty();
      title$.text('-title-');
    }

    function busy(arg0) {
      busy$.css('visibility', arg0 ? 'visible' : 'hidden');
    }
  }
  APP_ui.mobileToolbarUi = mobileToolbarUi;

  function textareaUi(settings) {
    settings = settings || settings;
    settings.isTextarea = true;
    return inputUi(settings);
  }

  APP_ui.textareaUi = textareaUi;

  function inputUi(settings) {

    settings = settings || {};
    var ui, view$, input$, label$, icon$, id;
    var changeCb, actionCb, isTextarea;
    //
    isTextarea = settings.isTextarea;
    //
    ui = APP_ui.templateUi();
    view$ = ui.view().addClass('input-field');
    input$ = isTextarea ? APP_ui.textarea('', 'materialize-textarea') : APP_ui
        .input();
    label$ = APP_ui.label();
    id = APP_base.newId();
    label$.attr('for', id);
    input$.attr('id', id);
    input$.attr('type', settings.type || 'text').css('color', 'black');
    if (settings.name) {
      input$.attr('name', settings.name);
    }
    if (settings.active) {
      window.setTimeout(function() {
        input$.trigger('autoresize');
        label$.addClass('active');
      }, 0);
    }
    label$.text(settings.label).css('color', 'gray');
    if (settings.icon) {
      icon$ = APP_ui.i(settings.icon, 'material-icons prefix');
      view$.append(icon$);
    }
    view$.append(input$, label$);

    if (!isTextarea) {
      input$.keypress(function(e) {
        var code;
        if (e) {
          code = (e.keyCode ? e.keyCode : e.which);
        } else {
          code = 13;
        }
        if (code == 13) {
          e.preventDefault();
          action(input$.text());
        }
        change(input$.text());
      });
    }
    if (settings.css) {
      input$.css(settings.css);
    }

    ui.input$ = input$;
    ui.value = value;
    ui.editable = editable;
    ui.action = action;
    ui.change = change;

    return ui;

    function change(arg0) {
      if (_.isFunction(arg0)) {
        changeCb = arg0;
      } else if (_.isFunction(changeCb)) {
        changeCb.apply(this, arguments);
      }
    }

    function action(arg0) {
      if (_.isFunction(arg0)) {
        actionCb = arg0;
      } else if (_.isFunction(actionCb)) {
        actionCb.apply(this, arguments);
      }
    }

    function editable(is) {
      if (!is || is === 'false') {
        input$.attr('disabled', 'disabled');
        input$.css('color', 'gray');
      } else {
        input$.removeAttr('disabled');
        input$.css('color', 'black');
      }
    }

    function value(arg0) {
      if (!_.isUndefined(arg0)) {
        input$.val(arg0);
        window.setTimeout(function() {
          input$.trigger('autoresize');
          label$.addClass('active');
        }, 1);

      }
      return input$.val();
    }

  }

  APP_ui.inputUi = inputUi;

  //
  // FILE INPUT UI
  //

  function fileInputUi(settings) {
    settings = settings || {};
    var ui, view$, btn$, inputFile$, input$;

    ui = APP_ui.templateUi();
    view$ = ui.view().addClass('file-field input-field');
    inputFile$ = APP_ui.input().attr('type', 'file').attr('name',
        'uploadFile' + APP_base.newId());
    input$ = APP_ui.input('', 'file-path validate').attr('type', 'text');
    btn$ = APP_ui.div('', 'btn').append(APP_ui.span('File'), inputFile$);

    view$.append(btn$, APP_ui.div('', 'file-path-wrapper').append(input$));

    if (settings.accept) {
      inputFile$.attr('accept', settings.accept);
    }
    if (settings.multiple) {
      inputFile$.attr('multiple', 'multiple');
    }
    function view() {
      return view$;
    }
    return {
      'view' : view,
      'value' : function() {
      }
    };
  }

  APP_ui.fileInputUi = fileInputUi;

  //
  // CALENDAR UI -start-
  // http://stackoverflow.com/questions/30324552/how-to-set-the-date-in-materialize-datepicker

  function calendarUi(settings) {
    var ui, view$, pd;
    ui = APP_ui.inputUi(settings);
    window.setTimeout(function() {
      ui.input$.pickadate({
        selectMonths : true, // Creates a dropdown to control month
        selectYears : 15,
        format : 'yyyy-mm-dd',
        onClose : settings.select || _.noop
      // C, reates a dropdown of 15 years to control year
      });

      pd = ui.input$.pickadate('picker');
      if (settings.value === 'today') {
        pd.set('select', new Date());
      }
    }, 1);

    return ui;
  }

  APP_ui.calendarUi = calendarUi;
  //
  // SELECT BOXES UI -start-
  //

  function selectBoxesUi(settings) {
    settings = settings || {};
    var ui = APP_ui.templateUi(), view$ = ui.view(), label$, buttonType, buttonId, groupId, buttons$, buttonUis = [];
    view$.addClass('select-boxes-ui');

    buttonType = settings.buttonType || settings.type || 'radio';
    buttonId = buttonType + '-' + APP_base.newId();
    groupId = 'groupId' + '-' + APP_base.newId();

    label$ = APP_ui.label(settings.label || settings.name || '').attr('for',
        buttonId);
    buttons$ = APP_ui.div('', '').attr('id', buttonId);
    view$.append(label$);
    view$.append(buttons$);

    var selectList = settings.selectList;

    var defaultValue = settings.defaultValue || '';

    var byValue = {};

    if (_.isArray(selectList)) {
      _.each(selectList, function(e, i) {
        var value = e.value;
        var label = e.label || e.value;

        buttonUi = APP_ui.inputUi({
          'type' : buttonType,
          'value' : value,
          'label' : label,
          'name' : groupId
        })
        buttonUis.push(buttonUi);
        byValue[value] = buttonUi;
        view$.append(buttonUi.view());
      });
    }

    ui.value = value;

    ui.value(settings.value);

    window.setTimeout(function() {
      Materialize.updateTextFields();
    }, 1);

    return ui;

    function value(arg0) {
      var v$, value, arr;
      if (_.isString(arg0)) {
        view$.find('input').prop('checked', false);
        arr = arg0.split(',');
        $.each(arr, function(i, v) {
          v$ = view$.find('input[value="' + v + '"]').prop('checked', true);
        });
      }
      _.each(byValue, function(ui, v) {
        if (ui.input$.prop('checked')) {
          if (value) {
            value += ',' + v;
          } else {
            value = v;
          }
        }
      });

      return value || defaultValue;
    }

  }

  APP_ui.selectBoxesUi = selectBoxesUi;

  //
  // SLIDER
  //

  function sliderUi(settings) {
    settings = settings || {};
    var ui, view$, slides$;

    ui = APP_ui.templateUi();
    view$ = ui.view().addClass('slider');

    slides$ = APP_ui.ul('', 'slides');

    view$.append(slides$);

    ui.add = add;
    ui.fullscreen = fullscreen;

    return ui;

    function add(e$, caption) {
      return APP_ui.li().appendTo(slides$).append(e$, caption$);
    }

    function fullscreen(arg0) {
      view$.slider({
        full_width : !!arg0
      });
    }

  }
  APP_ui.sliderUi = sliderUi;
  //
  // UI TYPE MAP
  //

  var _uiTypeMap = {
    'textarea' : 'APP_ui.textareaUi',

  };
  function uiTypeMap(name) {
    if (!name) {
      return 'APP_ui.inputUi';
    }
    return _uiTypeMap[name] || name;

  }

  APP_ui.uiTypeMap = uiTypeMap;

  //
  // UI TYPE MAP -end-
  //

  function processInfoUi() {
    var ui = APP_ui.templateUi();
    var view$ = ui.view().addClass('co-upload-process-info-ui');
    var toolbar$ = $('<div>').addClass('co-upload-process-info-toolbar');
    var holder$ = $('<div>').addClass('co-upload-process-info-holder');

    toolbar$.append(APP_ui.button('close', function() {
      ui.hide();
    }));

    view$.append(toolbar$, holder$);

    ui.data = data;
    ui.value = value;

    return ui;

    function data(arg0) {
      value.apply(this, arguments);
    }

    function value(arg0, title) {
      var div$, processInfo;
      if (arg0 === undefined) {
        return;
      } else {
        processInfo = _.isObject(arg0) ? (arg0.processInfo ? arg0.processInfo
            : arg0) : JSON.parse(arg0);
        div$ = APP_ui.commonData({
          'processInfo' : processInfo,
          'title' : title || '-no title-'
        }, {
          'showTableAndProcessInfo' : true,
          'display' : 'all',
          'showDataTable' : false,
          'showProcessInfoAttributes' : false
        });
        holder$.empty().append(div$);
        ui.show();
      }
    }
  }

  APP_ui.processInfoUi = processInfoUi;

  //
  //
  //

  function processInfoData(serviceData, context) {
    var ui, view$, content$, footer$, processInfoUi;
    ui = APP_ui.templateUi();
    view$ = ui.view().addClass('modal modal-fixed-footer');
    content$ = APP_ui.div('', 'modal-content');
    footer$ = APP_ui.div('', 'modal-footer');

    view$.append(content$, footer$);
    processInfoUi = APP_ui.processInfoUi();

    processInfoUi.data(serviceData);

    content$.append(processInfoUi.view());
    footer$.append(APP_ui.link('close', function() {
      view$.closeModal();
    }));
    $('body').append(ui.view());
    window.setTimeout(function() {
      view$.openModal();
    }, 0);
  }

  APP_ui.processInfoData = processInfoData;

  // <!-- ----- -->
  // <!-- LOGIN -->
  // <!-- ----- -->

  function loginUi(settings) {
    settings = settings || {};

    var storedCredentialName;
    var ui, view$, form$, useridUi, passwdUi, login$, newPassword$, message$;

    storedCredentialName = settings.storedCredentialName
        || 'stored-credential-name';
    ui = APP_ui.templateUi();

    view$ = ui.view().addClass('login-ui container');
    if (settings.image) {
      view$.append(APP_ui.div('', 'section image').append(
          APP_ui.img('', 'responsive-img').attr('src', settings.image)));
    }
    if (settings.title) {
      view$.append(APP_ui.div('', 'section title').append(
          APP_ui.h5(settings.title)));
    }

    form$ = APP_ui.form('', 'row');

    useridUi = APP_ui.inputUi({
      'type' : 'email',
      'label' : 'User Id (email)',
      'active' : true
    });
    passwdUi = APP_ui.inputUi({
      'type' : 'password',
      'label' : 'Password',
      'active' : true
    });
    form$.append(useridUi.view().addClass('col s12 m6 offset-m3 l6 offset-l3'));
    form$.append(passwdUi.view().addClass('col s12 m6 offset-m3 l6 offset-l3'));

    view$.append(APP_ui.div('', 'section').append(form$));

    login$ = APP_ui.button('login', loginFun);
    newPassword$ = APP_ui.button('New Password', newPasswordFun);
    view$.append(APP_ui.div().addClass('buttons section').append(login$, ' ',
        newPassword$));
    message$ = APP_ui.div('Please enter user id and password.',
        'section message red-text accent-3-text message');
    view$.append(message$);

    triggerStoredCredential();

    ui.triggerStoredCredential = triggerStoredCredential;

    return ui;

    function loginFun() {

      var userId, password, pwhash;
      userId = useridUi.value();
      password = passwdUi.value();

      if (!userId || userId.length == 0) {
        message$.text('Please enter user id');
        ui.view().show();
        return;
      }

      if (!password && password.length == 0) {
        message$.text('Please enter password');
        ui.view().show();
        return;
      }

      // $('#log').append(APP_ui.div(userId));
      // $('#log').append(APP_ui.div(password));

      pwhash = CryptoJS.SHA1(password).toString(CryptoJS.enc.Hex);
      rQ.call('UserLogin', {
        'action' : 'logIn',
        'userId' : userId,
        'pwhash' : pwhash
      }, function(data) {
        var userInfo = rQ.toList(data)[0];
        if (userInfo) {
          APP_base.ls(storedCredentialName, {
            'userid' : userId,
            'passwd' : password,
            'sessionid' : userInfo.sessionId
          });
          APP_data.sessionId(userInfo.sessionId);
          message$.text('Login successful!');
          ui.action(userInfo);
        } else {
          message$.text('Login not successful.');
          ui.view().show();
        }
      }, function(arg0, arg1) {
        ui.action("offline");
      });

    }

    function newPasswordFun() {
    }

    function triggerStoredCredential(fire) {

      var credentials = APP_base.ls(storedCredentialName);
      if (credentials) {
        useridUi.value(credentials.userid);
        passwdUi.value(credentials.passwd);
      }
      if (fire) {
        loginFun();
      }
    }

  }
  APP_ui.loginUi = loginUi;

  //
  // TOAST
  //

  function toast() {
    var s = APP_ui.span();
    Materialize.toast(s.append.apply(s, arguments), 5000, 'rounded');
  }
  APP_ui.toast = toast;

})();
