var SOC_mobile = SOC_mobile || {};

/**
 * 
 */

(function() {

  var Page = {};

  rQ.parameterWrapper(function(p) {
    if (APP_data.sessionId()) {
      p.sessionId = APP_data.sessionId();
    }
    return p;
  });

  function initPage() {

    var switchSupport = APP_ui.switchSupport();

    Page.headerTop = $('#header-top');
    Page.centerTop = $('#center-top');
    Page.footerTop = $('#footer-top');

    Page.log = $('#log');
    Page.main = $('#main');
    Page.welcome = $('#welcome');
    // apps
    Page.navApps = $('#nav-apps');
    // chat
    Page.chatToolbar = $('#chat-toolbar');
    Page.chatMain = $('#chat-main');
    Page.chatToolbarBack = $('#chat-toolbar-back');
    switchSupport.put('chat', Page.chatToolbar);
    switchSupport.put('chat', Page.chatMain);
    // misc
    Page.miscToolbar = $('#misc-toolbar');
    Page.miscMain = $('#misc-main');
    switchSupport.put('more_vert', Page.miscToolbar);
    switchSupport.put('more_vert', Page.miscMain);

    //

    Page.showApp = function(app) {
      switchSupport.show(app);
    };

    // hide all
    Page.showApp('---');
    //

    APP_base.dispatchInit(function() {
      rQ.url('http://localhost:8080/anakapa/remoteQuery');
      authenticate();
    }, function() {
      rQ.url('http://ooit1.nine.ch:8080/remoteQuery');
      authenticate();
    }, function() {
      rQ.url('http://ooit1.nine.ch:8080/remoteQuery');
      Page.log.append(APP_ui.div('isphone'));
      document.addEventListener("deviceready", authenticate, false);
    });
  }
  SOC_mobile.initPage = initPage;

  function authenticate() {

    var loginUi = APP_ui.loginUi({
      'storedCredentialName' : '__socCredentials',
      'title' : 'Welcome to SOC'
    });
    loginUi.action(function(userInfo) {
      initMain(userInfo);
    });

    Page.main.empty().append(loginUi.view().hide());

    loginUi.triggerStoredCredential(true);

    Page.main.removeClass('initial-hidden');
  }

  var h3 = function() {
    return APP_ui.h3.apply(this, arguments).animateCss('pulse');
  }
  var h4 = function() {
    return APP_ui.h4.apply(this, arguments).animateCss('pulse');
  }
  var h5 = function() {
    return APP_ui.h5.apply(this, arguments).animateCss('pulse');
  }

  function initMain(userInfo) {

    Page.welcome.show();

    SOC_mobile.offline = userInfo == 'offline';
    Page.main.addClass('offline');

    Page.main.empty();

    $('.slider').slider();
    Page.welcome.find('ul.indicators').hide();
    Page.welcome.find('.slider').click(function() {
      Page.welcome.hide();
      startMainToolbar(userInfo);
    });

  }

  function startMainToolbar(userInfo) {
    var headerDispatch = {}, appMap;

    userInfo = _.isObject(userInfo) ? userInfo : APP_base.ls('userInfo');
    APP_base.ls('userInfo', userInfo);

    appMap = {
      'chat' : {
        'uiType' : chatUiToolbarUi
      },
      'more_vert' : {
        'uiType' : miscUi
      }
    };

    // scan Page.navApps

    Page.navApps.find('ul li a i').each(function() {
      var this$ = $(this), a$, key;
      key = this$.text();
      a$ = this$.parent();
      headerDispatch[key] = a$;
      a$.click(function() {
        APP_base.ls('soc-last-subapp', key);
        switchToApp(key);
      });
    });

    switchToApp(APP_base.ls('soc-last-subapp'));

    return;

    function switchToApp(sKey) {
      var sApp, uiFn;
      sApp = appMap[sKey];
      if (!sApp) {
        return;
      }
      // hide
      _.each(appMap, function(app, key) {
        if (key != sKey && app.ui) {
          app.ui.hide();
        }
      });
      //

      if (!sApp.ui) {
        uiFn = APP_base.findFunction(sApp.uiType, APP_ui.templateUi);
        sApp.ui = uiFn(userInfo);
      }

      sApp.ui.show();
      Page.showApp(sKey);
    }

  }

  //
  //
  // CHAT
  //
  //

  //
  var ChatState;
  var ChatGlobalUi;

  function chatUiToolbarUi(userInfo) {

    var intervalId, intervalFn;

    Page.chatToolbar.removeClass('initial-hidden');
    Page.chatMain.removeClass('initial-hidden');

    // var tabs$ = $('#chat-toolbar');
    var messages$ = Page.chatMain.find('#chat-messages');
    var members$ = Page.chatMain.find('#chat-members');
    var chats$ = Page.chatMain.find('#chat-chats');

    // APP_base.ls('ChatState', null);

    ChatState = APP_base.ls('ChatState');
    ChatGlobalUi = {
      'showBack' : showBack,
      'hideBack' : hideBack
    }

    // MIG **
    // APP_base.ls('ChatState', null);

    ChatState = ChatState || {
      'chats' : [],
      'contacts' : [], // list of {userId:,}
      'memberShip' : {}, // chatTid -> list of userId
      'messages' : {},
      'openRequests' : [],
      'lastChatMessageTid' : 1,
      'lastLocalTid' : 1
    };

    if (SOC_mobile.offline) {
      toast('offline');
      build();
    } else {
      toast('reloading_chat_data...');
      SOC_mobile.processChatRequests(function() {
        toast('chat_data_loaded');
        build();
      });
    }

    window.setTimeout(function() {
      Page.chatToolbar.find('ul.tabs').tabs();
    }, 0);

    return {
      'show' : function() {
        Page.chatToolbar.show();
        if (!intervalId) {
          intervalId = window.setInterval(function() {
            if (intervalFn) {
              intervalFn.apply(this, arguments);
            }
          }, 5000);
        }
      },
      'hide' : function() {
        Page.chatToolbar.hide();
        if (intervalId) {
          window.clearInterval(intervalId);
          intervalId = null;
        }
      }
    };

    function build() {
      var cm = chatMessagesUi(userInfo);
      intervalFn = cm.refresh;
      messages$.append(cm.view());
      members$.append(membersUi(userInfo).view());
      chats$.append(chatsUi(userInfo).view());
    }

    function showBack(label, cb) {
      Page.chatToolbarBack.removeClass('initial-hidden');
      Page.chatToolbarBack.empty().append(
          APP_ui.iconButtonFAB('arrow_back', function() {
            hideBack();
            cb.apply(this, arguments);
          }).addClass('black'), APP_ui.div(label, 'label')).show();

      Page.chatToolbar.find('.tabs-holder').hide();
    }

    function hideBack() {
      Page.chatToolbarBack.empty().hide();
      Page.chatToolbar.find('.tabs-holder').show();
    }

  }

  //
  // CHAT MESSAGES UI
  //

  function chatMessagesUi(userInfo) {

    var ui, view$, chats$, messages$, chats$, list$, messageInput$, currentChat;
    ui = APP_ui.templateUi();
    view$ = ui.view().addClass('chat-messages container');
    chats$ = APP_ui.div('', 'chats');
    messages$ = APP_ui.div('messages', 'messages');

    view$.append(chats$, messages$);

    buildChats();

    ui.refresh = refresh;

    return ui;

    function refresh() {
      processChatMessageUpdate(function() {
        if (currentChat) {
          renderMessages(currentChat);
        } else {
          // buildChats();
        }
      });
    }

    function buildChats() {
      var chatSelectUi;
      messages$.hide()
      chats$.empty().show();
      ChatGlobalUi.hideBack();

      if (!ChatState.chats || ChatState.chats.length == 0) {
        chats$.append(APP_ui.div('you_have_no_chats_yet', 'no-chats'));
      } else {
        chatSelectUi = SOC_mobile.chatSelectUi({
          'title' : 'my_chats'
        });
        chatSelectUi.value(ChatState.chats);
        chatSelectUi.action(function(chat) {
          buildChatMessages(chat);
        });
        chats$.append(chatSelectUi.view());
      }
      Page.footerTop.empty();
      currentChat = null;
    }

    function buildChatMessages(chat) {

      var send$, edit$;

      currentChat = chat;
      ChatGlobalUi.showBack(chat.title, buildChats);

      list$ = APP_ui.div('', 'message-list');
      messageInput$ = APP_ui.input(function() {
        send$.click();
      });

      // FAB
      send$ = APP_ui.iconButtonFAB('send', function() {
        var message = messageInput$.val(), requests = [];
        if (message) {
          ChatState.lastLocalTid++;
          processChatRequests({
            'serviceId' : 'SOC.ChatMessage.insert',
            'parameters' : {
              'chatTid' : chat.chatTid,
              'message' : message
            }
          }, function() {
            buildChatMessages(chat);
          });
        } else {
          toast('empty_message!');
        }
      });

      // edit$ = APP_ui.div('', 'chat-message-bottom row').append(
      // APP_ui.div().addClass('col s2').append(input$).addClass('col s10'),
      // ' ', APP_ui.div().addClass('col s2').append(send$.addClass('green')));

      edit$ = APP_ui.div('', 'chat-message-edit').append(
          APP_ui.div('', 'input').append(messageInput$), ' ',
          APP_ui.div().append(send$.addClass('green accent-3')));

      chats$.hide();
      messages$.empty().show();
      messages$.append(list$);

      renderMessages(chat);

      Page.footerTop.empty().append(edit$);

      chats$.hide();

    }

    function renderMessages(chat) {
      var lastChatMessageTid, messageList, end$;
      messageList = ChatState.messages[chat.chatTid] || [];

      lastChatMessageTid = list$.data('lastChatMessageTid');

      if (lastChatMessageTid == ChatState.lastChatMessageTid) {
        if (messageInput$) {
          //messageInput$.focus();
        }
        return;
      }
      list$.empty();

      list$.data('lastChatMessageTid', ChatState.lastChatMessageTid);

      end$ = APP_ui.a().attr('href', '#').click(function() {
        alert(end$.position().top);
        scrollToEnd();
      }).addClass('end chat-message').text('- update done -');

      if (messageList.length == 0) {
        list$.append(APP_ui.div('no_messages_for_this_chat', 'no-message'));
      } else {
        _.each(messageList, function(cm, i) {
          var e$, creator, creator$, created, created, isMe;
          creator = ChatState.contactsMap[cm.creatorTid];
          created = moment(cm.created, "x").fromNow();
          isMe = ChatState.me.userTid == cm.creatorTid;
          e$ = APP_ui.div().addClass('chat-message');
          if (isMe) {
            e$.addClass('me');
            creator$ = APP_ui.div('me', 'chat-creator me');
          } else {
            creator$ = APP_ui.div(creator.userId || '???', 'chat-creator');
          }
          e$.append(creator$);
          e$.append(APP_ui.div(created, 'chat-created'));
          e$.append(APP_ui.div(cm.message || '???', 'chat-text'));
          list$.append(e$);
        });
        list$.append(end$);
      }

      window.setTimeout(scrollToEnd, 1);

      function scrollToEnd() {

        var offset = end$.offset().top;
        Page.log.empty().append('offset ' + offset);
        Page.centerTop.animate({
          scrollTop : end$.position().top
        }, 300);
        end$.animateCss('bounceOut', 'hide');
        if (messageInput$) {
          //messageInput$.focus();
        }
      }

    }

  }

  //
  // *CHAT* MEMBER UI
  //

  function membersUi(userInfo) {

    var ui, view$, list$, detail$, newContact$, currentContact, switchSupport;

    var highlightUserId;

    ui = APP_ui.templateUi();
    view$ = ui.view().addClass('members-ui container');

    list$ = APP_ui.div('_loading', 'member-list collection');
    detail$ = APP_ui.div().addClass('section');
    newContact$ = APP_ui.div().addClass('section row');

    switchSupport = APP_ui.switchSupport();
    switchSupport.put('list', list$);
    switchSupport.put('newContact', newContact$);
    switchSupport.put('detail', detail$);
    view$.append(detail$, newContact$, list$);

    buildContactList();

    return ui;

    function newContact() {

      var addButton$, newContactUi;

      newContact$.empty();

      ChatGlobalUi.showBack('add_new_contact', buildContactList);

      newContactUi = APP_ui.inputUi({
        'label' : 'new_contact_email',
        'type' : 'email'
      });

      addButton$ = APP_ui.iconButtonRaised('add', function() {
        var userId;
        userId = newContactUi.value();
        if (!userId) {
          toast('enter_member_email');
        } else if (_.findWhere(ChatState.contacts, {
          'userId' : userId
        })) {
          toast('member ' + userId + ' already_exists!');
        } else {
          highlightUserId = userId;
          processChatRequests({
            'serviceId' : 'SOC.Contact.insert',
            'parameters' : {
              'userId' : userId
            }
          }, function() {
            toast('new_contact_added : ' + userId);
          });
        }
      });
      newContact$.append(APP_ui.div('', 'row').append(
          newContactUi.view().addClass('col s10'),
          addButton$.addClass('col s2 input-field')));
      switchSupport.show('newContact');
    }

    function buildContactList() {
      var add$;

      ChatGlobalUi.hideBack();

      list$.empty();
      if (!ChatState.contacts || ChatState.contacts.length == 0) {
        list$.text('no_contacts_yet');
      } else {
        _.each(ChatState.contacts, function(contact, i) {
          var contactUi;
          contactUi = SOC_mobile.contactUi();
          contactUi.value(contact);
          contactUi.action(function() {
            currentContact = contact;
            openContactDetail(contact);
          });
          if (contact.userId == highlightUserId) {
            contactUi.view().animateCss('flipInX');
            highlightUserId = null;
          }
          list$.append(contactUi.view().addClass('collection-item'));
        });
      }

      // FAB
      add$ = APP_ui.iconButtonFAB('add', function() {
        newContact();
      });
      list$.append(APP_ui.div('', 'fixed-action-btn').append(
          add$.addClass('red')));

      switchSupport.show('list');
    }

    function openContactDetail(contact) {

      var title$, chatSelectUi, b$, done$, cancel$, list, chatList = [];

      ChatGlobalUi.showBack('invite : ' + contact.userId, buildContactList);

      chatSelectUi = SOC_mobile.chatSelectUi({
        'title' : 'invite ' + contact.userId + ' to your chats:'
      });

      _.each(ChatState.chats, function(chat) {
        chat = APP_base.deepClone(chat);
        if (_.contains(ChatState.memberShip[chat.chatTid], contact.userId)
            || chat.creatorId != userInfo.userId) {
          chat.disabled = true;
        } else {
          // chatList.push(chat);
        }
        chatList.push(chat);
      });

      chatSelectUi.value(chatList);
      chatSelectUi.action(function(chat) {
        toast(contact.userId + ' invited to ' + chat.title);
        processChatRequests({
          'serviceId' : 'SOC.ChatMember.insert',
          'parameters' : {
            'chatTid' : chat.chatTid,
            'userTid' : contact.userTid
          }
        }, function() {
          toast(contact.userTid + ' invited to ' + chat.title);
          openContactDetail(contact);
        });
      });

      detail$.empty().append(chatSelectUi.view());
      switchSupport.show('detail');
    }

    function showBack(label, cb) {
      Page.chatToolbarBack.empty().append(
          APP_ui.iconButtonFAB('arrow_back', function() {
            Page.chatToolbarBack.empty().hide();
            cb.apply(this, arguments);
          }).addClass('black'), APP_ui.div(label, 'label')).show();
    }

  } // end of *CHAT* MEMBERS UI

  //
  // *CHAT* CHATS UI
  //

  function chatsUi() {
    var ui, view$, tb$, detail$, list$;
    ui = APP_ui.templateUi();
    view$ = ui.view().addClass('chats-ui section');
    tb$ = APP_ui.div('', 'section buttons');
    detail$ = APP_ui.div().addClass('');
    list$ = APP_ui.div().addClass(' ');
    tb$.append(APP_ui.button('new chat', function() {
      detail$.empty().append(newChat()).show();
      tb$.hide();
    }));
    view$.append(tb$, detail$, list$);
    // new group

    buildChatList();

    return ui;

    function buildChatList() {
      var chatSelectUi;
      list$.empty();
      if (!ChatState.chats || ChatState.chats.length == 0) {
        list$.text('you_have_no_chats_yet');
      } else {

        chatSelectUi = SOC_mobile.chatSelectUi({
          'title' : 'current_chats'
        });
        chatSelectUi.value(ChatState.chats);
        list$.append(chatSelectUi.view());
      }
    }

    function newChat() {
      var v$, entryUi, b$, done$, cancel$, e;
      v$ = APP_ui.div('', 'new-chat');
      b$ = APP_ui.div('', 'buttons');
      entryUi = APP_ui.inputUi({
        'label' : 'title_of_new_chat'
      });
      done$ = APP_ui.button('done', function() {
        var title = entryUi.value();
        if (!title) {
          toast('enter_title');
        } else if (_.findWhere(ChatState.chats, {
          'title' : title
        })) {
          toast('title_already_exists');
        } else {
          ChatState.lastLocalTid++;
          e = {
            'title' : title,
            'created' : APP_base.currentTimeMillis(),
            'localChatTid' : ChatState.lastLocalTid
          };
          // save_chat
          ChatState.chats.push(e);
          chatSaveAll();
          detail$.hide();
          tb$.show();

          processChatRequests({
            'serviceId' : 'SOC.Chat.insert',
            'parameters' : {
              'title' : title
            }
          }, buildChatList);

        }
      });
      cancel$ = APP_ui.button('cancel', function cancel() {
        detail$.hide();
        tb$.show();
      });
      v$.append(entryUi.view(), b$.append(done$, ' ', cancel$));
      return v$;
    }

  }

  function processChatMessageUpdate(cb) {
    rQ.call('SOC.ChatMessage.selectLast', {
      'lastChatMessageTid' : ChatState.lastChatMessageTid
    }, function(data) {
      var t = ChatState.messages;
      _.each(rQ.toList(data), function(message) {
        t[message.chatTid] = t[message.chatTid] || [];
        t[message.chatTid].push(message);
        ChatState.lastChatMessageTid = message.chatMessageTid;
      });

      if (_.isFunction(cb)) {
        cb.apply(this, arguments);
      }
      APP_base.ls('ChatState', ChatState);
    });
  }

  function processChatRequests(requests, cb) {

    var chatMembers;

    cb = _.isFunction(requests) ? requests : cb;

    requests = _.isFunction(requests) ? [] : requests;
    requests = !_.isArray(requests) ? [ requests ] : requests;

    requests.push({
      'serviceId' : 'SOC.Contact.selectAll',
      'parameters' : {}
    });
    requests.push({
      'serviceId' : 'SOC.Chat.select',
      'parameters' : {}
    });
    requests.push({
      'serviceId' : 'SOC.ChatMember.select',
      'parameters' : {}
    });
    requests.push({
      'serviceId' : 'SOC.ChatMessage.selectLast',
      'parameters' : {
        'lastChatMessageTid' : ChatState.lastChatMessageTid
      }
    });
    requests.push({
      'serviceId' : 'SOC.User.me',
      'parameters' : {}
    });
    rQ.call(requests, function(dataArray) {

      var messages, chats, t;

      ChatState.me = rQ.toList(dataArray.pop())[0];

      messages = dataArray.pop();
      ChatState.chatMembers = rQ.toList(dataArray.pop());

      ChatState.chats = rQ.toList(dataArray.pop());

      ChatState.contacts = rQ.toList(dataArray.pop());
      ChatState.contactsMap = {};
      _.each(ChatState.contacts, function(c) {
        ChatState.contactsMap[c.userTid] = c;
      });
      //
      t = ChatState.messages;
      _.each(rQ.toList(messages), function(message) {
        t[message.chatTid] = t[message.chatTid] || [];
        t[message.chatTid].push(message);
        ChatState.lastChatMessageTid = message.chatMessageTid;
      });
      //
      t = {};
      _.each(ChatState.chatMembers, function(e) {
        t[e.chatTid] = t[e.chatTid] || [];
        t[e.chatTid].push(e.userId);
      });
      ChatState.memberShip = t;
      //
      if (_.isFunction(cb)) {
        cb.apply(this, arguments);
      }
      APP_base.ls('ChatState', ChatState);
    });
  }
  SOC_mobile.processChatRequests = processChatRequests;

  function chatSaveAll() {

  }

  //
  //
  // *CHAT* COMMIN
  //
  //

  //
  // CONTACT UI
  //
  function contactUi(settings) {
    var ui, view$, currentContact;
    ui = APP_ui.templateUi();
    view$ = ui.view().addClass('contact-ui');
    view$.click(fire);

    ui.value = value;

    return ui;

    function value(arg0) {
      if (arg0) {
        currentContact = arg0;
        view$.append(APP_ui.div(arg0.userId, 'userId'));
      }
      return currentContact;
    }

    function fire() {
      ui.action(currentContact);
    }
  }
  SOC_mobile.contactUi = contactUi;

  //
  // CONTACT CHAT UI depr?
  //
  function contactChatUi() {
    var ui, view$, chatList;
    view$ = ui.view().addClass('contact-chat-ui');
    view$.click(fire);

    ui.value = value;

    return ui;

    function fire() {
      ui.action($(this).data(chat));
    }

  }
  SOC_mobile.contactChatUi = contactChatUi;

  function chatSelectUi(settings) {

    settings = settings || {};

    var ui, view$, list$, chatList;

    ui = APP_ui.templateUi();
    view$ = ui.view().addClass('chat-select-ui section');
    view$.append(APP_ui.div(settings.title || 'select_chat...', 'title-1'));
    list$ = APP_ui.div('', 'chat-list');
    view$.append(list$);

    ui.value = value;

    return ui;

    function value(arg0) {
      var res = [];
      if (_.isArray(arg0)) {
        chatList = arg0;
        list$.empty();
        _.each(chatList, function(chat, i) {
          var chat$, title$;
          chat$ = APP_ui.div('', 'chat-item');
          title$ = APP_ui.div(chat.title, 'chat-title');

          chat$.data('chat', chat);
          if (chat.disabled) {
            chat$.addClass('disabled');
          } else {
            chat$.click(fire);
            if (chat.selected) {
              chat$.addClass('selected');
            }
          }
          list$.append(chat$.append(APP_ui.iconButton('chat'), ' ', title$));
        });
      }
      list$.children().each(function() {
        var this$, chat;
        this$ = $(this);
        chat = this$.data('chat');
        if (this$.data('selected')) {
          res.push(chat);
        }
      });
      return res;
    }

    function fire() {
      var this$, chat, selected = false;
      this$ = $(this);
      chat = this$.data('chat');
      selected = this$.data('selected');
      this$.data('selected', selected = !selected);
      this$.toggleClass('selected');
      ui.action(chat, selected);
    }
  }
  SOC_mobile.chatSelectUi = chatSelectUi;

  //
  //
  // MISC COMMAND
  //
  //

  //
  var MiscState;

  function miscUi(userInfo) {

    Page.miscToolbar.removeClass('initial-hidden');
    Page.miscMain.removeClass('initial-hidden');
    MiscState = APP_base.ls('MiscState');

    MiscState = MiscState || {
      'lastUse' : []
    };

    if (SOC_mobile.offline) {

    } else {

    }
    build();

    return {
      'show' : function() {
        Page.miscToolbar.show();
        Page.miscMain.show();
      },
      'hide' : function() {
        Page.miscToolbar.hide();
        Page.miscMain.hide();
      }
    };

    function build() {
      var buttons$, button$;
      buttons$ = APP_ui.div('Some commands ...', 'buttons section collection');
      Page.miscMain.empty().append(buttons$);
      //
      button$ = APP_ui.link('reload', function() {
        location.reload();
      });
      buttons$.append(button$.addClass('collection-item'));
      //
      button$ = APP_ui.link('reload(true)', function() {
        location.reload(true);
      });
      buttons$.append(button$.addClass('collection-item'));
      //
      button$ = APP_ui.link('remove SOC credentials', function() {
        APP_base.ls('__socCredentials', null);
        location.reload(true);
      });
      buttons$.append(button$.addClass('collection-item'));
      //
      button$ = APP_ui.link('remove ChatState', function() {
        APP_base.ls('ChatState', null);
        location.reload(true);
      });
      buttons$.append(button$.addClass('collection-item'));
      //
      button$ = APP_ui.link('welcome', function() {
        Page.welcome.show();
      });
      buttons$.append(button$.addClass('collection-item'));

    }

  }

  //
  // COMMON
  //

  function toast() {
    var s = APP_ui.span();
    Materialize.toast(s.append.apply(s, arguments), 2000, 'rounded');
  }

})();