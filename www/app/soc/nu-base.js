$(document).ready(function() {
  var body$ = $('body');
  SOC_NU_base.create(body$);
});

// TODO register '13' action on from/to
// 

var SOC_NU_base = SOC_NU_base
    || (function() {

      var SQ_read = 'SOC_NU.read';
      var SQ_write = 'SOC_NU.write';

      return {
        'create' : create
      }

      function create(body$) {

        var chatUi, chat$, settingUi, detail$, switchSupport, footerNavbar$;
        // creator
        var creator = APP_base.localStorage.get('creator') || ""
            + APP_base.currentTimeMillis();
        var geolocation = '0';
        // geolocation
        APP_base.geoLocation(function(d) {
          geolocation = d;
        });
        APP_base.localStorage.set('creator', creator);

        detail$ = $('<div>').css('border', 'solid red 2px');

        chatUi = createChatUi();
        settingUi = createSettingUi();
        switchSupport = APP_ui.switchSupport();
        switchSupport.put('chat', chatUi);
        switchSupport.put('detail', detail$);
        switchSupport.put('setting', settingUi);
        //
        // create page
        //
        var page$ = $('<div>', {
          'data-role' : 'page'
        });
        var header$ = $('<div>', {
          'data-role' : 'header',
          'data-position' : 'fixed'
        });
        var content$ = $('<div>', {
          'data-role' : 'content'
        });
        var footer$ = $('<div>', {
          'data-role' : 'footer',
          'data-position' : 'fixed'
        });

        page$.append(header$, content$, footer$).appendTo(body$);

        content$.append(chatUi.view(), settingUi.view(), detail$);

        //
        // NAV BAR
        //
        footerNavbar$ = $('<div>', {
          'data-role' : 'navbar'
        }).append($('<ul>').append(
        //
        chat$ = $('<li>').append($('<a>', {
          'href' : '#',
          'text' : 'chat',
          'class' : 'ui-btn-active'
        })).click(function() {
          switchSupport.show('chat');
        })
        //
        , $('<li>').append($('<a>', {
          'href' : '#',
          'text' : 'setting'
        })).click(function() {
          switchSupport.show('setting');
        })
        //

        ));
        header$.append(footerNavbar$);

        // body$.enhanceWithin();
        $("body").pagecontainer("change", page$, {
          transition : 'flip'
        });

        chat$.click();

        //
        // functions
        //

        /**
         * @memberOf NU
         */
        function createChatUi() {

          var ui, view$, form$, result$, footer$, fromUi, toUi, textareaUi, fileUi, send$, refresh$;

          view$ = $('<div>');
          form$ = $('<form>');

          result$ = $('<div>', {

          });
          //
          // idValue = 'input-' + APP_base.newId();
          // idValue2 = 'input-' + APP_base.newId();

          fromUi = APP_ui.createUi('text', {
            'label' : 'from'
          });
          fromUi.value('nouser');
          //
          toUi = APP_ui.createUi('text', {
            'label' : 'to'
          });
          toUi.value('nouser');
          //
          textareaUi = APP_ui.createUi('textarea', {
            'label' : 'message'
          });

          fileUi = APP_ui.createUi('file', {
            'name' : 'uploadFile'
          });
          view$.append(form$);
          form$.append(fromUi.views(), toUi.views()
          //
          , textareaUi.views(), fileUi.views()
          // send
          , send$ = APP_ui.button('send', function() {
            var parameters = {
              'fromCode' : fromUi.value(),
              'toCode' : toUi.value(),
              'message' : textareaUi.value(),
              'creator' : creator,
              'isPublic' : true,
              'geolocation' : geolocation
            };
            APP_base.localStorage.set('last-from', parameters.fromCode);
            APP_base.localStorage.set('last-to', parameters.toCode);
            fromUi.value(APP_base.localStorage.get('last-from'));
            APP_data.callSqForm(form$, SQ_write, parameters, buildHistory)
          }).addClass('ui-btn-b ui-btn-inline')
          //
          , refresh$ = APP_ui.button('refresh', function() {

            var parameters = {
              'fromCode' : fromUi.value(),
              'toCode' : toUi.value(),
              'creator' : creator,
              'isPublic' : true,
              'geolocation' : geolocation
            };
            APP_base.localStorage.set('last-from', parameters.fromCode);
            APP_base.localStorage.set('last-to', parameters.toCode);
            APP_data.callSq(SQ_read, parameters, buildHistory)

          }).addClass('ui-btn-c ui-btn-inline')

          //
          , result$);

          //
          ui = APP_ui.templateUi({
            'view$' : view$
          });
          ui.show = function() {
            view$.show();
            toUi.value(APP_base.localStorage.get('last-to'));
            fromUi.value(APP_base.localStorage.get('last-from'));
            refresh$.click();
          }
          return ui;

          function buildHistory(data) {
            var list = rQ.toList(data);
            var listview$;
            textareaUi.value('');
            fileUi.value('');
            result$.empty();
            listview$ = $('<ul>', {
              'data-role' : 'listview',
              'data-autodividers' : 'true',
              'data-inset' : true
            });
            result$.append(listview$);
            listview$.listview({
              'autodividersSelector' : autodividersSelector
            });
            $.each(list, function(i, e) {
              var li$ = $('<li>');
              var a$ = $('<a>', {
                'href' : '#'
              });
              var img$ = null;
              var date, divider$;
              var span$ = $('<div>', {
                'text' : e.message
              }).css({
                // 'font-weight' : 'normal',
                'word-wrap' : 'break-word',
                'white-space' : 'normal'

              });
              var location$ = $('<div>').css({
                // 'font-weight' : 'normal',
                'word-wrap' : 'break-word',
                'white-space' : 'normal',
                'font-weight' : 'normal',
                'font-size' : '0.7em'
              });
              APP_base.geoAddress(e.geolocation, function(geoAddress) {
                location$.text(geoAddress);
              });
              //
              date = APP_base.toIsoDate(e.created);
              li$.attr('name', date);

              //
              if (e.pictureSmallId > 0) {
                img$ = $('<img>', {
                  'src' : 'docu/' + e.pictureSmallId + '/small.jpg'
                });
              }

              //
              listview$.append(
              //
              li$.append(a$.append(img$, location$, span$))
              //
              );

              li$.click(function() {
                showMessageDetail(e, detail$, function() {
                  switchSupport.show('chat');
                });
                switchSupport.show('detail');
              });
            });

            listview$.listview('refresh');

            function autodividersSelector(elt) {
              var r = elt.attr('name');
              return r;
            }
          }

        }

        function createDetail(messageElement, content$, doneCb) {
          var date, message, pictureId;
          date = APP_base.toIsoDateTime(messageElement.created);
          message = messageElement.message;
          pictureId = messageElement.pictureId;

          var location$ = $('<div>').css({
            // 'font-weight' : 'normal',
            'word-wrap' : 'break-word',
            'white-space' : 'normal',
            'font-weight' : 'normal',
            'font-size' : '0.7em'
          });

          content$.empty().

          APP_base.geoAddress(messageElement.geolocation, function(geoAddress) {
            location$.text(geoAddress);
          });

          content$.append($('<div>').append($('<h4>').text(date), location$,
              (message ? $('<div>').text(message).css({
                // 'font-weight' : 'normal',
                'word-wrap' : 'break-word',
                'white-space' : 'normal'
              }) : null), (pictureId > -1) ? $('<img>', {
                'src' : 'docu/' + pictureId + '/big.jpg'
              }).css({
                'border' : 'none'
              }) : null));

          content$.append($('<div>').append(APP_ui.button('done', doneCb)));

          content$.enhanceWithin();

        }

        /**
         * @memberOf NU
         */
        function showMessageDetail(messageElement, content$, doneFn) {
          var date, message, pictureId;
          date = APP_base.toIsoDateTime(messageElement.created);
          message = messageElement.message;
          pictureId = messageElement.pictureId;

          // var maxHeight = $(window).height() - 320 + "px";
          var maxWidth = ($(window).width() - 20) + "px";
          // var h = $(window).height() - 200 + "px";
          // var w = $(window).width() - 100 + "px";

          // pop$ = $('<div>', {
          // 'data-role' : 'popup',
          // // positionTo: "window",
          // // 'data-arrow' : 'l,t',
          // 'class' : 'ui-content'
          // }).css('height', h).css('width', w);

          var view$ = $('<div>', {
            'class' : 'ui-content nu-detail-view'
          });

          var location$ = $('<div>').css({
            // 'font-weight' : 'normal',
            'word-wrap' : 'break-word',
            'white-space' : 'normal',
            'font-weight' : 'normal',
            'font-size' : '0.7em'
          });

          APP_base.geoAddress(messageElement.geolocation, function(geoAddress) {
            location$.text(geoAddress);
          });

          view$.append($('<h4>').text(date), location$, (message ? $('<div>')
              .text(message).css({
                // 'font-weight' : 'normal',
                'word-wrap' : 'break-word',
                'white-space' : 'normal'
              }) : null), (pictureId > -1) ? $('<img>', {
            'src' : 'docu/' + pictureId + '/big.jpg'
          }).css({
            'border' : 'none',
            'max-width' : maxWidth
          }) : null);

          view$.append(APP_ui.button('done', function() {
            doneFn();
          }));

          content$.empty().append(view$);
          content$.enhanceWithin();

          // pop$.popup({
          // defaults : true,
          // transition : "flip",
          // afterclose : function(event, ui) {
          // // alert('after close popup');
          // pop$.popup('destroy');
          // pop$.detach();
          // }
          // });
          // pop$.popup('open');

        }

        /**
         * @memberOf NU
         */
        function createSettingUi() {

          var w$, footer$, fromUi, toUi, textareaUi, fileUi;

          w$ = $('<div>');

          fromUi = APP_ui.createUi('text', {
            'label' : 'from'
          });
          fromUi.value('nouser');
          toUi = APP_ui.createUi('text', {
            'label' : 'to'
          });
          textareaUi = APP_ui.createUi('textarea', {
            'label' : 'message'
          });

          fileUi = APP_ui.createUi('file', {
            'name' : 'uploadFile'
          });

          w$.append(fromUi.views(), toUi.views()
          //
          , textareaUi.views(), fileUi.views()
          //
          , APP_ui.button('send', function() {
            //
          })

          );

          //

          return APP_ui.templateUi({
            'view$' : $('<div>').append(
            //
            $('<h2>', {
              'text' : 'Settings ...'
            })
            //
            , $('<div>', {
              'text' : 'sorry, this is still under construction ...'
            }))
          });

        }

      }

    })();

