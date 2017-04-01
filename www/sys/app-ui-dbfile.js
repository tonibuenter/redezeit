var APP_ui_dbfile = {

  renderDbFileLink : function(td$, row, css, version) {
    var suffix = 'mov';
    var url = 'docu/' + (version === '2' ? 'sha/' : '') + row[0] + '/' + row[2];

    var row2 = row[2] || '';
    row2 = row2.toLowerCase();
    if (row2.indexOf(suffix, row2.length - suffix.length) !== -1) {

    }
    var displayName = row[2];
    var a$ = $('<a>', {
      href : url,
      text : displayName,
      'class' : 'action-link',
      'target' : '_blank'
    }).css({
      'border' : 'none'
    });

    if (_.isObject(css)) {
      a$.css(css);
    }

    td$.append(a$);

  }

  ,

  renderDbFileLink2 : function(td$, rowIndex, colIndex, columnName, row) {

    var url = 'docu/' + row.fileId + '/' + row.filename;
    var displayName = row.filename;
    var div$ = $('<div>', {
      'text' : displayName
    }).css({
      'cursor' : 'pointer',
      'font-weight' : 'bold',
      'margin' : '2px'
    }).click(function() {
      var win = window.open(url, '_blank');
      win.focus();
    });

    td$.append(div$);

  }

  ,

  createDbFileDeleteFun : function(fileId, cb) {
    return function() {
      APP_data.callSq('HelpDocuments.delete', {
        fileId : fileId
      }, function(data) {
        cb(data);
      });

    };

  }

};