// **************
// *** APP_ui ***
// **************

var APP_ui = APP_ui || {};
var APP_ui_processinfo = APP_ui_processinfo || {};

(function() {

	var L = APP_data.getLabel;
	var D = APP_data.getDescription;
	var tmp;

	//
	// OPEN WINDOW -start-
	//

	/**
	 * @memberOf APP_ui
	 */
	function openWindow(url, name, w, h) {
		var win;
		if (!w) {
			w = 800;
		}
		if (!h) {
			h = 600;
		}
		w += 32;
		h += 96;

		win = window.open(url, name, 'width=' + w + ', height=' + h + ', '
				+ 'location=no, menubar=no, '
				+ 'status=no, toolbar=no, scrollbars=yes, resizable=no');
		if (win.resizeTo) {
			win.resizeTo(w, h);
		}

		win.focus();
	}
	APP_ui.openWindow = openWindow;

	//
	// OPEN FILE
	//

	/**
	 * @memberOf APP_ui
	 */
	function openFile(file) {
		var url = 'docu/sha/' + file.fileTid + '/' + file.filename;
		APP_ui.openWindow(url, file.filename);
	}
	APP_ui.openFile = openFile;

	//
	// OPEN DB FILE
	//

	/**
	 * @memberOf APP_ui
	 */
	function openDbFile(fileTid, fileName) {

		var win, url, name, w, h;

		url = 'docu/sha/' + fileTid + '/' + encodeURIComponent(fileName)
				+ '?sessionId=' + APP_data.sessionId();

		if (!w) {
			w = 800;
		}
		if (!h) {
			h = 600;
		}
		w += 32;
		h += 96;

		win = window.open(url, 'fileName', 'width=' + w + ', height=' + h
				+ ', ' + 'location=no, menubar=no, '
				+ 'status=no, toolbar=no, scrollbars=yes, resizable=no');
		if (win.resizeTo) {
			win.resizeTo(w, h);
		}
		win.focus();
	}
	APP_ui.openDbFile = openDbFile;

	//
	// DIV -start-
	//

	/**
	 * @memberOf APP_ui
	 */

	function createElementFun(tagName) {

		var te = '<' + tagName + '>';

		function intern(arg0, arg1) {
			var ele$ = null;
			if (_.isObject(arg0)) {
				ele$ = $(te, arg0);
			} else {
				ele$ = $(te).text(arg0);
			}

			if (_.isObject(arg1)) {
				ele$.css(arg1);
			}
			if (_.isString(arg1)) {
				ele$.addClass(arg1);
			}
			return ele$;
		}

		return intern;
	}

	APP_ui.div = createElementFun('div');

	APP_ui.i = createElementFun('i');

	APP_ui.a = createElementFun('a');

	APP_ui.span = createElementFun('span');

	APP_ui.nav = createElementFun('nav');

	APP_ui.ul = createElementFun('ul');

	APP_ui.li = createElementFun('li');

	APP_ui.ol = createElementFun('ol');

	APP_ui.img = createElementFun('img');

	APP_ui.label = createElementFun('label');

	APP_ui.input = createElementFun('input');

	APP_ui.textarea = createElementFun('textarea');

	APP_ui.h1 = createElementFun('h1');

	APP_ui.h2 = createElementFun('h2');

	APP_ui.h3 = createElementFun('h3');

	APP_ui.h4 = createElementFun('h4');

	APP_ui.h5 = createElementFun('h5');

	APP_ui.h6 = createElementFun('h6');

	APP_ui.table = createElementFun('table');

	APP_ui.tr = createElementFun('tr');

	APP_ui.td = createElementFun('td');

	APP_ui.select = createElementFun('select');

	/**
	 * @memberOf APP_ui
	 */
	function busyImage() {
		return $('<img>', {
			src : 'sys/img/ajax-loader.gif'
		}).css({
			'padding' : '4px'
		});
	}
	APP_ui.busyImage = busyImage;

	/**
	 * @memberOf APP_ui
	 */
	function registerChangeCallback(widgetType, widget, callback) {
		var cb;
		if (widgetType === 'input') {
			cb = function(e) {
				var code;
				if (e) {
					code = (e.keyCode ? e.keyCode : e.which);
				} else {
					code = 13;
				}
				if (code == 13) {
					callback(e, widget);
				}
			};
			widget.keypress(cb);
		} else if (widgetType === 'select') {
			cb = function(e) {
				callback(e, widget);
			};
			widget.change(cb);
		}
	}
	APP_ui.registerChangeCallback = registerChangeCallback;

	/**
	 * @memberOf APP_ui
	 */
	function widget(widgetType, width, changeCallback) {
		var widget, callback;
		if (widgetType === 'input') {
			widget = $('<input>').css({
				'border' : '1px gray solid',
				'height' : '14px',
				'width' : width + 'px'
			});
		} else if (widgetType === 'select') {
			widget = $('<select>');
		} else if (widgetType === 'div') {
			widget = $('<div>');
		}
		if (changeCallback) {
			APP_ui.registerChangeCallback(widgetType, widget, changeCallback);
		}
		return widget;
	}

	APP_ui.widget = widget;

	//
	// INFO BOX
	//

	/**
	 * @memberOf APP_ui
	 */
	function infoBox(message, type) {
		return $('<div>', {
			'text' : message,
			'class' : 'message-box' + (type ? ' ' + type : ' info')
		});
	}
	APP_ui.infoBox = infoBox;

	//
	// OK BOX
	//

	/**
	 * @memberOf APP_ui
	 */
	function okBox(text) {
		return APP_ui.messageBox(text, 'ok');
	}
	APP_ui.okBox = okBox;

	//
	// WARN BOX
	//

	/**
	 * @memberOf APP_ui
	 */
	function warnBox(text) {
		return APP_ui.messageBox(text, 'warn');
	}
	APP_ui.warnBox = warnBox;

	//
	// ERROR BOX
	//

	/**
	 * @memberOf APP_ui
	 */
	function errorBox(text) {
		return APP_ui.messageBox(text, 'error');
	}
	APP_ui.errorBox = errorBox;

	//
	// TAB UI -start-
	//

	/**
	 * @memberOf APP_ui
	 */
	function tabUi(settings) {

		settings = settings || {};

		var ui, view$, ul$, currentTabs, selectCb, unselectCb;

		ui = APP_ui.templateUi();
		view$ = ui.view().addClass('tab');
		ul$ = $('<ul>').appendTo(view$);

		view$.tabs();

		view$.tabs({
			'activate' : function(event, ui) {
				var id;
				var tab;
				if (unselectCb && ui.oldPanel) {
					tab = ui.oldPanel.data('tab');
					unselectCb(tab);
				}
				if (selectCb) {
					tab = ui.newPanel.data('tab');
					selectCb(tab);
				}
			}
		});

		currentTabs = [];

		ui.add = add;
		ui.tab = tab;
		ui.select = select;
		ui.unselect = unselect;
		ui.selectByName = selectByName;
		ui.remove = remove;

		return ui;

		function select(arg0) {
			if (_.isString(arg0)) {
				selectByName(arg0);
			}
			if (_.isNumber(arg0)) {
				selectByIndex(arg0);
			}
			if (_.isFunction(arg0)) {
				selectCb = arg;
			}
		}

		function selectByName(name) {
			$.each(currentTabs, function(i, tab) {
				if (name === tab.name) {
					view$.tabs({
						'active' : i
					});
				}
			});
		}

		function selectByIndex(index) {
			$.each(currentTabs, function(i, tab) {
				if (index === i) {
					view$.tabs({
						'active' : i
					});
				}
			});
		}

		function unselect(arg) {
			if (typeof (arg) === 'function') {
				unselectCb = arg;
			}
		}

		// add a tag like:<li><a href="#tabs-1">Nunc tincidunt</a></li>
		function add(arg) {
			if (typeof (arg) === 'object') {
				return tab(arg);
			}
		}

		function tab(tabDef) {
			var id, a$, li$, div$, tab;
			id = 'tab-panel-' + APP_base.newId();
			a$ = $('<a>', {
				'href' : '#' + id
			});
			li$ = $('<li>').append(a$);
			div$ = $('<div>', {
				'id' : id
			});
			tab = _.extend({
				'name' : id
			}, tabDef);
			tab.li$ = li$;
			div$.data('tab', tab);
			tab.div$ = div$;
			tab.id = id;
			a$.text(tabDef.label || tabDef.name || id);
			currentTabs.push(tab);
			ul$.append(li$);
			view$.append(div$);
			if (tabDef.tabRenderer) {
				tabDef.tabRenderer(tab);
			}
			view$.tabs('refresh');
			return div$;
		}

		function remove(arg) {
			if (typeof (arg) === 'string') {
				removeByName(arg);
			}
			if (typeof (arg) === 'number') {
				removeByIndex(arg);
			}
		}

		function removeByName(name) {
			$.each(currentTabs, function(index, tab) {
				if (name === tab.name) {
					tab.li$.remove();
					tab.div$.remove();
					currentTabs.splice(index, 1);
					// view$.tabs('refresh');
				}
			});
		}

		function removeByIndex(index) {
			var tab = currentTabs[index];
			if (tab) {
				tab.li$.remove();
				tab.div$.remove();
				currentTabs.splice(index, 1);
			}
		}

	}
	APP_ui.tabUi = tabUi;

	//
	// TAB UI -end-
	//

	/**
	 * @memberOf APP_ui
	 */
	function renderTable(data, cellRenderer, rowRenderer) {
		var table$ = $('<table>').css('border-spacing', '0px');
		var lastCellRenderer;
		$.each(data, function(rowIndex, row) {
			var tr$ = $('<tr>').appendTo(table$);
			if (rowRenderer) {
				rowRenderer(tr$, rowIndex, row);
			}
			$.each(row, function(colIndex, cell) {
				var td$ = $('<td>').appendTo(tr$);
				if (cellRenderer && cellRenderer[colIndex]) {
					lastCellRenderer = cellRenderer[colIndex];
				}
				if (lastCellRenderer) {
					lastCellRenderer(td$, rowIndex, colIndex, row);
				} else {
					td$.append(cell);
				}
			});
		});
		return table$;
	}
	APP_ui.renderTable = renderTable;

	//
	// OBJECT TABLE -start-
	//

	/**
	 * @memberOf APP_ui
	 */
	function objectTable(columnNames, objectArray, rowRenderer, cellRendererMap) {
		var table$ = $('<table>').addClass('object-table');

		cellRendererMap = cellRendererMap || {};
		$.each(objectArray, function(rowIndex, row) {
			var tr$ = $('<tr>').appendTo(table$);
			if (rowRenderer) {
				rowRenderer(tr$, rowIndex, row);
			}
			$.each(columnNames, function(colIndex, columnName) {
				var cell = row[columnName];
				var cellRenderer = null;
				var td$ = $('<td>').appendTo(tr$);
				cellRenderer = cellRendererMap[columnName];
				if (_.isFunction(cellRenderer)) {
					cellRenderer(td$, rowIndex, colIndex, columnName, row);
				} else {
					td$.append(cell);
				}
			});
		});
		return table$;
	}
	APP_ui.objectTable = objectTable;

	//
	// FIELDS PANEL -start-
	//

	/**
	 * @memberOf APP_ui
	 */
	function fieldsPanel(headers, data) {

		var table$ = $('<div>', {
			'class' : 'app-ui-fields-panel'
		});
		var tr$;
		//
		// tbody
		//
		$.each(data, function(index, row) {
			tr$ = $('<div>').appendTo(table$);
			tr$.append($('<div>', {
				'text' : headers[index] || '',
				'class' : 'label'
			}),
			//
			$('<div>').addClass('control').append(row));
		});
		return table$;
	}

	APP_ui.fieldsPanel = fieldsPanel;

	//
	// INPUT UI -start-
	//

	/**
	 * @memberOf APP_ui
	 */
	function inputUi(uiDef) {

		var inputUi = {};
		var actionFun;
		var view$;
		var _type, css;
		var changeFun;
		var isNumeric = false;

		uiDef = uiDef || {};

		_type = uiDef.type || uiDef.uiType || 'text';

		if (_type === 'numeric') {
			isNumeric = true;
		}

		// crud fix
		if (_type === 'string' || _type === 'numeric' || _type === 'input') {
			_type = 'text';
		}

		css = _.extend({}, _.pick(uiDef, 'width', 'height'));

		view$ = $('<input>', {
			'type' : _type,
			'value' : uiDef.value || ''
		}).css(css);

		if (isNumeric) {
			view$.keyup(function() {
				if (this.value != this.value.replace(/[^0-9\.\-]/g, '')) {
					this.value = this.value.replace(/[^0-9\.\-]/g, '');
				}
			});
		}

		if (uiDef.css) {
			view$.css(uiDef.css);
		}

		function view() {
			return view$;
		}

		function value(value) {
			return APP_ui.handleVal(view$, value);
		}

		function editable(bool) {
			return APP_ui.handleDisabledAttr(view$, bool);
		}

		function action(callback) {
			view$.keypress(function(e) {
				var code;
				if (e) {
					code = (e.keyCode ? e.keyCode : e.which);
				} else {
					code = 13;
				}
				if (code == 13) {
					callback(e, inputUi);
				}
			});
		}

		function change(arg0) {
			if (_.isFunction(arg0)) {
				changeFun = arg0;
			} else {
				if (_.isFunction(changeFun)) {
					changeFun.apply(this, arguments);
				}
			}
		}

		inputUi = {
			'view' : view,
			'value' : value,
			'getValue' : value,
			'setValue' : value,

			setChangeFun : function(callback) {
				view$.change(callback);
			},
			'editable' : editable
		};

		inputUi.editable(uiDef.editable);

		inputUi.setActionFun = action;
		inputUi.action = action;
		// ' modern api '
		inputUi.editable = editable;
		inputUi.change = change;

		if (_.isFunction(uiDef)) {
			action(uiDef);
		}
		return inputUi;
	}
	APP_ui.inputUi = inputUi;

	//
	// TEXTAREA UI -start-
	//

	/**
	 * @memberOf APP_ui
	 */
	function textareaUi(uidef) {
		var view$ = $('<textarea>');
		var ui = APP_ui.templateUi({
			'view$' : view$
		});

		if (uidef.height) {
			view$.css('height', uidef.height);
		}
		if (uidef.width) {
			view$.css('width', uidef.width);
		}
		ui.editable = editable;

		editable(uidef.editable);

		return ui;

		function editable(bool) {
			return APP_ui.handleDisabledAttr(view$, bool);
		}
	}

	APP_ui.textareaUi = textareaUi;

	//
	// TEXT VIEW UI
	//

	/**
	 * @memberOf APP_ui
	 */
	function textviewUi(settings) {

		var view$ = $('<div>').addClass('app-ui-text-view');

		if (typeof settings === 'string') {
			value(settings);
		}

		return {
			'view' : view,
			'value' : value,
			'hide' : hide,
			'show' : show
		};

		function view() {
			return view$;
		}
		function value(arg0) {
			if (arg0 === undefined) {
				return view$.text();
			}
			return view$.text(arg0);
		}
		function show() {
			return view$.show();
		}
		function hide() {
			return view$.hide();
		}

	}
	APP_ui.textviewUi = textviewUi;

	//
	// FILE INPUT UI
	//

	// styling info
	// -> http://1stwebmagazine.com/styling-input-file-with-jquery-and-css

	/**
	 * @memberOf APP_ui
	 */
	function fileInputUi(settings) {
		settings = settings || {};
		var view$;
		view$ = $('<input>', {
			'type' : 'file',
			'name' : (settings.name || 'upload-file-' + APP_base.newId())
		});

		if (settings.accept) {
			view$.attr('accept', settings.accept);
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
	// SELECT UI 2 -begin-
	//

	/**
	 * @memberOf APP_ui
	 */
	function selectUi2(settings, cx) {

		settings = settings || {};

		var ui, select$;

		var editable = settings.editable !== false;
		var valueName = settings.valueName || 'value';
		var labelName = settings.labelName || 'label';
		var withEmpty = settings.withEmpty === true ? true : false;

		var values = [];
		var labels = [];
		var currentValue;

		ui = APP_ui.templateUi();

		ui.view().addClass('select-ui-2 editable-' + editable);
		if (editable) {
			ui.view().append(select$ = APP_ui.select());
		} else {
			select$ = ui.view();
		}
		ui.change = change;
		ui.value = value;
		ui.update = update;
		ui.list = list;

		update(settings);
		change(function(value) {
			currentValue = value;
		})

		return ui;

		function update(arg0) {
			if (_.isObject(arg0)) {
				if (_.isFunction(arg0.list)) {
					arg0.list(function(list) {
						fill(list);
					});
				} else if (_.isArray(arg0.list)) {
					fill(arg0.list);
				} else if (_.isString(arg0.serviceId)) {
					rQ.call(arg0.serviceId, arg0.parameters || {}, function(
							data) {
						fill(rQ.toList(data));
					});
				}
			}
		}

		function fill(list) {
			values = [];
			labels = {};

			if (withEmpty) {
				values.push('');
				labels[''] = '...';
			}
			$.each(list, function(i, item) {
				var key, label;
				if (_.isString(item)) {
					key = item;
					label = item;
				} else {
					key = item[valueName];
					label = item[labelName];
					label = _.isUndefined(label) ? key : label;
				}
				values.push(key);
				labels[key] = label;
			});
			currentValue = currentValue || values[0];
			render();
		}

		function value(arg0) {
			if (!_.isUndefined(arg0)) {
				currentValue = arg0;
				if (_.isString(arg0)) {
					currentValue = arg0;
				}
				if (_.isNumber(arg0)) {
					currentValue = values[arg0];
				}
				render();
				if (_.isFunction(select$.selectmenu)) {
					select$.selectmenu('refresh');
				}
			}
			return currentValue || values[0];
		}

		function render() {
			var t;
			if (editable) {
				select$.empty();
				_.each(values, function(v, i) {
					select$.append(t = $('<option>', {
						'value' : v,
						'text' : labels[v] || v
					}).attr('value', v));
					t.prop('selected', v === currentValue);
				});
			} else {
				select$.text(labels[currentValue] || currentValue);
			}
		}

		function change(callback) {
			select$.change(function() {
				var e = select$.val();
				callback(e);
			});
		}

		function list() {
			var l = [];
			_.each(values, function(v, i) {
				var m = {};
				m[valueName] = v;
				m[labelName] = labels[v] || 'nolabel';
				l.push(m);
			});
			return l;
		}

	}
	APP_ui.selectUi2 = selectUi2;

	//
	// codeTableSelectUi
	//

	function codeTableSelectUi(settings) {
		var settings2 = _.extend({}, settings, {
			'valueName' : 'name',
			'labelName' : 'label',
			'list' : APP_data.codeTable(settings.codeTable)
		});

		settings2.list = APP_data.codeTable(settings.codeTable);
		return APP_ui.selectUi2(settings2);
	}

	APP_ui.codeTableSelectUi = codeTableSelectUi;

	/**
	 * @memberOf APP_ui
	 */

	function selectUi(arg0, arg1, arg2) {

		var ui, view$, select$, filterInput$ = null, withEmpty = false, options = [], settings = {};

		ui = APP_ui.templateUi();
		view$ = ui.view().addClass('select-ui');

		if (_.isArray(arg0)) {
			withEmpty = false;
			options = arg0;
		} else if (_.isObject(arg0)) {
			settings = arg0;
			withEmpty = arg1 || settings.withEmpty || withEmpty;
		} else if (_.isBoolean(arg0)) {
			withEmpty = arg0;
			options = arg1;
		}
		if (_.isBoolean(arg1)) {
			withEmpty = arg1;
		}

		select$ = $('<select>', {});

		if (select$.selectmenu) {
			select$.selectmenu();
		}

		//
		// filter
		//
		if (settings.filter) {
			filterInput$ = APP_ui.input(function(k) {
				var fv = filterInput$.val();
				if (!_.isString(fv)) {
					return;
				}
				// if (fv.length < 3) {
				// return;
				// }
				removeAll();

				$.each(options, function(i, row) {
					var value = row[0];
					var text = row[1];
					if (text.indexOf(fv) > -1) {
						addOption(value, text, true);
					} else {
						//
					}
				});
			});
			view$.append(select$, filterInput$);
			filterInput$.attr('placeholder', 'filter');
		} else {
			view$.append(select$);
		}

		ui.clearSelection = clearSelection;
		ui.setSelectedIndex = setSelectedIndex;
		ui.setSelectedValue = setSelectedValue;
		ui.getSelectedValue = getSelectedValue;
		ui.getValue = getSelectedValue;
		ui.value = value;
		ui.fireChange = fireChange;
		ui.removeAll = removeAll;

		ui.change = change;
		ui.setOptions = setOptions;
		ui.options = setOptions;
		ui.editable = editable;
		ui.addOption = addOption;

		return ui;

		function clearSelection() {
			select$.find('option').prop('selected', false);
			select$.change();
		}

		function setSelectedIndex(index) {
			select$.find('option').prop('selected', false);
			var option$ = $(select$.find('option')[index]);
			option$.prop('selected', true);
			select$.change();
		}

		function setSelectedValue() {
			var done = false;
			var value;
			select$.find('option').prop('selected', false);
			$.each(arguments, function(index, arg) {
				var option$;
				if (done || _.isUndefined(arg)) {
					return;
				}
				option$ = select$.find('option[value="' + arg + '"]');
				if (option$.size() === 0) {
					return null;
				}
				option$.prop('selected', true);
				value = arg;
				done = true;
			});
			if (done) {
				select$.change();
				return value;
			}
		}

		function getSelectedValue() {
			var value = select$.find('option:selected').val();
			return value;
		}

		function fireChange() {
			select$.change();
		}

		function change(callback) {
			select$.change(function() {
				var c = select$.val();
				callback(c);
			});
		}

		function removeAll() {
			select$.empty();
		}

		function value(arg0) {
			if (!_.isUndefined(arg0)) {
				ui.setSelectedValue(arg0);
			}
			return ui.getSelectedValue();
		}

		function addOption(value, text, filterMode) {
			options = options || [];
			if (!filterMode) {
				options.push([ value, text ]);
			}

			select$.append($('<option>', {
				'text' : text,
				'value' : value
			}));
		}

		function setOptions(arg0) {
			options = [];
			select$.empty();
			if (withEmpty) {
				addOption('', '...');
			}
			if (_.isArray(arg0)) {
				$.each(arg0, function(i, row) {
					var value = row[0] || '-na-';
					var text = row[1] || value;
					addOption(value, text);
				});
			} else {
				alert('Options has to be an array like [[value, text] ...]. Please refactor!');
			}

		}

		function editable(bool) {
			return APP_ui.handleDisabledAttr(select$, bool);
		}
	}
	APP_ui.selectUi = selectUi;

	//
	// BUTTON
	//

	function button(label, callback, tooltip) {
		var a$ = $('<a>', {
			'text' : label,
			'title' : tooltip || ''
		}).click(callback);
		if (_.isFunction(a$.button)) {
			a$.button();
			a$.text = function(t) {
				a$.button({
					label : t
				});
			};
		} else {
			a$.addClass('app-ui-button');
		}
		a$.css('display', 'inline-block');
		return a$;
	}
	APP_ui.button = button;

	//
	// BUTTON 2
	//

	function button2(label, callback, tooltip) {
		var div$ = $('<div>').addClass('button-2');
		var icon$ = $('<span>').addClass('button-2-icon');
		var text$ = $('<span>').addClass('button-2-text');

		text$.text(label);

		div$.append(icon$, text$);

		div$.attr('title', tooltip || '');

		if (_.isFunction(callback)) {
			div$.click(callback);
		}
		div$.css('display', 'inline-block');

		return div$;
	}
	APP_ui.button2 = button2;

	//
	// LINK 2
	//

	/**
	 * @memberOf APP_ui
	 */
	function link(label, callback) {

		var a$ = $('<a>', {
			'href' : '#'
		});
		if (callback) {
			a$.click(callback);
		}
		a$.addClass('app-ui-link').text(label);
		return a$;
	}
	APP_ui.link = link;

	//
	// INPUT
	//

	/**
	 * @memberOf APP_ui
	 */
	function input(actionCb) {
		var i$ = $('<input>');
		if (_.isFunction(actionCb)) {
			i$.keypress(function(e) {
				var code;
				if (e) {
					code = e.keyCode || e.which;
				} else {
					code = 13;
				}
				if (code == 13) {
					actionCb(e);
				}
			});
		}
		return i$;
	}
	APP_ui.input = input;

	//
	// DIALOG UI
	//
	/**
	 * @memberOf APP_ui
	 */
	function dialogUi(uiDef) {
		var ui = APP_ui.templateUi();
		var dialog$ = ui.view().appendTo($('body'));
		var subPanel$;

		uiDef = uiDef || {};

		if (_.isFunction(dialog$.dialog)) {
			dialog$.dialog({
				autoOpen : false,
				width : uiDef.width || 'auto',
				height : uiDef.height || 'auto',
				modal : uiDef.modal || false,
				title : uiDef.title || ''
			});
		}

		subPanel$ = $('<div>').appendTo(dialog$);

		ui.set = function(panel$) {
			subPanel$.empty();
			subPanel$.append(panel$);
		};
		ui.title = function(title) {
			dialog$.dialog('option', 'title', title);
		};
		ui.close = function(button$, title) {
			dialog$.dialog('close');
		};
		ui.show = function(button$, title) {
			dialog$.dialog('open');
		};
		return ui;

	}
	APP_ui.dialogUi = dialogUi;

	//
	// DATE TIME PICKER UI
	//
	// http://trentrichardson.com/examples/timepicker
	/**
	 * @memberOf APP_ui
	 */
	function dateTimePickerUi(settings) {

		var input$ = $('<input>').attr('type', 'text');
		var ui = APP_ui.templateUi({
			'view$' : input$
		});
		if (_.isFunction(input$.datetimepicker)) {
			input$.datetimepicker({
				timeFormat : 'hh:mm',
				dateFormat : 'yy-M-dd'
			});
			ui.value = value;
		}

		function value(milliseconds) {
			var d;
			if (_.isString(milliseconds)) {
				milliseconds = parseInt(milliseconds);
			}
			if (_.isNumber(milliseconds)) {
				input$.datetimepicker('setDate', new Date(milliseconds));
			}
			d = input$.datetimepicker('getDate');
			return d.getTime();
		}

		return ui;
	}
	APP_ui.dateTimePickerUi = dateTimePickerUi;

	//
	// CALENDAR UI
	//

	/**
	 * @memberOf APP_ui
	 */
	function calendarUi(settings) {
		settings = settings || {};
		var calendar$ = $('<input>', {
			type : 'text'
		});
		ui = APP_ui.templateUi({
			'view$' : calendar$
		});

		calendar$.datepicker({
			showWeek : true,
			firstDay : 1,
			dateFormat : 'yy-mm-dd'
		});

		if (settings.editable === false || settings.editable === 'false') {
			editable(settings.editable);
		}

		ui.editable = editable;
		ui.value = value;
		ui.type = 'calendarUi';

		return ui;

		function editable(bool) {
			return APP_ui.handleDisabledAttr(calendar$, bool);
		}

		function value(isodate) {
			if (isodate || isodate === '') {
				calendar$.val(isodate);
			}
			return calendar$.val();
		}

	}
	APP_ui.calendarUi = calendarUi;

	//
	// SIMPLE TABLE UI
	//
	/**
	 * @memberOf APP_ui
	 */
	function simpleTableUi(headers, data) {
		var ui, table$, thead$, tbody$, tr$, tdClasses;

		table$ = $('<table>', {
			'class' : 'ui-widget ui-widget-content'
		});
		ui = APP_ui.templateUi({
			'view$' : table$
		});
		thead$ = $('<thead>');
		tbody$ = $('<tbody>');

		if (headers != undefined && headers != null) {
			table$.append(thead$);
			tr$ = $('<tr>', {
				'class' : 'ui-widget-header'
			}).appendTo(thead$);
			$.each(headers, function(index, header) {
				tr$.append($('<th>', {
					'text' : header
				}));
			});
		}
		//
		// tbody
		//
		table$.append(tbody$);
		//
		if (data) {
			$.each(data, function(index, row) {
				tr$ = $('<tr>').appendTo(tbody$);
				$.each(row, function(index, element) {
					_addRow(i, tr$, element);
				});
			});
		}

		ui.add = add;
		ui.removeAll = removeAll;
		ui.addClasses = addClasses;

		return ui;

		function view() {
			return table$;
		}

		function add() {
			var tr$ = $('<tr>').appendTo(tbody$);
			var list = arguments;
			if (list.length > 0 && _.isArray(list[0])) {
				list = list[0];
			}
			$.each(list, function(i, element) {
				_addRow(i, tr$, element);
			});
			return tr$;
		}

		function _addRow(i, tr$, element) {
			var td$ = $('<td>');
			if (tdClasses && tdClasses[i]) {
				td$.addClass(tdClasses[i]);
			}
			tr$.append(td$);
			if (typeof (element) === 'object') {
				td$.append(element);
			} else {
				td$.text(element);
			}
		}

		function addClasses(classes) {
			tdClasses = classes;
		}

		function removeAll() {
			tbody$.empty();
		}
	}
	APP_ui.simpleTableUi = simpleTableUi;

	//
	// RQ SELECT UI
	//

	/**
	 * @memberOf APP_ui
	 */
	function rqSelectUi(sidOrRequest, optionFn, selectedOption, uiDef) {
		var ui = APP_ui.selectUi(uiDef, true);
		var ivalue = ui.value;
		var objectMap = {};

		ui.value = value;
		ui.update = update;
		ui.object = function(id) {
			return objectMap[id];
		};
		update();
		return ui;

		function value(arg0) {
			if (arg0) {
				selectedOption = arg0;
			}
			return ivalue.apply(ui, arguments);
		}

		function update() {
			if (arguments.length > 0) {
				sidOrRequest = arguments[0];
				optionFn = arguments[1];
				selectedOption = arguments[2];
			}
			doUpdate();
		}

		function doUpdate() {
			rQ.call(sidOrRequest, function(pr) {
				var options = [];
				var list = rQ.toList(pr);
				objectMap = {};
				$.each(pr.table, function(i, row) {
					var optionArg;
					if (typeof (optionFn) === 'function') {
						optionArg = optionFn(row);
					} else {
						if (row.length === 1) {
							optionArg = [ row[0], row[0] ];
						} else {
							optionArg = [ row[0], row[0] + ', ' + row[1] ];
						}
					}
					objectMap[row[0]] = list[i];
					options.push(optionArg);
				});
				ui.setOptions(options);
				ui.value(selectedOption);
			});
		}

	}

	APP_ui.rqSelectUi = rqSelectUi;

	//
	// RESULT UI
	//

	/**
	 * @memberOf APP_ui
	 */
	function resultUi(settings) {
		settings = settings || {};
		var ui = APP_ui.templateUi();
		var view$ = ui.view().addClass('result-ui');

		ui.data = data;
		ui.value = value;
		return ui;

		function data(sd) {
			var processLog, diff, lastTime, lines;
			var gs = APP_ui.gridSupport();
			var t$ = gs.table().appendTo(
					gs.div().addClass('table').appendTo(view$.empty()));
			var r$ = gs.row().addClass('result-header').appendTo(t$);
			//
			// table
			//
			if (!settings.onlyProcessLog) {
				if (sd.header && sd.table) {
					$.each(sd.header, function(i, head) {
						r$.append(gs.cell().text(head).addClass(
								'col-' + (i % 2)));
					});
					$.each(sd.table, function(rowIndex, row) {
						r$ = gs.row().appendTo(t$).addClass('result-row');
						$.each(row, function(i, e) {
							r$.append(gs.cell().text(e).addClass(
									'col-' + (i % 2)).addClass(
									'row-' + (rowIndex % 2)));
						});
					});
				}
			}
			//
			// processLog
			//
			processLog = sd.processLog;
			if (_.isObject(processLog)) {

				t$ = gs.table().appendTo(
						gs.div().addClass('process-log').appendTo(view$));
				r$ = gs.row().addClass('process-log-header').appendTo(t$);
				$.each([ 'message', 'code', 'time' ], function(i, head) {
					r$.append(gs.cell().text(head));
				});

				lines = processLog.lines || processLog.processLines;
				if (lines) {
					$.each(lines, function(i, line) {
						var message, ui;
						r$ = gs.row().addClass('process-log-line').addClass(
								line.state).appendTo(t$);
						// message
						// :
						// "Request time used (ms):17 [time gap : 0s]"
						// code
						// :
						// 4000
						// state
						// :
						// "System"
						// time
						// :
						// 1458066095128
						message = checkResult(line.message);
						if (_.isObject(message)) {
							ui = APP_ui.resultUi();
							ui.data(message);
							r$.append(gs.cell().append(ui.view()));
						} else {
							r$.append(gs.cell().text(line.message || line.msg)
									.addClass('message'));
						}
						r$.append(gs.cell().text(line.code).addClass('code'));
						if (_.isNumber(lastTime)) {
							r$.append(gs.cell()
									.text(
											(lastTime - (+line.time)) + ':'
													+ line.time).addClass(
											'time'));
						} else {
							r$.append(gs.cell().text(
									APP_base.unixTimeToIso(line.time))
									.addClass('time'));
						}
						lastTime = +line.time;
					});

				}
			} else {
				view$.append(gs.div().text('No process log')
						.addClass('message'));
			}
		}

		function value() {
		}

		function checkResult(str) {
			var json;
			try {
				json = JSON.parse(str);
				if (_.isObject(json)
						&& (_.isArray(json.table) || json.processLog)) {
					return json;
				}
			} catch (e) {
				// nothing to report, just not a json
			}
			return str;
		}
	}

	APP_ui.resultUi = resultUi;

	//
	// BUTTON UI -start-
	//

	/**
	 * @memberOf APP_ui
	 */
	function buttonUi(settings, callback) {
		settings = settings || {};
		var button$ = $('<a>').attr('href', '#');
		var ui = APP_ui.templateUi({
			'view$' : button$
		});

		var label = _.isString(settings) ? settings : (settings.text
				|| settings.label || '-no button label-');

		button$.text(label);

		_callback = callback || settings.click || settings.onClick;

		// jqueryui
		if (settings.buttonType != 'link' && _.isFunction(button$.button)) {
			button$.button();
		}
		if (settings.buttonType == 'link') {
			button$.addClass('app-ui-link');
		}

		if (_.isFunction(callback)) {
			action(callback);
		}

		button$.css('display', 'inline-block');

		ui.action = action;
		ui.enable = enable;
		ui.disable = disable;
		return ui;

		function action(arg0) {
			if (_.isFunction(arg0)) {
				button$.click(function(e) {

					arg0.apply(this, arguments);
					e.stopPropagation();
					e.preventDefault();

				});

			} else {
				button$.click();
			}
		}

		function enable(arg0) {
			if (arg0 === undefined) {
				button$.button('option', 'disabled', false);
			} else {
				button$.button('option', 'disabled', arg0 === false);
			}
		}

		function disable() {
			button$.button('option', 'disabled', true);
		}

	}
	APP_ui.buttonUi = buttonUi;

	//
	// BUTTON UI -end-
	//

	/**
	 * @param defaultActionFn
	 *            deprecated
	 */
	function widgetUi(uiDef, defaultActionFn) {
		// ui type with default 'input'
		var uiType = uiDef.uiType || uiDef.type || 'input';
		var ui;
		var _data = {};
		if ('select' === uiType) {
			if (_.isString(uiDef.serviceId)) {
				// rqSelectUi(sidOrRequest, optionFn, selectedOption)
				ui = APP_ui.rqSelectUi(uiDef.serviceId, {}, uiDef.value, uiDef);
			} else {
				ui = APP_ui.selectUi(uiDef);
			}
		} else if ('button' === uiType) {
			ui = APP_ui.buttonUi(uiDef);
		} else if ('dialog' === uiType) {
			ui = APP_ui.dialogUi(uiDef);
		} else if ('date' === uiType) {
			ui = APP_ui.calendarUi(uiDef);
		} else if ('fileInput' === uiType) {
			ui = APP_ui.fileInputUi(settings);
		} else if ('textarea' === uiType) {
			ui = APP_ui.textareaUi(uiDef);
		} else if ('input' === uiType || 'string' === uiType
				|| 'numeric' === uiType || 'input' === uiType) {
			ui = APP_ui.inputUi(uiDef);
		} else {
			try {
				t = eval(uiType);
			} catch (e) {
				t = null;
			}
			if (_.isFunction(t)) {
				ui = t.apply(this, arguments);
			} else {
				ui = APP_ui.inputUi(uiDef);
			}
		}
		if (_.isFunction(defaultActionFn) && _.isFunction(ui.setActionFun)) {
			ui.setActionFun(defaultActionFn);
		}

		//
		// name attribute
		//
		if (_.isUndefined(ui.name)) {
			ui.name = uiDef.name || ui.name || undefined;
		}
		if (_.isUndefined(ui.data)) {
			ui.data = dataFn;
		}

		ui.data(uiDef.data);

		return ui;

		function dataFn(arg0) {
			if (!_.isUndefined(arg0)) {
				_data = arg0;
			}
			return _data;
		}

	}
	APP_ui.widgetUi = widgetUi;

	//
	// Parameter Ui
	//

	function parameterUi(parameterUiDef) {
		var view$, table$, uiMap = {};

		view$ = $('<div>').addClass('parameterUi');
		table$ = $('<table>').appendTo(view$);
		$.each(parameterUiDef,
				function(i, uiDef) {
					var name, value, label;
					name = uiDef.name;
					value = uiDef.value;
					label = uiDef.label || name;
					div$ = $('<div>').addClass('field').addClass(
							'field-' + name);
					// ui
					if (!_.isObject(uiDef.ui)) {
						uiDef.ui = APP_ui.widgetUi(uiDef);
					}
					// value
					if (value) {
						uiDef.ui.value(value);
					}
					// editable
					if (_.isBoolean(uiDef.editable)
							&& _.isFunction(uiDef.ui.editable)) {
						uiDef.ui.editable(uiDef.editable);
					}
					table$.append($('<tr>').append($('<td>').text(label),
							$('<td>').append(uiDef.ui.view())));

					uiMap[name] = uiDef.ui;
				});

		return {
			'view' : view,
			'value' : value,
			'ui' : getUi
		};

		function view() {
			return view$;
		}

		function value(valueIn) {
			var res = {};
			if (typeof valueIn === 'object') {
				$.each(parameterUiDef, function(i, uiDef) {
					var name, value;
					name = uiDef.name;
					value = valueIn[name];
					uiDef.ui.value(value);
				});
			}
			$.each(parameterUiDef, function(i, uiDef) {
				var name, value;
				name = uiDef.name;
				value = uiDef.ui.value();
				res[name] = value;
			});
			return res;
		}

		function getUi(arg0, arg1) {
			// if (_.isString(arg0) && _.isObject(arg1)) {
			// uiDef[arg0] = arg1;
			// }
			if (_.isString(arg0)) {
				return uiMap[arg0];
			}
		}
	}
	APP_ui.parameterUi = parameterUi;

	/**
	 * 
	 * @memberOf APP_ui
	 */
	function icon(arg0) {
		return $('<i>').addClass('fa fa-' + arg0);
	}
	APP_ui.icon = icon;

	/**
	 * 
	 * @param img$
	 * @param cb
	 *            is called with the width and height of the image
	 */
	function imageSize(img$, cb) {
		// thanks to http://stackoverflow.com/questions/318630
		$('<img>') // Make in memory copy of image to avoid css issues
		.attr("src", img$.attr("src")).load(function() {
			var w = this.width; // Note: $(this).width() will not
			var h = this.height; // work for in memory images.
			cb(w, h);
		});
	}
	APP_ui.imageSize = imageSize;

	//
	// ACCORDION UI
	//

	function accordionUi(settings) {
		settings = settings || {};
		var view$;
		var entries = [];
		var selectSingle = settings.selectSingle;
		view$ = $('<div>').addClass('accordion');

		// view$.accordion({
		// 'heightStyle' : 'content'
		// });

		function view() {
			return view$;
		}
		function select(arg) {
			if (typeof arg === 'number') {
				entries[arg].body.toggleClass('selected');
			}
		}

		function add(title, content, showCb, hideCb) {
			var head$, body$, i;
			head$ = $('<div>').addClass('head').addClass('ui-widget-header')
					.text(title);
			body$ = $('<div>').addClass('body').append(content);
			head$.click(function() {
				body$.toggleClass('selected');
				if (_.isFunction(showCb)) {
					showCb();
				}
				if (selectSingle) {
					for (i = 0; i < entries.length; i++) {
						if (entries[i].body !== body$) {
							entries[i].body.removeClass('selected');
						}
					}
				}
			});
			view$.append(head$, body$);
			// view$.accordion('refresh');
			entries.push({
				'head' : head$,
				'body' : body$,
				'title' : title,
				'show' : showCb,
				'hide' : hideCb
			});
		}

		return {
			'view' : view,
			'add' : add,
			'select' : select
		};
	}
	APP_ui.accordionUi = accordionUi;

	/**
	 * @memberOf APP_ui
	 * 
	 */
	function wrapAsUi(obj) {

		if (obj instanceof jQuery) {
			return {
				'view' : function() {
					return obj;
				},
				'show' : function() {
					return obj.show.apply(obj, arguments);
				},
				'hide' : function() {
					return obj.hide.apply(obj, arguments);
				},
				'value' : function() {
					return obj.val.apply(obj, arguments);
				}
			};
		} else {
			if (_.isUndefined(obj.view)) {
				obj.view = empty;
			}
			if (_.isUndefined(obj.show)) {
				obj.show = empty;
			}
			if (_.isUndefined(obj.hide)) {
				obj.hide = empty;
			}
			if (_.isUndefined(obj.value)) {
				obj.value = empty;
			}
			if (_.isUndefined(obj.remove)) {
				obj.remove = empty;
			}

		}

		return obj;

		function empty() {
		}

	}
	APP_ui.wrapAsUi = wrapAsUi;

	/**
	 * @memberOf APP_ui
	 * 
	 */

	function handleDisabledAttr(view$, editable) {
		if (editable === false || editable === 'false') {
			view$.prop('disabled', true);
		} else if (editable === true || editable === 'true') {
			view$.prop('disabled', false);
		}
		return !view$.prop('disabled');
	}
	APP_ui.handleDisabledAttr = handleDisabledAttr;

	/**
	 * @memberOf APP_ui
	 * 
	 */
	function handleVal(view$, value) {
		if (!(value === undefined)) {
			view$.val(value);
		}
		return view$.val();
	}
	APP_ui.handleVal = handleVal;

	//
	// TEMPLATE UI -start-
	//

	/**
	 * @memberOf APP_ui
	 */
	function templateUi(settings) {
		settings = settings || {};
		var ui;
		var view$ = $('<div>');
		var views = [ view$ ];
		var name, id;
		var selectCb;
		var doneFn;
		var labelHolder;
		var cx;

		name = settings.name;
		// view$ provided ...
		if (_.isObject(settings.view$)) {
			view$ = settings.view$;
			views = [ view$ ];
		}
		if (_.isArray(settings.views) && settings.views.length > 0) {
			views = settings.views;
			view$ = views[0];
		}
		ui = {
			'id' : function(arg0) {
				if (_.isUndefined(arg0)) {
					return id;
				}
				id = arg0;
				if (_.isObject(view$) && _.isFunction(view$.attr)) {
					view$.attr('id', id);
				}
				return this;
			},
			'view' : function(arg0) {
				if (_.isObject(arg0)) {
					view$ = arg0;
					views = [];
				}
				return view$;
			},
			'views' : function(arg0) {
				if (_.isArray(arg0)) {
					views = arg0;
				}
				return views;
			},
			'hide' : function() {
				view$.hide.apply(view$, arguments);
				$.each(views, function(i, v$) {
					// v$.hide.apply(v$, arguments);
					if (_.isFunction(v$.hide)) {
						v$.hide();
					}
				});
			},
			'show' : function() {
				view$.show.apply(view$, arguments);
				$.each(views, function(i, v$) {
					// v$.show.apply(v$, arguments);
					if (_.isFunction(v$.show)) {
						v$.show();
					}
				});
			},
			'name' : function(arg) {
				if (_.isString(arg)) {
					name = arg;
				}
				return name;
			},
			'value' : function(arg) {
				if (_.isFunction(view$.val)) {
					if (!_.isUndefined(arg)) {
						view$.val(arg);
					} else {
						return view$.val();
					}
				}
			},
			'destroy' : function() {
				view$.remove();
				view$ = undefined;
				$.each(views, function(i, v$) {
					v$.remove();
				});
				views = undefined;
			},
			'disable' : function(arg0) {
				if (_.isBoolean(arg0)) {
					view$.prop('disabled', arg0);
				}
				return view$.prop('disabled');
			},
			'select' : function(arg0) {
				if (_.isFunction(arg0)) {
					selectFn = arg0;
				} else if (_.isFunction(selectFn)) {
					selectFn.apply(this, arguments);
				}
			},
			'done' : function(arg0) {
				if (_.isFunction(arg0)) {
					doneFn = arg0;
				} else {
					if (_.isFunction(doneFn)) {
						doneFn.apply(this, arguments);
					}
				}
			},
			'label' : function(arg0) {
				if (_.isString(arg0)) {
					labelHolder = arg0;
				}
				return labelHolder;
			},
			'data' : function(arg0) {
			},
			'action' : function(arg0) {
			},
			'size' : function(arg0) {
				return views.length;
			},
			'context' : function(arg0) {
				if (_.isUndefined(arg0)) {
					cx = arg0;
				}
				return cx;
			}
		};
		ui.remove = ui.destroy;
		return ui;

	}
	APP_ui.templateUi = templateUi;

	//
	// IS TEMPLATE UI
	//

	/**
	 * @memberOf APP_ui
	 */
	function isTemplateUi(arg0) {
		return _.isObject(arg0) && _.isFunction(arg0.view)
				&& _.isFunction(arg0.value) && _.isFunction(arg0.data)
				&& _.isFunction(arg0.destroy);
	}

	APP_ui.isTemplateUi = isTemplateUi;

	/**
	 * @memberOf APP_ui
	 */
	function switchUi() {
		var ui = APP_ui.templateUi();
		var view$ = ui.view();
		var sw = APP_ui.switchSupport();

		function put(name, v$) {
			view$.append(v$);
			sw.put(name, v$);
			return ui;
		}

		function show(name) {
			if (_.isString(name)) {
				ui.view().show();
				sw.show(name);
			}
		}
		ui.show = show;
		ui.put = put;
		return ui;
	} // end switchUi
	APP_ui.switchUi = switchUi;

	/**
	 * @memberOf APP_ui
	 */
	function switchSupport() {

		var vpanels = {}, previous = null, current = null;

		return {
			'put' : function(name, p$) {
				var vpanel, names, i;
				if (_.isUndefined(name)) {
					return p$;
				}
				names = _.isArray(name) ? name : [ name ];
				for (i = 0; i < names.length; i++) {
					name = names[i];
					vpanel = vpanels[name];
					if (vpanel === undefined) {
						vpanel = [];
						vpanels[name] = vpanel;
					}
					vpanel.push(p$);
				}
				return p$;
			},
			'show' : function(name) {
				applyAll('hide');
				applyFun(name, 'show');
				previous = current;
				current = name;
			},
			'showOnly' : function(name) {
				applyAll('hide');
				applyFun(name, 'show');
				previous = current;
				current = name;
			},
			'showAll' : function() {
				applyAll('show');
			},
			'applyAll' : applyAll,
			'apply' : function(name, methodName) {
				applyFun(name, methodName);
			},
			'showPrevious' : function() {
				this.show(previous);
			},
			'current' : function() {
				return current;
			},
			'remove' : function(name) {
				if (vpanels[name]) {
					delete vpanels[name];
				}
			}
		};

		function applyAll(methodName) {
			$.each(vpanels, function(n, array) {
				applyFunSub(array, methodName);
			});
		}

		function applyFun(name, ifNameFunName, elseFunName) {
			var doElse = !_.isUndefined(elseFunName);
			$.each(vpanels, function(n, array) {
				if (n === name) {
					applyFunSub(array, ifNameFunName);
				} else if (doElse) {
					applyFunSub(array, elseFunName);
				}
			});
		}
		function applyFunSub(vpanel, funName) {
			var i, e$;
			for (i = 0; i < vpanel.length; i++) {
				e$ = vpanel[i];
				if (_.isFunction(e$[funName])) {
					e$[funName]();
				}
			}
		}
	} // end switchUi
	APP_ui.switchSupport = switchSupport;

	//
	// start of RESIZER
	//

	tmp = (function() {

		var lastHeight = 0;
		var lastWidth = 0;
		var list = [];
		var started = false;

		function add(arg0) {
			if (_.isFunction(arg0)) {
				list.push(arg0);

				if (started === false) {
					started = true;
					start();
				}
			}
			return this;
		}
		//
		function trigger() {
			lastHeight = 0;
			lastWidth = 0;
		}//
		function remove() {
			// later
		}

		function start() {
			window.setInterval(function() {
				var i, height, width;
				height = $(window).height();
				width = $(window).width();
				if (1 < Math.abs(height - lastHeight)
						|| 1 < Math.abs(width - lastWidth)) {
					lastHeight = height;
					lastWidth = width;
					for (i = 0; i < list.length; i++) {
						list[i](width, height);
					}
				}
			}, 1000);
		}

		return {
			'add' : add,
			'remove' : remove,
			'trigger' : trigger
		};
	})();

	APP_ui.registerResize = tmp.add;
	APP_ui.deregisterResize = tmp.remove;
	APP_ui.triggerResize = tmp.trigger;

	//
	// end of RESIZER
	//

	//
	// start of SQL UI
	//

	function createSqlUi() {

	}

	APP_ui.createSqlUi = createSqlUi;
	APP_ui.sqlUi = createSqlUi;

	//
	// end of SQL UI
	//

	//
	// start of PROCESS LOG UI
	//

	function processLogUi(settings) {
		settings = settings || {};
		var ui = APP_ui.templateUi();
		var view$ = ui.view().addClass('process-log-ui');

		ui.data = data;

		return ui;

		function isNotEmpty(o) {
			return o && o.lines && o.lines.length > 0;
		}

		function init(serviceData) {
			var filter = true;
			var headers = true;
			var list = rQ.toList(serviceData);
			var processLog;
			if (list.length[0] && list[0].processLogJson) {
				processLog = JSON.parse(list[0].processLogJson);
			} else {
				processLog = serviceData.processLog;
			}

			if (settings.filter) {
				filter = settings.filter;
			}
			if (settings.headers) {
				headers = settings.headers;
			}

			var tableCss = {
				'margin-top' : '4px',
				'text-align' : 'left',
				'border' : 'gray solid 1px',
				'text-align' : 'left'
			};

			var td1Css = {
				'white-space' : 'nowrap'
			};

			var lines = processLog.lines || processLog.processLines;

			lines.sort(function(a, b) {
				var x = a.time;
				var y = b.time;
				return -1 * ((x < y) ? -1 : ((x > y) ? 1 : 0));
			});

			var states = [ 'Warning', 'Error', 'OK', 'System' ];

			var selectBoxesUi = APP_ui.selectBoxesUi({
				'buttonType' : 'checkbox'
			});
			var checkboxes$ = [];

			var filterPanel$ = (function() {
				var r;
				var t = $('<table>').append(r = $('<tr>'));
				$.each(states, function(i, state) {
					var td = $('<td>').appendTo(r);
					var checkBox = $('<input>', {
						'type' : 'checkbox'
					});
					checkboxes$[i] = checkBox;
					checkBox.change(function() {
						// var checked = checkBox.attr('checked');
						var checked = checkBox.prop('checked');
						var selector = 'tr.' + state;
						if (checked) {
							$(selector).show();
						} else {
							$(selector).hide();
						}
					});
					td.append(checkBox, state);
				});
				return t;
			})();

			var htable = $('<table>', {
				border : 0,
				cellpadding : 0,
				cellspacing : 0
			}).css(tableCss);

			if (headers) {
				var headerTR = $('<tr>', {
					'class' : 'headers'
				}).appendTo(htable);

				// add headers

				$('<td>').css(td1Css).html('Date/Time').appendTo(headerTR);
				$('<td>').html('Status').appendTo(headerTR);
				$('<td>').css(td1Css).html('Message').appendTo(headerTR);
			}
			var sysMsg = $('<div>');
			var sysMsgDisplay = false;

			if (processLog.attributes) {
				for ( var name in processLog.attributes) {
					sysMsg.append($('<div>').html(
							name + ': ' + processLog.attributes[name]));
					sysMsgDisplay = true;
				}
			}
			if (sysMsgDisplay) {
				var trElement = $('<tr>', {
					'class' : 'System'
				});
				htable.append(trElement);
				$('<td>', {
					'class' : 'System'
				}).css(td1Css).html('-').appendTo(trElement);
				$('<td>', {
					'class' : 'System'
				}).html('System').appendTo(trElement);
				$('<td>', {
					'class' : 'System'
				}).append(sysMsg).appendTo(trElement);
			}
			view$.empty();
			if (filter) {
				view$.append(filterPanel$);
			}
			view$.append(htable);
			$.each(lines, function(index, line) {
				var ui;
				var time = new Date(line.time);
				var state = line.state;
				var message = line.message;
				var trElement = $('<tr>', {
					'class' : state
				});
				trElement.state = state;
				htable.append(trElement);
				$('<td>', {
					'class' : state
				}).css(td1Css).html(APP_base.toIsoDateTime(time)).appendTo(
						trElement);
				$('<td>', {
					'class' : state
				}).html(state).appendTo(trElement);
				$('<td>', {
					'class' : state
				}).append($('<div>', {
					'class' : 'process-log-message',
					'text' : message
				})).appendTo(trElement);
			});
			checkboxes$[0].attr('checked', 'checked');
			checkboxes$[1].attr('checked', 'checked');
			checkboxes$[2].attr('checked', 'checked');
			checkboxes$[3].removeAttr('checked');
			checkboxes$[3].trigger('change');

		}

		function hideAndShow(state, checked) {
			var selector = 'tr.' + state;
			if (checked) {
				$(selector).show();
			} else {
				$(selector).hide();
			}
		}

		function data(arg0) {
			if (_.isObject(arg0)) {
				init(arg0);
			}
		}

	}

	APP_ui.processLogUi = processLogUi;
	//
	// PROCESS LOG UI -end-
	//

	//
	// FILE LIST PROCESS LOG UI -start-
	//

	/**
	 * Column for data.table : fileTid, filename, processLogJson
	 */
	function fileListProcessLogUi(settings) {
		var ui, view$, processLogList$;

		ui = APP_ui.templateUi();
		view$ = ui.view().addClass('file-list-process-log-ui');
		processLogList$ = $('<div>').addClass('process-log-list').appendTo(
				view$);

		ui.data = data;

		return ui;

		function data(arg0) {
			var list;
			if (_.isObject(arg0)) {
				list = rQ.toList(arg0);
				processLogList$.empty();
				$.each(list, function(i, row) {
					var row$ = $('<div>').addClass('process-log-list')
							.appendTo(processLogList$);
					var processLog = JSON.parse(row.processLogJson);
					var processLogUi = APP_ui.processLogUi();
					processLogUi.data({
						'processLog' : processLog
					});
					row$.append($('<div>').text("File Tid " + row.fileTid));
					row$.append($('<div>').text("Filename " + row.filename));
					row$.append(processLogUi.view());

				});
			}
		}

	}

	APP_ui.fileListProcessLogUi = fileListProcessLogUi;

	//
	// FILE LIST PROCESS LOG UI -end-
	//

	/**
	 * http://www.html5rocks.com/en/tutorials/video/basics/
	 * 
	 * @memberOf APP_ui
	 */
	function videoUi(settings) {
		settings = settings || {};
		//    
		// <audio src="audio.mp3" preload="auto" controls></audio>
		// "none" does not buffer the file
		// "auto" buffers the media file
		// "metadata" buffers only the metadata for the file
		//

		//
		// url appendix formatted like #t=[starttime][,endtime]
		// http://foo.com/video.ogg#t=10,20
		// specifies that the video should play the range 10 seconds through 20
		// seconds.
		//

		var video$ = $('<video>');
		var canplayCb;
		var ui = APP_ui.templateUi({
			'view$' : video$
		});
		var css = {};
		var trackingFn = null;
		//
		var fullscreenCb = null;
		var isFullscreen = false;

		if (_.isFunction(settings.canplayCb)) {
			canplayCb = settings.canplayCb;
		} else {
			canplayCb = function() {
			};
		}

		if (settings.controls)
			video$.attr('controls', true);
		if (settings.poster)
			video$.attr('poster', settings.poster);
		if (settings.width)
			css['width'] = settings.width;
		if (settings.height)
			css['height'] = settings.height;

		if (_.isArray(settings.sources)) {
			$.each(settings.sources, function(i, source) {
				video$.append($('<source>', {
					'src' : source.src,
					'type' : source.type
				}));
			});
		}
		//
		// videojs
		//
		if (settings.useVideojs && _.isFunction(videojs)) {
			setTimeout(function() {
				videojs(video$[0], {}, function() {
					// This is functionally the same as the previous example.
				});
				video$.addClass('video-js vjs-default-skin');
				video$.attr('data-setup', '{}');
			}, 1);

		}

		if (_.isObject(settings.track)) {
			// $.each(settings.sources, function(i, source) {
			// video$.append($('<source>', {
			// 'src' : source.src,
			// 'type' : source.type
			// }));
			// });
		}

		video$.css(css);

		ui.currentTime = currentTime;
		ui.tracking = tracking;

		video$.on('canplay', canplayCb);
		video$.on('ended', createTrackingCb('ended'));
		video$.on('playing', createTrackingCb('playing'));
		video$.on('loadedmetadata', createTrackingCb('loadedmetadata'));
		video$.on('error', createTrackingCb('error'));
		video$.on('pause', createTrackingCb('pause'));
		video$.on('play', createTrackingCb('play'));

		video$.on(
				'webkitfullscreenchange mozfullscreenchange fullscreenchange',
				function(e) {
					var state = document.fullScreen || document.mozFullScreen
							|| document.webkitIsFullScreen;
					isFullscreen = state ? true : false;
					if (_.isFunction(fullscreenCb)) {
						fullscreenCb(isFullscreen);
					}
				});

		ui.video = function() {
			return video$[0];
		};
		ui.player = ui.video;

		ui.release = release;

		ui.fullscreen = fullscreen;
		return ui;

		function currentTime(arg0) {
			if (_.isString(arg0)) {
				video$.prop('currentTime', arg0);
			}
			return video$.prop('currentTime');
		}

		function tracking(arg0) {
			if (_.isFunction(arg0)) {
				trackingFn = arg0;
			}
		}

		function createTrackingCb(trackingType) {
			return function() {
				if (_.isFunction(trackingFn)) {
					trackingFn(trackingType, currentTime());
				}
			};
		}

		function release() {

			if (video$[0] && _.isFunction(video$[0].pause)) {
				video$[0].pause();
			}
			video$.attr('src', '');
			video$.removeAttr('src');

			video$.find('source').attr('src', '');
			video$.find('source').removeAttr('src');
		}

		function fullscreen(arg0) {
			if (_.isFunction(arg0)) {
				fullscreenCb = arg0;
			}
			return isFullscreen;
		}

	}
	APP_ui.videoUi = videoUi;

	//
	// USER MESSAGES UI -begin-
	//

	function userMessagesUi(settings) {

		settings = settings || {};

		var ui = APP_ui.templateUi(), view$ = ui.view().addClass(
				'user-messages-ui'), currentList = [];

		data(settings.data);

		ui.data = data;
		ui.size = size;

		return ui;

		function data(arg0) {
			view$.empty();
			currentList = APP_data.userMessages(arg0);
			//
			if (currentList.length === 0) {
				view$.addClass('no-messages');
			} else {
				view$.removeClass('no-messages');
				$.each(currentList, function(i, line) {
					view$.append($('<div>').text(line.message).addClass(
							line.level));
				});
			}
		}

		function size() {
			return currentList.length;
		}

	}

	APP_ui.userMessagesUi = userMessagesUi;

	//
	// USER MESSAGES UI -end-
	//

	//
	// FILE UPLOAD UI
	//

	function fileUploadUi(settings) {

		settings = settings || {};
		//
		var ui, form$ = $('<form>');
		var inputFile$, selectBt$, fileHolder$, uploadBt$, message$, result$;
		var doneCb;
		var uploadServiceId, uploadParameters;
		var fileTidsUploaded = [];

		ui = APP_ui.templateUi({
			'view$' : form$
		});

		settings = _.extend({}, {
			'name' : 'uploadFile',
			'multiple' : false,
			'label' : 'Choose a File',
			'labelChosen' : 'File selected'
		}, settings);

		uploadServiceId = settings.uploadServiceId;
		uploadParameters = settings.uploadParameters || {};

		form$.addClass('file-upload-ui');
		inputFile$ = $('<input>', {
			'type' : 'file',
			'name' : settings.name
		}).addClass('file-upload');
		if (settings.multiple === true) {
			inputFile$.attr('multiple', 'multiple');
		}

		selectBt$ = APP_ui.button(L('select...'), function() {
			inputFile$.trigger('click');
		});

		inputFile$.bind('change focus click', processFileInputs);
		fileHolder$ = $('<div>').addClass('file-holder');

		uploadBt$ = APP_ui.button(L('upload'),

		function() {
			message$.empty().text(L('upload-started-please-wait')).show();
			rQ.callForm(form$, uploadServiceId, uploadParameters, cb);

			function cb(data) {
				var resultUi, i, list = rQ.toList(data);
				message$.empty().text(L('upload-done')).show();
				fileTidsUploaded = [];
				for (i = 0; i < list.length; i++) {
					fileTidsUploaded.push(list[i].fileTid);
				}

				done(data);

				message$.empty().text(
						'upload done for ' + list.length + ' file(s).').show();

				if (settings.resultUiType) {
					resultUi = APP_ui.resolveUi(settings.resultUiType);
					resultUi.data(data);
					result$.empty().append(resultUi.view()).show();
				}

			}
		});

		// message
		message$ = $('<div>').addClass('message').hide();

		// result
		result$ = $('<div>').addClass('result').hide();

		form$.append(inputFile$, selectBt$, fileHolder$, uploadBt$, message$,
				result$);
		ui.done = done;
		ui.value = value;

		return ui;

		function done(arg0) {
			if (_.isFunction(arg0)) {
				doneCb = arg0;
			} else {
				if (_.isFunction(doneCb)) {
					doneCb.apply(this, arguments);
				}
			}
			return doneCb;
		}

		function value(arg0) {
			if (_.isString(arg0)) {
				fileTidsUploaded = arg0.split(',');
			}
			return fileTidsUploaded.join(',');
		}

		function processFileInputs() {
			var $val = inputFile$.val(), valArray = $val.split('\\'), filename = valArray[valArray.length - 1];
			var names = [], files = inputFile$[0].files;

			message$.empty().hide();

			if (filename !== '') {
				if (files) {
					$.each(files, function(i, file) {
						names.push(file.name);
					});
					filename = names.join();
				}
				selectBt$.text(settings.labelChosen);
				fileHolder$.text(filename);
				if (doneCb) {
					doneCb(filename);
				}
			}
		}

	}

	//
	// FILE UPLOAD UI -end-
	//

	APP_ui.fileUploadUi = fileUploadUi;

	//
	// DATE TIME UI
	//

	function dateTimeUi(setting) {
		setting = setting || {};
		var ui = APP_ui.templateUi();
		var view$ = ui.view().css('display', 'inline');

		var input$ = $('<input>');
		var span$ = $('<span>');
		var su = APP_ui.switchSupport();
		var m = moment();
		var calendarUi = APP_ui.calendarUi();

		view$.append(calendarUi.view(), input$, span$);

		su.put('edit', calendarUi.view());
		su.put('edit', input$);
		su.put('view', span$);

		ui.value = value;

		return ui;

		function value(arg0) {
			var t;
			if (_.isString(arg0)) {
				t = parseInt(arg0);
				if (t != NaN && arg$.length === t + ''.length) {
					m = moment(t);
				} else {
					m = moment(arg0);
				}

			}

			return '' + m.format('x');
		}

		function disable(arg0) {
			if (_.isBoolean(arg0)) {
				arg0 ? su.show('view') : su.show('edit');
			}
			return su.current() === 'view';
		}
	}

	//
	// STAR RATING UI
	// url:http://rateit.codeplex.com
	//

	function starRatingUi(settings) {

		settings = settings || {};
		var ui = APP_ui.templateUi();
		var view$ = ui.view();
		var init = $.extend({
			'max' : 5,
			'step' : 1,
		}, settings);
		if (!_.isFunction(view$.rateit)) {
			alert('RateIt plugin missing!');
			return;
		}
		view$.rateit(init);
		ui.value = value;
		ui.select = select;
		ui.editable = editable;
		return ui;

		function value(arg0) {
			if (!_.isUndefined(arg0)) {
				view$.rateit('value', arg0);
			}
			return view$.rateit('value');
		}

		function select(arg0) {
			if (_.isFunction(arg0)) {
				view$.bind('rated', function(event, value) {
					arg0(value);
				});
				view$.bind('reset', function(event, value) {
					arg0(-1);
				});

			}
		}

		function editable(arg0) {
			view$.rateit('readonly', !arg0);
		}

	}
	APP_ui.starRatingUi = starRatingUi;

	APP_ui.logout = function() {
		$('body').hide();
		window.location.reload(true);
	};

	function splashScreenUi() {
		var ui = APP_ui.templateUi();
		var view$ = ui.view();
		// var holder$ = $('<div>').appendTo($('body')).hide().append(view$);
		view$.addClass('splash-screen-ui');
		var cssImg = {
			'margin' : '0 auto'
		};
		var css = {
			'position' : 'absolute',
			'top' : '10%',
			'left' : '10%',
			'height' : '80%',
			'width' : '80%',
			'background-color' : 'lightGray',
			'background-repeat' : 'no-repeat',
			'text-align' : 'center',
			'z-index' : '1000'
		};
		view$.css(css);
		function show(arg0) {
			view$.show('scale', {}, 1000, function() {
				if (_.isFunction(arg0)) {
					arg0('show');
				}
			});// easeInQuad
		}
		function hide(arg0) {
			view$.hide('blind', {}, 1000, function() {
				if (_.isFunction(arg0)) {
					arg0('hide');
				}
				view$.remove();
			});// easeInQuad
		}

		function remove(arg0) {
			hide(arg0);
		}

		ui.show = show;
		ui.hide = hide;
		ui.remove = remove;

		return ui;

	}

	APP_ui.splashScreenUi = splashScreenUi;

	//
	// OVERLAY UI
	//

	function overlayUi(settings) {
		// ******
		// public
		// ******
		var view, addParent;

		var allViews = [];
		// parent

		var opacityCss = {
			opacity : '0.9',
			filter : 'alpha(opacity=90)'
		};

		var noOpacityCss = {
			opacity : '1',
			filter : 'alpha(opacity=100)'
		};

		var createView = function(panel$) {

			var view$ = $('<div>'), contentPanel$;
			var close$ = APP_ui.createButton('Close', function() {
				view$.hide();
			}).css({
				'position' : 'relative',
				'float' : 'right',
				'right' : '-20px',
				'top' : '-20px'
			});
			close$.button({
				icons : {
					primary : "ui-icon-circle-close"
				},
				text : false
			});
			if (settings && settings.noCloseButton === true) {
			} else {
				view$.append(close$);
			}

			contentPanel$ = $('<div>').appendTo(view$);
			contentPanel$.append(panel$);
			view$.addClass('ui-corner-all');

			view$.css(opacityCss);

			view$.hover(function() {
			}, function() {
				view$.hide("fast");
			});
			view$.hide();
			$('body').append(view$);
			return view$;
		};

		addParent = function(parent$, compOrText, cssSettings) {
			var c$, view$, checkHide;
			var inwork = false;

			// create content
			compOrText = compOrText || '-empty-';
			if (typeof (compOrText) === 'string') {
				c$ = $('<div>', {
					text : compOrText
				}).css({
					'text-weight' : 'bold'
				});
			} else {
				c$ = compOrText;
			}

			view$ = createView(c$);

			view$.hover(function() {
				inwork = true;
			}, function() {
				inwork = false;
			});

			allViews.push(view$);

			parent$.hover(function() {

				var position = parent$.offset();
				var width = parent$.outerWidth();
				var top = position.top;
				var left = position.left;

				view$.hide();

				$.each(allViews, function(i, v$) {
					v$.hide();
				});
				if (typeof (cssSettings) === 'object') {
					view$.css(cssSettings);
				} else if (typeof (cssSettings) === 'function') {
					view$.css(cssSettings());
				} else {
					view$.css({
						position : 'absolute',
						left : left + width + 2,
						top : top,
						border : 'gray solid 1px',
						padding : '4px',
						margin : '4px',
						'z-index' : 10000,
						'background-color' : 'white'
					});
				}
				view$.show("fast");

				window.setTimeout(checkHide = function() {
					if (inwork) {
						window.setTimeout(checkHide, 2000);
					} else {
						view$.hide('slow');
					}
				}, 2000);

			}, function() {
				// view$.hide("slow");
			});

			// parent$.mouseleave(function() {
			// view$.hide("slow");
			// });
		};

		return {
			addParent : addParent,
			view : view
		};
	}
	APP_ui.overlayUi = overlayUi;

	//
	// OVERLAY 2 UI
	//

	function overlay2Ui(settings) {

		settings = settings || {};
		var parentUi, parent$, ui = APP_ui.templateUi();
		var view$ = ui.view().addClass('overlay2-ui');

		function parent(arg0) {
			if (_.isObject(arg0)) {
				if (APP_ui.isTemplateUi(arg0)) {
					parentUi = arg0;
					parent$ = arg0.view();
				} else {
					parent$ = arg0;
				}
				ui.view().hide();
				ui.view().appendTo(parent$);
				parent$.hover(function() {
					view$.show('slow');
				}, function() {
					view$.hide('fast');
				});
			}
			return parentUi || parent$;
		}

		ui.parent = parent;
		return ui;
	}
	APP_ui.overlay2Ui = overlay2Ui;

	//
	// PART UI
	//

	/**
	 * @memberOf APP_ui
	 */
	function partUi(settings) {

		settings = settings || {};

		var ui, view$, switchSupport, titles$, ttHolder$, done$, backLabel, doneFn;
		var L, D;
		L = settings.L || APP_data.getLabel;
		D = settings.D || APP_data.getDescription;
		backLabel = settings.backLabelId ? L(settings.backLabelId) : 'overview';

		ui = APP_ui.templateUi();

		switchSupport = APP_ui.switchSupport();
		view$ = ui.view().addClass('part-ui');
		titles$ = $('<div>');
		ttHolder$ = $('<div>');
		done$ = $('<div>', {
			'class' : 'part-ui-done'
		}).append(APP_ui.link(backLabel, doneFn = function() {
			switchSupport.show('titles');
		}).addClass('show-titles'));
		view$.append(titles$, done$, ttHolder$);

		switchSupport.put('titles', titles$);
		switchSupport.put('tt', ttHolder$);
		switchSupport.put('tt', done$);
		switchSupport.show('titles');
		ui.add = add;
		ui.size = function() {
			return titles$.children().length;
		};
		ui.createCreatorFun4Tt3 = createCreatorFun4Tt3;

		return ui;

		function add(arg0, arg1) {
			if (arg1 === undefined || _.isFunction(arg1)) {
				return _add(arg0, arg1);
			}
			return addTt3.apply(this, arguments);
		}

		function _add(crudName, creatorFun) {
			var entry$;

			entry$ = $('<a>', {
				'class' : 'part-ui-entry',
				'href' : '#'
			}).append(
			//
			$('<div>', {
				'class' : 'part-ui-title',
				'text' : L(crudName)
			})
			//
			, $('<div>', {
				'class' : 'part-ui-description',
				'text' : D(crudName)
			}));

			entry$.click(function() {
				var ui;
				ttHolder$.empty();
				if (_.isFunction(creatorFun)) {
					ui = creatorFun();
					ui.done(doneFn);
				} else {
					// ui = APP_ui_tabletool.createUi({
					// 'name' : crudName,
					// 'showTitle' : false,
					// });
					// ttHolder$.append($('<h3>', {
					// 'text' : L(crudName)
					// }));
				}
				ttHolder$.append(ui.view());
				switchSupport.show('tt');
			});

			titles$.append(entry$);
		}

		function addTt3(startName, defMap, value, data) {
			var entry$, creatorFun;

			entry$ = $('<a>', {
				'class' : 'part-ui-entry',
				'href' : '#'
			}).append(
			//
			$('<div>', {
				'class' : 'part-ui-title',
				'text' : L(startName)
			})
			//
			, $('<div>', {
				'class' : 'part-ui-description',
				'text' : D(startName)
			}));

			entry$.click(function() {
				var ui;
				ttHolder$.empty();
				creatorFun = createCreatorFun4Tt3(startName, defMap);

				ui = creatorFun(value, data);

				ttHolder$.append(ui.view());
				switchSupport.show('tt');
			});

			titles$.append(entry$);
		}

		function createCreatorFun4Tt3(startName, defMap) {
			function creatorFun(value, data) {
				var tt3ui = APP_ui.anakapaViewUi(startName, {
					'defMap' : defMap
				});
				if (value) {
					tt3ui.value(value);
				}
				if (data) {
					tt3ui.data(data);
				}
				return tt3ui;
			}
			return creatorFun;
		}
	}
	APP_ui.partUi = partUi;

	
	//
	//
	// GRID SUPPORT
	//
	//

	function gridSupport(type) {

		return {
			'table' : table,
			'row' : row,
			'cell' : cell,
			'div' : div
		};

		function table() {
			if (type === 'div') {
				return $('<div>').addClass('grid-table');
			}
			return $('<table>');
		}

		function row() {
			if (type === 'div') {
				return $('<div>').addClass('grid-row');
			}
			return $('<tr>');
		}

		function cell() {
			if (type === 'div') {
				return $('<div>').addClass('grid-cell');
			}
			return $('<td>');
		}

		function div() {
			return $('<div>');
		}
	}

	APP_ui.gridSupport = gridSupport;

	//
	// DIV UI -begin-
	//

	function divUi(settings) {
		settings = settings || {};
		var ui = APP_ui.templateUi();
		var formatterFn = APP_base.findFunction(settings.formatter,
				APP_base.echo);
		var currentValue;

		if (_.isObject(settings.css)) {
			ui.view().css(settings.css);
		}

		if (_.isString(settings['class'])) {
			ui.view().addClass(settings['class']);
		}

		ui.value = value;

		if (_.isString(settings)) {
			value(settings);
		}
		ui.value = value;
		return ui;

		function value(arg0) {
			if (arg0 != undefined) {
				currentValue = arg0;
				ui.view().text(formatterFn(currentValue));
			}
			return currentValue;
		}

	}
	APP_ui.divUi = divUi;

	//
	// DIV UI -end-
	//

	//
	// DND DOCUMENT UPLOAD -begin-
	//
	/**
	 * settings fields:
	 * 
	 * 'view$' element that listens to the file drop event,
	 * 
	 * 'serviceId' service that is used for the upload (default:
	 * MeetingDocumentUpload),
	 * 
	 * 'parameters' is an object with additional parameters that are sent to the
	 * server,
	 * 
	 * 'logger' is a callback for log/tracking info,
	 * 
	 * 'newXhr' is a callback which is called with every new XMLHttpRequest
	 * created for an upload,
	 * 
	 * 'test' is a callback with a parameter file that expects true or false
	 * (true => continue upload).
	 */
	/**
	 * @memberOf APP_ui
	 */
	function dndDocumentUpload(holder$, settings) {

		settings = settings || {};
		var holder, serviceUrl, serviceId, parameters, begin, end, test, logger, progress;
		// var usingJquery = true;
		serviceId = settings['serviceId'] || 'MeetingDocumentUpload';
		parameters = settings['parameters'] || {};
		begin = settings['begin'] || dummy;
		end = settings['end'] || dummy;
		progress = settings['progress'] || dummy;
		test = settings['test'] || dummy;
		logger = settings['logger'] || dummy;
		newXhr = settings['newXhr'] || dummy;
		serviceUrl = settings.serviceUrl || 'remoteQuery/';

		holder$.on('dragover', function() {
			holder$.addClass('dnd-document-upload-hover');
			return false;
		});

		holder$.on('dragend', function() {
			holder$.removeClass('dnd-document-upload-hover');
			return false;
		});

		holder$.on('drop', function(e) {
			var files;
			try {
				files = e.originalEvent.target.files
						|| e.originalEvent.dataTransfer.files;
			} catch (e) {
				return true;
			}
			holder$.removeClass('dnd-document-upload-hover');
			if (_.isUndefined(files) || files.length === 0) {
				return true;
			}
			holder$.addClass('dnd-document-upload-processing');
			e.stopPropagation();
			e.preventDefault();
			processUpload(files, e);
			return false;
		});

		function testDefault(file) {
			if (file.type !== 'application/pdf') {
				return false;
			}
			if (file.size > 5000000) {
				return false;
			}
			return true;
		}

		function dummy() {
			return true;
		}

		function processUpload(files, event) {

			var i, t, file, fileName, files2 = [], uploadDone = 0, uploadResult = [], formData, xhr;

			if (!_.isObject(files) || !files.length) {
				logger('-no files to upload-');
				return false;
			}

			for (i = 0; i < files.length; i++) {
				file = files.item(i);
				if (test(file)) {
					files2.push(file);
				}
			}

			begin(files2, event);

			//
			if (false) {
				(function() {
					var index = 0;

					next();

					function next(data) {
						var file = files2[index];

						// if (xhr.responseText) {
						// try {
						// e = rQ.toList(JSON.parse(xhr.responseText))[0];
						// uploadResult.push(e);
						// } catch (err) {
						// uploadResult.push(err.message);
						// }
						//
						// }

						index++;
						if (file) {
							processOneFile(file, next);
						} else {
							end(uploadResult, event);
							// alert('all files done!');
						}
					}

				})();
			}
			//

			for (i = 0; i < files2.length; i++) {
				file = files2[i];
				fileName = file.name;

				formData = new FormData();
				xhr = new XMLHttpRequest();

				xhr.upload.addEventListener("progress", createProgressFn(file,
						i, progress), false);

				// xhr.upload.addEventListener("load", createProgressFn(file, i,
				// progress), false);

				xhr.open('POST', serviceUrl + serviceId);
				// xhr.onload =
				xhr.onloadend = createOnloadFn(file, xhr);

				// function() {
				// alert('onloadend');
				// };

				t = _.isFunction(parameters) ? parameters(file) : parameters;
				$.each(t, function(name, value) {
					formData.append(name, value);
				});

				formData.append(fileName, file);
				logger('trying to upload ' + fileName, file);

				newXhr(xhr, file, i);
				xhr.send(formData);

			}

			function processOneFile(file, doneFn) {

				var fileName = file.name;

				var formData = new FormData();
				var xhr = new XMLHttpRequest();

				xhr.upload.addEventListener("progress", createProgressFn(file,
						i, progress), false);

				xhr.open('POST', APP_data.sqUrl + serviceId);

				xhr.onloadend = doneFn;

				t = _.isFunction(parameters) ? parameters(file) : parameters;
				$.each(t, function(name, value) {
					formData.append(name, value);
				});

				formData.append(fileName, file);
				logger('trying to upload ' + fileName, file);

				newXhr(xhr, file, i);
				xhr.send(formData);
			}

			function createOnloadFn(file, xhr) {
				return function(data) {
					var e;
					if (xhr.responseText) {
						try {
							e = rQ.toList(JSON.parse(xhr.responseText))[0];
							uploadResult.push(e);
						} catch (err) {
							uploadResult.push(err.message);
						}

					}
					uploadDone++;
					if (uploadDone == files2.length) {
						end(uploadResult, event);
						holder$.removeClass('dnd-document-upload-processing');
					}
				};

			}

			function createProgressFn(file, index, progress) {
				return function(e) {
					progress(e, file, index);
				};

			}
		}
	}

	APP_ui.dndDocumentUpload = dndDocumentUpload;

	//
	// DND DOCUMENT UPLOAD -end-
	//

	//
	// FILE LIST AREA UI -start-
	//

	/**
	 * @memberOf APP_ui
	 */
	function fileListAreaUi(settings) {

		settings = settings || {};

		var ui, view$, fileAreaUi, fileListTid;

		ui = APP_ui.templateUi();
		view$ = ui.view().addClass('file-list-area-ui');
		ui.value = value;

		return ui;

		function value(arg0) {
			if (_.isString(arg0) && arg0) {
				fileListTid = arg0;
				init();
				// refresh();
			}
			return fileListTid;
		}

		function init() {
			var s = {
				// 'openFile' : APP_ui.openFile,
				// 'refresh' : refresh,
				'serviceId' : settings.serviceId,
				'parameters' : {
					'fileListTid' : fileListTid
				},
				'uploadServiceId' : settings.uploadServiceId,
				'uploadParameters' : {
					'fileListTid' : fileListTid
				},
				'footerRenderer' : footerRenderer,
				'uploadBegin' : uploadBegin,
				'uploadEnd' : uploadEnd,
				'useDND' : settings.useDND
			};
			fileAreaUi = APP_ui.fileAreaUi(s);
			view$.empty().append(fileAreaUi.view());
		}

		function footerRenderer(fileContainer$, footer$, file) {
			var delete$, actionPanel$ = $('<div>')
					.addClass('file-action-panel');
			// DELETE BUTTON
			delete$ = APP_ui.link(
					'delete',
					function() {
						if (settings.removeFileServiceId) {
							rQ.call(settings.removeFileServiceId, {
								'fileListTid' : fileListTid,
								'fileTid' : file.fileTid
							}, function(serviceData) {
								fileAreaUi.message('File ' + file.filename
										+ ' removed.');
							});
						}
						fileContainer$.remove();
					}).addClass('fa fa-times');
			actionPanel$.append(delete$);
			footer$.append(actionPanel$);
		}

		function uploadBegin() {
			view$.addClass('upload-begin');
		}

		function uploadEnd() {
			view$.removeClass('upload-begin');
		}

	}

	APP_ui.fileListAreaUi = fileListAreaUi;

	//
	// FILE LIST AREA UI -end-
	//

	//
	// SINGLE FILE AREA UI -start-
	//

	function singlefileAreaUi(settings) {
		var fileAreaUi, s, fileTid;
		s = {
			'openFile' : APP_ui.openFile,
			'refresh' : refresh,
			'serviceId' : settings.serviceId,
			'uploadServiceId' : settings.uploadServiceId,
			'uploadParameters' : {},
			'previewUrl' : function() {
			},
			'footerRenderer' : function() {
			},
			'uploadBegin' : function() {
			},
			'uploadEnd' : function() {
			}
		};
		fileAreaUi = APP_ui.fileAreaUi(s);

		fileAreaUi.value = value;
		var ui = APP_ui.fileAreaUi(s);

		function value(arg0) {
			if (_.isString(arg0)) {
				fileTid = arg0;
			}
			return fileTid;
		}

		function refresh() {
			rQ.call(settings.serviceId, {
				'fileTid' : fileTid
			}, function(serviceData) {
				var list = rQ.toList(serviceData);
				fileAreaUi.data(list);
			});
		}

	}

	APP_ui.singlefileAreaUi = singlefileAreaUi;

	//
	// DOWNLOAD FILE
	//
	function downloadFile(file) {

		var url = 'docu/sha/' + file.fileTid + '/' + file.filename;

		var a$ = $('<a>', {
			'href' : url
		})
				.text(
						'downloading file ' + file.filename + ' ('
								+ file.fileTid + ')').addClass('download-file')
				.appendTo($('body'));

		// a$.click();

		// window.setTimeout(function() {
		// a$.remove();
		// }, 3000);
	}

	APP_ui.downloadFile = downloadFile;

	//
	// DOWNLOAD LINK
	//
	function downloadLink(file) {
		var url, a$;
		label = file.label || file.filename + ' (' + file.fileTid + ')';
		url = 'docu/sha/' + file.fileTid + '/' + file.filename;
		a$ = $('<a>', {
			'href' : url,
			'target' : file.target || '_self'
		}).text(label);
		return $('<span>').append($('<span>').text('Link: '), a$).addClass(
				'download-link');
	}

	APP_ui.downloadLink = downloadLink;

	//
	//
	// GLOBAL USER MESSAGE UI -start-
	//
	//

	/**
	 * @memberOf APP_ui
	 */
	function globalUserMessageUi(displayTime, parent$) {
		if (_.isObject(APP_ui.globalUserMessageUi.ui)) {
			return APP_ui.globalUserMessageUi.ui;
		}
		var ui, view$;
		var displayTime = displayTime || 2000;

		globalUserMessageUi.ui = ui = APP_ui.userMessageUi({
			'actionName' : 'slide',
			'displayTime' : displayTime,
			'fadeTime' : 1000
		});

		view$ = ui.view().addClass('global-user-message-ui');

		(parent$ || $('body')).append(view$);

		return ui;

	}

	APP_ui.globalUserMessageUi = globalUserMessageUi;

	//
	// USER MESSAGE UI -start-
	//

	function userMessageUi(settings) {

		settings = settings || {};

		var ui = APP_ui.templateUi(), view$, queue = [];
		var displayTime, fadeTime, isRunning = false;
		var actionName;

		displayTime = _.isNumber(settings.displayTime) ? settings.displayTime
				: 1000;
		fadeTime = _.isNumber(settings.fadeTime) ? settings.fadeTime : 1000;
		actionName = _.isNumber(settings.actionName) ? settings.actionName
				: 'fade';

		view$ = ui.view().addClass('user-message-ui');

		ui.text = text;
		ui.skipToEnd = skipToEnd;

		return ui;

		function text(m) {
			queue.push(m);
			if (isRunning) {
				return;
			}
			run();
		}

		function run() {
			var m;

			if (queue.length > 0) {
				isRunning = true;
				// view$.hide();
				m = queue[0];
				queue = _.rest(queue);
				view$.text(m);
				view$.show();

				// view$.show(actionName, {}, fadeTime, function() {
				window.setTimeout(timeoutFn, displayTime);
				// });

			} else {
				isRunning = false;
			}

		}

		function timeoutFn() {
			if (queue.length > 0) {
				run();
			} else {
				view$.hide(actionName, {}, fadeTime, function() {
					run();
				});
			}
		}

		function skipToEnd() {
			queue = [];
		}

	}
	APP_ui.userMessageUi = userMessageUi;

	//
	// USER MESSAGE UI -end-
	//

	//
	// HTML UI -start-
	//

	function htmlUi(settings) {
		var ui = APP_ui.templateUi();
		var currentValue;
		ui.view().addClass('html-ui');
		ui.value = value;
		return ui;

		function value(arg0) {
			if (_.isString(arg0)) {
				currentValue = arg0;
				ui.view().html(currentValue);
			}
			return currentValue;
		}
	}

	APP_ui.htmlUi = htmlUi;

	//
	// SELECT BOXES UI -start-
	//

	function selectBoxesUi(settings) {
		settings = settings || {};
		var labelName, valueName;
		var ui = APP_ui.templateUi(), view$ = ui.view();
		var selectCallback;

		view$.addClass('select-boxes-ui');

		var buttonType = settings.buttonType || settings.type || 'radio';
		var name = buttonType + '-' + APP_base.newId();

		var selectList = settings.selectList;
		var selectFn = settings.selectFn || _.noop;
		var defaultValue = settings.defaultValue || '';

		var byValue = {};

		labelName = settings.labelName || 'label';
		valueName = settings.valueName || 'value';
		if (_.isArray(selectList)) {
			$.each(selectList, function(i, e) {
				var value, label, v$;
				if (_.isObject(e)) {
					value = e[valueName];
					label = e[labelName] || value;
				} else {
					value = label = e;
				}

				v$ = $('<input>', {
					'type' : buttonType,
					'name' : name,
					'value' : value
				}).click(selectFn);
				byValue[value] = v$;
				view$
						.append($('<div>').addClass('select-boxes-holder')
								.append(
										v$,
										$('<span>').addClass(
												'select-boxes-label').text(
												label)));

				v$.click(function(e) {
					// alert(buttonType + ' checked : ' + v$.prop('checked'));
					e.stopPropagation();
				});

			});
		}

		ui.value = value;

		ui.value(settings.value);

		return ui;

		function value(arg0) {
			var v$, value, arr;
			if (_.isString(arg0)) {
				view$.find('input').prop('checked', false);
				arr = arg0.split(',');
				$.each(arr, function(i, v) {
					v$ = view$.find('input[value="' + v + '"]').prop('checked',
							true);
				});
			}
			$.each(byValue, function(v, v$) {
				if (v$.prop('checked')) {
					if (value) {
						value += ',' + v;
					} else {
						value = v;
					}
				}
			});

			return value || defaultValue;
		}

		function select(arg0) {
			if (_.isFunction(arg0)) {
				selectCallback = arg0;
				return;
			} else if (_.isFunction(selectCallback)) {
				selectCallback(value());
				return;
			}
		}

	}

	APP_ui.selectBoxesUi = selectBoxesUi;

	//
	// SELECT BOXES UI -end-
	//

	//
	// SQ REPORT TABLE UI -end-
	//

	function reportsListUi(settings) {

		var defs = settings.defs;
		var ui = APP_ui.templateUi();
		var table$ = $('<table>').addClass('ui-widget ui-widget-content');

		ui.view().append(table$);

		$.each(defs,
				function(i, psrDef) {
					var serviceQueryUi, reportDialogUi, tr$ = $('<tr>');
					table$.append(tr$);
					reportDialogUi = APP_ui.dialogUi({
						width : 860,
						height : 600,
						modal : true,
						title : 'Report'
					});

					var title = psrDef.title || psrDef.serviceId
							|| "Report -no title-";
					serviceQueryUi = APP_ui_report.create(psrDef);
					reportDialogUi.set(serviceQueryUi.view());
					var buttonUi = APP_ui.buttonUi({
						text : 'Open'
					}, function() {
						serviceQueryUi.run();
						reportDialogUi.show();
					});
					tr$.append($('<td>', {
						title : title,
						text : title
					}), $('<td>').append(buttonUi.view()));

				});

		return ui;
	}

	APP_ui.reportsListUi = reportsListUi;

	//
	// RESOLVE UI
	//

	function resolveUi(settings) {
		var uiType, uiTypeFn;
		if (_.isString(settings)) {
			settings = {
				'uiType' : settings
			};
		}
		uiTypeFn = APP_base.findFunction(settings.uiType);
		uiTypeFn();
	}

	APP_ui.resolveUi = resolveUi;

	//
	// STACKED UI -start-
	//

	function stackedUi(settings) {
		settings = settings || {};
		var ui = APP_ui.templateUi();
		var uiList = [];
		var view$ = ui.view().addClass('stacked-ui');

		// view$.append('<div>Stacked Ui</div>');

		function push(bodyUi, headUi) {

			headUi = headUi || APP_ui.templateUi();

			var current = uiList[uiList.length - 1];

			if (current) {
				current.head.hide();
				current.body.hide();
			}
			uiList.push({
				'body' : bodyUi,
				'head' : headUi
			});

			view$.append(headUi.view(), bodyUi.view());

			headUi.show();
			bodyUi.show();

		}

		function pop() {

			var current, poped = uiList.pop();

			if (poped) {
				poped.body.remove();
				poped.head.remove();
			}

			current = uiList[uiList.length - 1];

			if (current) {
				current.head.show();
				current.body.show();
			}

			return current;
		}

		function length() {
			return uiList.length;
		}

		function uiList() {
			return uiList;
		}

		ui.push = push;
		ui.pop = pop;
		ui.length = length;
		ui.uiList = uiList;

		return ui;

	}

	APP_ui.stackedUi = stackedUi;

	//
	// STACKED UI -end-
	//

	//
	// TREE UI -begin-
	//

	/**
	 * @memberOf APP_ui
	 * @param settings
	 * 
	 * API
	 * 
	 * treeUi (nodeUi, nodelistUi)
	 * 
	 * nodelistUi (add, show, hide, )
	 * 
	 * nodeUi (headerUi, nodelistUi)
	 * 
	 * headerUi ()
	 * 
	 */

	function nodelistUi() {
		var ui = APP_ui.templateUi();
		var view$ = ui.view().addClass('node-list-ui');
		var nodes = APP_base.sArray();

		ui.close = close;
		ui.open = open;
		ui.add = add;
		return ui;

		function add(id, nodeUi) {
			nodes.put(id, nodeUi);
			ui.view().append(nodeUi.view());
			return ui;
		}

		function close() {
			var i, list = nodes.list();
			for (i = 0; i < list.length; i++) {
				list[i].close();
			}
		}

		function open() {
			var i, list = nodes.list();
			for (i = 0; i < list.length; i++) {
				list[i].open();
			}
		}

	}

	function nodeUi(settings) {
		settings = settings || {};
		var ui = APP_ui.templateUi();
		var view$ = ui.view().addClass('node-ui');
		var _topUi = APP_ui.templateUi();
		var _nodelistUi = APP_ui.nodelistUi();
		var _openCb, _closeCb, _isOpen = true;

		_topUi.view().addClass('node-ui-top');

		view$.append(_topUi.view(), _nodelistUi.view());

		ui.add = add;
		ui.top = top;
		ui.close = close;
		ui.open = open;
		ui.isOpen = isOpen;
		ui.topUi = topUi;
		ui.nodelistUi = nodelistUi;

		return ui;

		function topUi() {
			return _topUi;
		}

		function top(arg0) {
			if (_.isString(arg0)) {
				_topUi.view().text(arg0);
			}
			return _topUi.view();
		}

		function add(id, arg0) {
			if (_.isObject(arg0) && _.isString(id)) {
				_nodelistUi.add(id, arg0);
			}
		}
		function nodelistUi(arg0) {
			if (_.isObject(arg0)) {
				_nodelistUi.view().remove();
				_nodelistUi = arg0;
				view$.append(_nodelistUi.view());
				if (_.isOpen) {
					_nodelistUi.view().show();
				} else {
					_nodelistUi.view().hide();
				}
			}
			return _nodelistUi;
		}

		function close(arg0) {
			if (_.isFunction(arg0)) {
				_closeCb = arg0;
				return;
			}
			_nodelistUi.hide();
			_isOpen = false;
			if (_.isFunction(_closeCb)) {
				_closeCb.apply(this, arguments);
			}
		}

		function open(arg0) {
			if (_.isFunction(arg0)) {
				_openCb = arg0;
				return;
			}
			_nodelistUi.show();
			_isOpen = true;
			if (_.isFunction(_openCb)) {
				_openCb.apply(this, arguments);
			}
		}

		function isOpen() {
			return _isOpen;
		}

	}

	APP_ui.nodelistUi = nodelistUi;
	APP_ui.nodeUi = nodeUi;

	//
	// MENU UI
	//

	function navigationTreeUi(menu, settings) {

		settings = settings || {};
		var pathToNodeUi = {};
		var ui = _createUi(menu);

		ui.open = open;

		return ui;

		function _createUi(menu, level, parentPath) {
			level = level || 1;
			parentPath = parentPath || [];

			var ui, i, o, nodeUi;
			if (_.isArray(menu)) {
				ui = APP_ui.nodelistUi();
				for (i = 0; i < menu.length; i++) {
					o = menu[i];
					nodeUi = _createUi(o, level, parentPath);
					ui.add(o.id, nodeUi);
				}
			} else {
				parentPath.push(menu.id)
				ui = APP_ui.nodeUi();
				k = string(parentPath);
				pathToNodeUi[string(parentPath)] = {
					'ui' : ui,
					'path' : _.clone(parentPath)
				};
				if (_.isArray(menu.submenu) && menu.submenu.length > 0) {
					enhanceTop(ui, menu, settings.topRenderer);
					ui
							.nodelistUi(_createUi(menu.submenu, level + 1,
									parentPath));
				} else {
					enhanceTop(ui, menu, settings.topRenderer);
					ui.view().addClass('menu-ui-leave');
				}

				ui.view().addClass('menu-ui-level-' + level);
				parentPath.pop();
			}
			return ui;
		}

		function open(arg0) {
			var k = string(arg0);
			var e = pathToNodeUi[k];
			var path;
			if (e) {
				path = _.clone(e.path);
				while (path.length > 0) {
					_open(pathToNodeUi[string(path)]);
					path.pop();
				}
			}

			function _open(e) {
				if (e && e.ui && _.isFunction(e.ui.open)) {
					e.ui.open();
				}
			}
		}

		function string(arg0) {
			var i = 0, s = '';
			if (_.isArray(arg0)) {
				for (i = 0; i < arg0.length; i++) {
					if (i > 0) {
						s += '-';
					}
					s += arg0[i];
				}
			} else {
				s = '' + arg0;
			}
			return s;
		}

		// *** enhanceTop ***

		function enhanceTop(nodeUi, nodeDef, arg0) {

			var topRendererFn = arg0 || defaultTopRenderer;
			var a$, topUi = nodeUi.topUi(), top$ = topUi.view();

			nodeUi.open(onOpen);
			nodeUi.close(onClose);

			topRendererFn(nodeUi, nodeDef);

			function onClose() {
				top$.removeClass('open');
				top$.addClass('close');
			}

			function onOpen() {
				top$.addClass('open');
				top$.removeClass('close');
			}

			function defaultTopRenderer(nodeUi, nodeDef) {
				var a$, topUi = nodeUi.topUi(), top$ = topUi.view(), render = nodeDef.render;

				if (_.isFunction(render)) {
					render.apply(this, arguments);
					return;
				}

				top$.addClass(nodeDef.styleClass);
				// leave
				if (nodeDef.submenu.length === 0) {
					top$.text(nodeDef.title);
					if (_.isFunction(nodeDef.click)) {
						top$.click(nodeDef.click);
					}
					return;
				}

				a$ = $('<a>', {
					'href' : '#',
					'text' : nodeDef.title
				});
				a$.click(onClick);
				top$.append(a$);
				top$.addClass('menu-ui-branch');

				nodeUi.close();

				function onClick() {
					if (nodeUi.isOpen()) {
						nodeUi.close();
					} else {
						nodeUi.open();
					}
					return false;
				}
			}

		}

	}

	APP_ui.navigationTreeUi = navigationTreeUi;
	//
	// TREE UI -end-
	//

	//
	// STACKED 2 UI -begin-
	//

	/**
	 * @memberOf APP_ui
	 */
	function stacked2Ui(settings) {
		var ui = APP_ui.templateUi();
		var view$ = ui.view().addClass('stacked2-ui');
		var huiList = [];

		// view$.append('<div>Stacked Ui</div>');

		function push(ui) {
			var i, hui = createHolderUi(ui);

			huiList.push(hui);

			view$.append(hui.view());

			showLast();
			// show last

		}

		function showLast() {
			var i;
			for (i = 0; i < huiList.length; i++) {
				hui = huiList[i];
				if (i === huiList.length - 1) {
					hui.show();
				} else {
					hui.hide();
				}
			}
		}

		function current() {
			if (huiList.length > 0) {
				return huiList[huiList.length - 1].contentUi();
			}
		}

		function pop(arg0) {
			var i, startRemoving = false, last = huiList.length - 1;
			// show
			for (i = 0; i < huiList.length; i++) {
				hui = huiList[i];
				if (startRemoving) {
					hui.view().remove();
					continue;
				}
				if (hui === arg0) {
					last = i;
					startRemoving = true;
					hui.view().remove();
					continue;
				}
				if (huiList.length - 1 === i) {
					hui.view().remove();
				}
			}
			huiList = huiList.slice(0, last);
			showLast();
		}

		function size() {
			return huiList.length;
		}

		function createHolderUi(ui) {
			var hui = APP_ui.templateUi();
			var headerUi = APP_ui.templateUi();
			var bodyUi = APP_ui.templateUi();

			headerUi.view().addClass('header');
			if (_.isFunction(ui.headerUi)) {
				headerUi.view().append(ui.headerUi().view());
			} else {
				headerUi.view().append(
						APP_ui.div().addClass('title').text(ui.label()));
			}
			headerUi.view().append(
					$('<div>').addClass('buttons').append(
							APP_ui.button('close', function() {
								pop(hui);
							}).addClass('close-button')));

			bodyUi.view().addClass('body').append(ui.view());

			hui.view().append(headerUi.view(), bodyUi.view())
					.addClass('holder').addClass('stack-level-' + size());
			hui.show = function() {
				headerUi.view().addClass('show-body');
				headerUi.view().removeClass('hidden-body');
				bodyUi.show.apply(this, arguments);
				ui.show.apply(this, arguments);
			};
			hui.hide = function() {
				headerUi.view().removeClass('show-body');
				headerUi.view().addClass('hidden-body');
				bodyUi.hide.apply(this, arguments);
			};
			hui.contentUi = function() {
				return ui;
			};
			return hui;
		}

		ui.push = push;
		ui.pop = pop;
		ui.size = size;
		ui.current = current;

		return ui;

	}

	APP_ui.stacked2Ui = stacked2Ui;

	//
	// STACKED 2 UI -end-
	//

	//
	//
	// SECVAL COMPONENTS -begin-
	//
	//

	APP_ui.secvalGlobal = APP_ui.secvalGlobal || {};
	APP_ui.secvalGlobal.lsPrefixKey = 'APP_ui-secval-key-';
	APP_ui.secvalGlobal.defaultKeyName = 'default';

	/**
	 * @memberOf APP_ui
	 * @param settings
	 */
	function secvalUi(settings) {

		settings = settings || {};

		var ui = APP_ui.templateUi();
		var view$ = ui.view().addClass('secret-input-ui');
		var input$ = $('<input>').addClass('value');
		var secval = '';
		var currentSecval = null;
		var userId = settings.userId || 'anonymous';
		var keyName = settings.keyName || 'secval';
		var message$ = $('<div>').addClass('message');
		var locked = false;

		// APP_base.ls(APP_ui.secvalGlobal.lsPrefixKey + "default", 'd3FAu1T');

		input$.prop('disabled', false);
		view$.append(input$, message$);

		function value(arg0) {
			if (locked) {
				return currentValue;
			}

			if (_.isString(arg0) && arg0.length > 0) {
				try {
					currentSecval = JSON.parse(arg0);
					if (APP_base.decSecval(currentSecval) === false) {
						input$.remove();
						input$ = null;
						view$.addClass('secret-input-ui-locked');
						locked = true;
						currentValue = arg0;
						return currentValue;
					}
					input$.val(currentSecval.value);
				} catch (e) {
					message$.text(e.message);
				}
			}
			currentSecval = currentSecval || {};
			currentSecval.keyName = currentSecval.keyName || keyName;
			currentSecval.value = input$.val();
			APP_base.encSecval(currentSecval);
			if (currentSecval.encValue.length > 0
					|| currentSecval.isEmpty === true) {
				currentSecval.userId = userId;
				return JSON.stringify(currentSecval);
			} else {
				return '';
			}
		}

		ui.value = value;
		ui.test = {
			'input$' : input$,
			'locked' : function() {
				return locked;
			}
		};
		return ui;
	}
	APP_ui.secvalUi = secvalUi;

	//
	// SECRET ADMIN UI
	//

	/**
	 * @memberOf APP_ui
	 * @param settings
	 */
	function secvalAdminUi(settings) {
		var ui = APP_ui.templateUi();
		var view$ = ui.view().addClass('secval-admin-ui').append(
				$('<div>').addClass('title').text(
						APP_ui.secvalGlobal.adminTitle || 'Secval Keys Admin'));

		var table$ = $('<table>');
		var toolbar$ = $('<div>').addClass('toolbar');
		view$.append(toolbar$, table$);

		toolbar$.append(APP_ui.button('refresh', refreshView));
		toolbar$.append(APP_ui.button('new', addNew));
		// toolbar$.append(APP_ui.button('close', close).addClass('close'));

		function refreshView() {
			// read keys
			var nameList = [];
			$
					.each(
							localStorage,
							function(name, v) {
								var parts = name
										.split(APP_ui.secvalGlobal.lsPrefixKey);
								if (_.isString(parts[1])) {
									v = APP_base
											.ls(APP_ui.secvalGlobal.lsPrefixKey
													+ parts[1]);
									nameList.push({
										'name' : parts[1],
										'key' : v
									});
								}
							});
			// update table
			table$.empty();
			$.each(nameList, function(i, e) {
				var td1$ = $('<td>').addClass('name').text(e.name);
				var td2$ = $('<td>').addClass('value');
				var input$ = APP_ui.input();
				var save$ = APP_ui.button('save', function() {
					APP_base.ls(APP_ui.secvalGlobal.lsPrefixKey + e.name,
							input$.val());
					refreshView();
				});
				var delete$ = APP_ui.button('delete',
						function() {
							APP_base.ls(APP_ui.secvalGlobal.lsPrefixKey
									+ e.name, null);
							refreshView();
						});
				table$.append($('<tr>').append(td1$, td2$.append(input$),
						$('<td>').append(save$, delete$)));
				input$.val(e.key);
			});
		}

		function addNew() {

			var td1$ = $('<td>').addClass('name');
			var td2$ = $('<td>').addClass('value');
			var inputKey$ = APP_ui.input().attr('placeholder', 'key');
			var input$ = APP_ui.input().attr('placeholder', 'value');
			var add$ = APP_ui.button('add', function() {
				APP_base.ls(APP_ui.secvalGlobal.lsPrefixKey + inputKey$.val(),
						input$.val());
				refreshView();
			});

			table$.append($('<tr>').addClass('new').append(
					td1$.append(inputKey$), td2$.append(input$),
					$('<td>').append(add$)));
		}

		function close() {
			ui.remove();
		}

		refreshView();
		return ui;
	}

	APP_ui.secvalAdminUi = secvalAdminUi;

	//
	//
	// SECVAL COMPONENTS -end-
	//
	//

	//
	// LOGGER UI -begin-
	//

	function loggerUi(settings) {
		settings = settings || {};

		var newInstance = settings.newInstance || false;
		if (newInstance === false && _.isObject(loggerUi.instance)) {
			return loggerUi.instance;
		}
		var ui = APP_ui.templateUi(), logEntryHolder$ = $('<div>');
		var logLevel = settings.logLevel || loggerUi.infoLevel;
		var removeBt$ = APP_ui.button('remove', function() {
			ui.view().remove();
		}).addClass('size-bt');
		var cleanBt$ = APP_ui.button('clean', function() {
			logEntryHolder$.empty();
		}).addClass('clean-bt');

		ui.view().addClass('logger-ui').append(
				$('<div>').addClass('buttons').append(cleanBt$, removeBt$),
				logEntryHolder$).click(function() {
			ui.view().toggleClass('large');
			return false;
		});

		ui.debug = debug;
		ui.info = info;
		ui.warn = warn;
		ui.error = error;

		APP_base.logger.logFn(baseLoggerFn);

		loggerUi.instance = ui;

		ui.view().appendTo($('body'));
		return ui;

		function baseLoggerFn(levelName, array) {
			log(loggerUi.levelMap[levelName] || 100, array[0]);
		}

		function log(level, text) {
			if (level >= logLevel) {
				logEntryHolder$.prepend($('<div>').text(text).addClass(
						'log-entry-' + level + ' log-entry'));
			}
		}

		function debug(t) {
			log(loggerUi.debugLevel, t);
		}
		function info(t) {
			log(loggerUi.infoLevel, t);
		}
		function warn(t) {
			log(loggerUi.warnLevel, t);
		}
		function error(t) {
			log(loggerUi.errorLevel, t);
		}

	}

	loggerUi.debugLevel = 100;
	loggerUi.infoLevel = 200;
	loggerUi.warnLevel = 300;
	loggerUi.errorLevel = 400;
	loggerUi.levelMap = {
		'debug' : 100,
		'info' : 200,
		'warn' : 300,
		'error' : 400
	};
	APP_ui.loggerUi = loggerUi;

	//
	// LOGGER UI -end-
	//

	//
	// UI TYPE FN
	//

	function uiTypeFn(arg0, editable) {
		var fn = editable ? APP_ui.inputUi : APP_ui.divUi;
		if (_.isString(arg0)) {
			fn = APP_base.findFunction(arg0, fn);
		}
		if (_.isObject(arg0)) {
			fn = APP_base.findFunction(arg0.fn, fn);
			return function(settings) {
				return fn(arg0);
			};
		}
		return fn;
	}

	APP_ui.uiTypeFn = uiTypeFn;

	//
	// UI TYPE FN
	//

	//
	// DATE PICKER UI -begin-
	//

	/**
	 * For for 'displayFormat' and 'valueFormat' use the tokens as in:
	 * http://momentjs.com/docs/#/displaying/
	 */
	function datePickerUi(settings) {

		settings = settings || {};
		var ui = APP_ui.templateUi();
		var view$ = ui.view().addClass('date-picker-ui');
		var input$ = $('<input>').appendTo(view$);
		var displayFormat = settings.displayFormat || 'yy-mm-dd';
		var valueFormat = settings.valueFormat || 'YYYY-MM-DD';

		_datepicker({
			showWeek : true,
			firstDay : 1
		});

		if (displayFormat) {
			_datepicker('option', 'dateFormat', displayFormat);
		}

		ui.value = value;

		return ui;

		function _datepicker() {
			if (_.isFunction(input$.datepicker)) {
				return input$.datepicker.apply(input$, arguments);
			}
		}

		function value(arg0) {
			var v, m;
			if (arg0 !== undefined) {
				m = moment(arg0, valueFormat);
				_datepicker('setDate', new Date(1 * m.format('x')));
			}

			var currentDate = _datepicker("getDate") || new Date();

			return moment(currentDate).format(valueFormat);
		}
	}

	APP_ui.datePickerUi = datePickerUi;

	//
	// DATE PICKER UI -end-
	//

	//
	// DATE TIME PICKER UI -begin-
	//

	/**
	 * For for 'displayFormat' and 'valueFormat' use the tokens as in:
	 */
	function dateTimePickerUi(settings) {

		settings = settings || {};
		var ui = APP_ui.templateUi();
		var view$ = ui.view().addClass('date-picker-ui');
		var input$ = $('<input>').appendTo(view$);
		var displayFormat = settings.displayFormat || 'Y-m-d H:i';
		var valueFormat = settings.valueFormat || 'YYYY-MM-DD';

		_datetimepicker({
			'format' : displayFormat,
			'step' : 15
		});

		ui.value = value;

		return ui;

		function _datetimepicker() {
			if (_.isFunction(input$.datetimepicker)) {
				return input$.datetimepicker.apply(input$, arguments);
			}
		}

		function value(arg0) {
			var v, d;
			if (arg0 !== undefined) {
				arg0 = +arg0;
				if (_.isNumber(arg0)) {
					d = new Date(arg0);
				} else {
					d = new Date();
				}
				_datetimepicker({
					'value' : d
				});
			}

			var currentDate = input$.val();
			d = Date.parse(currentDate);
			return d;
		}
	}

	APP_ui.dateTimePickerUi = dateTimePickerUi;

	//
	// DATE TIME PICKER UI -end-
	//

	//
	// DATE TIME UI -begin-
	//

	function dateTimeUi(settings) {
		settings = settings || {};
		var ui = APP_ui.templateUi();
		var view$ = ui.view().addClass('calendar-ui');
		var calendar$;
		var hour$;
		var min$;
		var valueType = settings.valueType;

		calendar$ = $('<input>', {
			type : 'text'
		}).appendTo(view$);

		enhance(true);

		ui.editable = editable;

		editable(settings.editable);
		ui.value = value;

		return ui;

		function enhance(b) {
			if (_.isFunction(calendar$.datepicker)) {
				if (b === true) {
					calendar$.datepicker({
						showWeek : true,
						firstDay : 1,
						dateFormat : 'yy-mm-dd',
						'data-role' : 'none'
					});
				} else {
					calendar$.datepicker('destroy');
				}
			}
		}

		function value(arg0) {
			var d, val, isodate;
			if (arg0 === undefined) {
				val = calendar$.val();
				if (valueType === 'ms') {
					d = new Date(val);
					return '' + d.getTime();
				}
				return val;
			} else {
				if (valueType === 'ms') {
					isodate = APP_base.toIsoDate(arg0);
				} else {
					isodate = arg0;
				}
				return calendar$.val(isodate);
			}
		}

		function editable(arg0) {
			if (_.isBoolean(arg0)) {
				calendar$.prop('disabled', !arg0);
				enhance(arg0);
			}
			return !calendar$.prop('disabled');
		}
	}
	APP_ui.calendarUi = dateTimeUi;
	APP_ui.dateTimeUi = dateTimeUi;

	//
	// BOOLEAN UI -begin-
	//

	function booleanUi(settings) {
		settings = settings || {};
		var ui = APP_ui.templateUi(), checkbox$, span$;
		ui.view().addClass('boolean-ui');

		editable(settings.editable);
		value(settings.value);
		ui.value = value;
		ui.editable = editable;
		return ui;

		function value(arg0) {
			var bool = false;
			if (arg0 !== undefined) {
				if (_.isString(arg0)) {
					arg0 = arg0.toLowerCase();
					if (arg0 === 'true' || arg0 === 't' || arg0 === 'yes'
							|| arg0 === 'y' || arg0 === 'on') {
						bool = true;
					}
					if (_.isNumber(arg0) && arg0 > 0) {
						bool = true;
					}
				}
				_value(bool);
			}
			return checkbox$ ? '' + checkbox$.prop('checked') : (span$ ? span$
					.text() : '');
		}

		function editable(e) {
			var currentValue = value();
			ui.view().empty();
			checkbox$ = span$ = null;
			if (e) {
				checkbox$ = $('<input>', {
					'type' : 'checkbox'
				}).appendTo(ui.view());
			} else {
				span$ = $('<span>').appendTo(ui.view());
			}
			value(currentValue);
		}

		function _value(bool) {
			ui.view().removeClass('true').removeClass('false').addClass(
					'' + bool);
			if (checkbox$) {
				checkbox$.prop('checked', bool);
			} else {
				span$.text('' + bool);
			}
		}

	}

	APP_ui.booleanUi = booleanUi;

	//
	// BOOLEAN UI -end-
	//

	//
	// STRING UI -begin-
	//

	function stringUi(settings) {
		var ui = APP_ui.templateUi(), input$, span$;
		ui.view().addClass('string-ui');

		editable(settings.editable);
		value(settings.value);
		ui.value = value;
		ui.editable = editable;
		return ui;

		function value(arg0) {
			var c$ = input$ || span$;
			if (c$ && arg0 !== undefined) {
				c$.val(arg0 + '');
			}
			return c$ ? c$.val() : undefined;
		}

		function editable(e) {
			var currentValue = value();
			ui.view().empty();
			input$ = span$ = null;
			if (e) {
				input$ = $('<input>').appendTo(ui.view());
			} else {
				span$ = $('<span>').appendTo(ui.view());
				span$.val = span$.text;
			}
			value(currentValue);
		}

	}

	APP_ui.stringUi = stringUi;

	//
	// STRING UI -end-
	//

	//
	// ICON BUTTON UI
	//

	function iconButtonUi(settings, actionFn) {

		settings = settings || {};

		var ui = APP_ui.templateUi();
		var view$ = ui.view();
		var title = settings.title || settings.description || settings.label
				|| settings.name;
		view$.addClass('icon-button-ui');
		view$.addClass('icon-button-ui-'
				+ (settings.name || settings.labelId || settings.label));
		if (_.isFunction(actionFn)) {
			view$.click(actionFn);
		}
		if (title) {
			ui.view().attr('title', title);
		}

		ui.action = action;

		function action(arg0) {
			if (_.isFunction(arg0)) {
				view$.click(arg0);
			} else {
				ui.view().click();
			}
		}
		return ui;
	}

	APP_ui.iconButtonUi = iconButtonUi;

	//
	// FILE AREA UI -start-
	//

	/**
	 * @memberOf APP_ui
	 */
	function fileAreaUi(settings) {

		settings = settings || {};

		var ui = APP_ui.templateUi();
		var view$ = ui.view();
		var header$, body$, dropFilesHere$, userMessageUi, userMessageHideId;
		var containerSarray = APP_base.sArray();
		// upload
		var uploadServiceId = settings.uploadServiceId;
		var uploadParameters = settings.uploadParameters || {};
		var uploadBegin = settings.uploadBegin;
		var uploadEnd = settings.uploadEnd;

		var previewUrl = APP_base.findFunction(settings.previewUrl,
				APP_data.previewUrl);

		var openFile = APP_base
				.findFunction(settings.openFile, APP_ui.openFile);

		var moveFile = APP_base.findFunction(settings.moveFile);

		var uploadOn = _.isString(uploadServiceId);

		var uploadFileTestFn;

		view$.addClass('file-area-ui');
		if (!uploadOn) {
			view$.addClass('view-only');
		}

		uploadFileTestFn = _.isFunction(settings.uploadFileTest) ? settings.uploadFileTest
				: uploadFileTest;

		deleteFileCb = settings.deleteFile;

		header$ = $('<div>', {
			'class' : 'file-area-header'
		});
		body$ = $('<div>', {
			'class' : 'file-area-body'
		});

		// dropFilesHere$
		dropFilesHere$ = APP_ui.div().text(
				settings.dropFileHereLabel || 'Please drop files here.')
				.addClass('file-area-ui-drop-files-here');
		// userMessageUi
		userMessageUi = APP_ui.templateUi();
		userMessageUi.view().addClass('file-area-ui-message-box').hide();
		userMessageUi.text = function(text) {
			if (userMessageHideId) {
				window.clearTimeout(userMessageHideId);
			}
			userMessageUi.view().empty().text(text);
			userMessageUi.view().show();
			userMessageHideId = window.setTimeout(function() {
				userMessageUi.view().hide('slow');
			}, 4000);
		};

		// append all
		view$.append(header$, body$, userMessageUi.view());

		ui.addFile = addFile;
		ui.data = data;
		ui.refresh = refresh;
		ui.message = userMessageUi.text;

		ui.body = function() {
			return body$;
		};

		if (uploadOn) {
			initDnd(view$);
		}

		checkDropFilesHere();
		enhanceBody();
		refresh();
		return ui;

		function refresh() {
			if (_.isString(settings.serviceId)) {
				var parameters = APP_base.findObject(settings.parameters, {});
				rQ.call(settings.serviceId, parameters, ui.data);
			}
		}

		function enhanceBody() {

			if (_.isFunction(body$.sortable) && _.isFunction(moveFile)) {
				body$.sortable({
					// revert : true
					helper : 'clone',
					update : function(event, ui) {
						var list, fileInfoItem = ui.item.data('fileInfo');
						var i, newOrd = undefined;

						if (_.isFunction(moveFileCb)) {
							list = docuInfoList();
							for (i = 0; i < list.length; i++) {
								if (list[i].fileTid === fileInfoItem.fileTid) {
									newOrd = i + 1;
									break;
								}
							}
							moveFileCb.apply(this,
									[ list, fileInfoItem, newOrd ]);
						}
						checkDropFilesHere();
					},
					receive : function(event, ui) {
						var list = [];
						if (_.isFunction(moveFileCb)) {
							list = docuInfoList();
							moveFileCb.apply(this, [ list ]);
						}
					}
				}

				);
				// DEV
				// body$.disableSelection();
			}
		}

		function docuInfoList() {
			var list = [];
			$.each(body$.children(), function(i, e) {
				var fileInfo = $(e).data('fileInfo');
				if (_.isObject(fileInfo)) {
					list.push(fileInfo);
				}
			});
			return list;
		}

		function data(serviceData) {
			var fileList = rQ.toList(serviceData);
			body$.empty();
			containerSarray = APP_base.sArray();
			$.each(fileList, addFile);
			enhanceBody();
			checkDropFilesHere();
		}

		function addFile(index, fileInfo) {

			fileInfo = fileInfo || index;

			var t, link$, fileContainer$, front$, previewImg$, footer$;

			var label = fileInfo.filename;

			fileContainer$ = $('<div>').addClass(
					'file-container ' + settings.fileContainerClass);

			link$ = $('<a>', {
				'href' : '#'
			}).addClass('open-file').click(function() {
				openFile(fileInfo);
			});

			previewImg$ = createPreviewImg(fileInfo, function(isLandscape) {
				setOrientation(previewImg$, isLandscape);
			});

			fileContainer$.data('ord', fileInfo.ord || -1);
			fileContainer$.data('fileInfo', fileInfo);
			containerSarray.put(fileInfo.fileTid, fileContainer$);

			link$.append(previewImg$);
			footer$ = $('<div>').addClass('front-footer');
			footer$.append($('<div>').addClass('filename').text(label).attr(
					'title', label));

			if (_.isFunction(settings.footerRenderer)) {
				// FOOTER RENTERER
				settings.footerRenderer(fileContainer$, footer$, fileInfo);
			}

			front$ = $('<div>').addClass('front');
			front$.append(link$, footer$);

			fileContainer$.append(front$);

			body$.append(fileContainer$);

			checkDropFilesHere();

			function setOrientation(element$, isLandscape) {
				if (element$) {
					element$.removeClass('landscape');
					element$.removeClass('portrait');
					element$.addClass(isLandscape ? 'landscape' : 'portrait');
				}
			}

		}

		function checkDropFilesHere() {
			if (body$.children().length == 0 && uploadOn) {
				dropFilesHere$.show();
			} else {
				dropFilesHere$.hide();
			}
		}

		function createPreviewImg(file, isLandscape) {
			var img$, timeoutId, url = previewUrl(file);
			if (url === null) {
				img$ = $('<i>').addClass('fa fa-file-o');
			} else {
				img$ = $('<img>', {
					'src' : url
				});
				timeoutId = window.setTimeout(function() {
					processPreviewImgLoad(img$, isLandscape);
				}, 5000);

				img$.one('load', function() {
					window.clearTimeout(timeoutId);
					processPreviewImgLoad(img$, isLandscape);
				});
			}
			return img$.addClass('file-preview');
		}

		function processPreviewImgLoad(img$, isLandscapeFn) {
			isLandscapeFn(img$[0].width > img$[0].height);
		}

		function uploadFileTest(file) {
			if (file.type !== 'application/pdf') {
				userMessageUi.text('Skipping non pdf files! (' + file.name
						+ ')');
				return false;
			}
			if (file.size > 50000000) {
				userMessageUi.text('Skipping files that are to large!');
				return false;
			}
			return true;
		}

		function initDnd() {

			var ord;
			var currentFiles;

			var progressMap = [];
			var settings = {
				'test' : uploadFileTestFn,
				'end' : function(uploadResult, event) {
					if (_.isFunction(uploadEnd)) {
						uploadEnd.apply(this, arguments);
					}
					view$.find('.file-container-ondrag').removeClass(
							'file-container-ondrag');
					refresh.apply(this, arguments);
					userMessageUi.text('Done');
					userMessageUi.hide();
					APP_base.logger.log('end:');
				},
				'begin' : function(files, event) {
					progressMap = [];
					var targetContainer$ = body$;

					var x = event.originalEvent.pageX;
					var y = event.originalEvent.pageY;
					currentFiles = files;
					if (currentFiles.length === 0) {
						userMessageUi.hide();
						return;
					}
					userMessageUi.text('Start: ' + currentFiles.length
							+ ' file(s).');
					ord = undefined;
					APP_base.logger.log('Event position: (' + x + ', ' + y
							+ ')');
					$.each(containerSarray.list(), function(index, container$) {

						var offset = container$.offset();
						var left = offset.left;
						var top = offset.top;
						var height = container$.height();
						var width = container$.width();
						var isOkH = false;
						var isOkW = false;
						if (y >= top && y <= (top + height)) {
							isOkH = true;
						}

						if (x >= left && x <= (left + width)) {
							isOkW = true;
						}

						if (isOkH && isOkW) {
							targetContainer$ = container$;
							ord = targetContainer$.data('ord');
						}

					});
					targetContainer$.addClass('file-container-ondrag');
					body$.find('div.drop-files-here').addClass(
							'file-container-ondrag');
					userMessageUi.hide();
					APP_base.logger.log('start');

				},
				'progress' : function(e, file, index) {
					if (true === progressMap[index]) {
						userMessageUi.text('Still progressing ... ');
						return;
					}
					progressMap[index] = true;
					userMessageUi.text('Uploading : ' + file.name + ' ('
							+ (index + 1) + ' of ' + currentFiles.length + ')');
					APP_base.logger.log('progress:' + file.name);
				},
				'serviceId' : uploadServiceId,
				'parameters' : function() {
					var p = $.extend({}, uploadParameters, {
						'ord' : ord
					});
					return p;
				}
			};

			APP_ui.dndDocumentUpload(view$, settings);
		}
	}

	APP_ui.fileAreaUi = fileAreaUi;

	//
	// FILE AREA UI -end-
	//

})();

//
//
// suggestion: action fn, addAction, aEvent with adef, value, data, ui,
//
// -------------
// ANAKAPA VIEWS
// -------------
//

(function() {

	var FILTER_POSTFIX = 'Filter';

	var logger = (function() {
		return {
			'debug' : dummy,
			'info' : dummy,
			'warn' : dummy,
			'error' : dummy
		};
		function dummy() {
		}

	})();
	//
	//
	// LOGGER FUNCTION
	//
	//

	//
	//
	// COMPONENT TT UI
	//
	//

	//
	// LOG UI
	//

	function logUi() {

		var ui = APP_ui.templateUi();
		var view$ = ui.view();
		return ui;
	}
	APP_ui.logUi = logUi;

	//
	// ANAKAPA VIEW UI
	//
	// arg0 is start name or initial action
	function anakapaViewUi(arg0, settings) {

		settings = settings || {};

		var L = settings.L || APP_data.getLabel;
		var D = settings.D || APP_data.getDescription;

		var defMap, serviceFn, rootUi, logUi, stackedUi, dialogUi, doneFn;

		defMap = settings.defMap;
		serviceFn = APP_base.findFunction(settings.serviceFn, rQ.call);

		rootUi = APP_ui.templateUi();
		rootUi.view().addClass('app-ui-av');
		logUi = APP_ui.logUi();
		stackedUi = APP_ui.stackedUi();
		dialogUi = APP_ui.templateUi();
		dialogUi.view().addClass('app-ui-av-dialog');

		rootUi.view().append(logUi.view(), stackedUi.view(), dialogUi.view());

		if (_.isNumber(settings.logLevel)) {
			logger = APP_ui.loggerUi({
				'logLevel' : settings.logLevel
			});
		}

		if (_.isString(arg0)) {
			logger.info('anakapaViewUi ' + arg0);
			logger.debug('init forward to ' + arg0);
			forward(arg0);
		} else {
			processAction(arg0, true);
		}
		//
		// rootUi.tt3Controller = {
		//
		// };

		rootUi.done = done;
		rootUi.processAction = processAction;
		rootUi.forward = forward;

		return rootUi;

		function done(arg0) {
			if (_.isFunction(arg0)) {
				doneFn = arg0;
				return;
			}
			if (_.isFunction(doneFn)) {
				doneFn.apply(this, arguments);
			}
		}

		function forward(name, value, data) {

			var i, actions, action, uiDef, ttUi, ttUiHeader, actions;
			uiDef = defMap[name];

			if (!_.isObject(uiDef)) {
				alert('No definition found for : ' + name);
				return;
			}

			var ttUiFn = APP_base.findFunction(uiDef.uiType);
			if (!_.isFunction(ttUiFn)) {
				logger.error('Can not find uiType function for '
						+ JSON.stringify(uiDef));
				return;
			}

			ttUi = ttUiFn(uiDef, settings);
			if (!ttUi) {
				logger.error('Can not create uiType ' + JSON.stringify(name));
				return;
			}
			// TODO move to tt3 ui
			actions = uiDef.actions || [];
			for (i = 0; i < actions.length; i++) {
				action = actions[i];
				ttUi.action(action);
			}

			logger.debug('start forward with ' + APP_base.toText(arguments));
			//
			// add callback for the action defs
			//
			ttUi.action(processAction);

			// setting valeu, data and done callback

			ttUi.value(value);
			ttUi.data(data);
			ttUi.done(function(value) {
				var r = stackedUi.pop();
				if (!r) {
					done();
				}
			});

			//
			// ad-hoc header for stackedUi start
			//

			ttUiHeader = APP_ui.templateUi();
			(function() {
				var title$, close$;
				ttUiHeader = APP_ui.templateUi();
				title$ = _.isFunction(ttUi.headerUi) ? ttUi.headerUi().view()
						: $('<h3>').text(L(uiDef)).attr('title', D(uiDef));

				// back (close) button
				close$ = APP_ui.link('', function() {
					stackedUi.pop();
				}).addClass('fa fa-arrow-left back');

				// --- back button ---

				if (stackedUi.length() > 0) {
					ttUiHeader.view().append(close$);
				}

				ttUiHeader.view().addClass('header').append(title$);
				ttUiHeader.show = function() {
					ttUiHeader.view().addClass('show-body');
					ttUiHeader.view().removeClass('hide-body');
					close$.show();
				};
				ttUiHeader.hide = function() {
					ttUiHeader.view().addClass('hide-body');
					ttUiHeader.view().removeClass('show-body');
					close$.hide();
				};
			})();

			//
			// ad-hoc header for stackedUi end
			//

			stackedUi.push(ttUi, ttUiHeader);
		}

		function processAction(aEvent, skipConfirmation) {
			var t, parameters0 = APP_base.findObject(settings.parameters, {});
			var i, serviceFnIntern = serviceFn;
			var ui = aEvent.ui;
			var value = aEvent.value;
			var callback = aEvent.callback;
			// action
			var action = aEvent.action;
			var serviceId = action.serviceId;
			var initParameters = APP_base.findValue(
					action.initParameters || {}, aEvent);
			var parameters = APP_base
					.findValue(action.parameters || {}, aEvent);

			var type = action.forward ? 'forward' : action.type;
			var forwardName = action.forward;
			var confirmation = action.confirmation;
			var confirmationText;
			var valueObject;

			logger.debug('start processAction with ' + APP_base.toText({
				'action' : action,
				'service' : serviceId,
				'value' : value,
				'hasCallback' : !!callback
			}));

			if (_.isString(confirmation) && skipConfirmation !== true) {
				t = L(confirmation);
				confirmationText = APP_base.texting(t, value);
				dialogUi.view().empty().append(
						confirmationUi(confirmationText, function() {
							dialogUi.view().hide('slow', function() {
								//
								// Action will be processed
								//
								processAction(aEvent, true);
							});
							return false;
						}, function() {
							dialogUi.view().hide('slow', function() {
								if (_.isFunction(callback)) {
									//
									// Action cancelled
									//
									callback('Action cancelled.');
								}
							});
							return false;
						}).view());
				dialogUi.view().show('slow');
				return;
			}

			// resolve serviceFn

			serviceFnIntern = APP_base.findFunction(action.serviceFn,
					serviceFnIntern);

			// NEW END

			valueObject = $.extend({}, parameters0, initParameters, value,
					parameters);
			service(serviceId, valueObject, resultFn);

			function resultFn(dataOrObject) {
				var data, continueFlag;
				if (dataOrObject) {
					data = dataOrObject;
				}
				continueFlag = true;

				if (_.isFunction(callback)) {
					continueFlag = callback(data);
				}

				if (continueFlag) {
					switch (type) {
					case 'forward':
						forward(forwardName, valueObject, data, action);
						break;
					case 'update':
						ui.data(data);
						break;
					case 'close':
						ui.done('close');
						break;
					default:
						break;
					}
				}
			}

			function service(serviceId, parameters, cb) {
				if (_.isString(serviceId)) {
					serviceFnIntern(serviceId, parameters, cb);
				} else {
					cb(parameters);
				}
			}

		}

		function confirmationUi(html, yesCb, noCb) {
			var ui = APP_ui.templateUi();
			var text$ = $('<div>').html(html).addClass('confirmation-text');
			var buttons$ = APP_ui.div().addClass('buttons');
			buttons$.append(APP_ui.button(L('yes'), yesCb).addClass(
					'label-name-yes'), APP_ui.button(L('no'), noCb).addClass(
					'label-name-no'));
			ui.view().append(text$, buttons$);
			return ui;
		}

	}
	APP_ui.anakapaViewUi = anakapaViewUi;

	//
	// END CREATE UI
	//

	//
	//
	// FIELDS UI -start-
	//
	// 

	/**
	 * @memberOf APP_ui
	 */
	function fieldsUi(settings) {

		settings = settings || {};

		var L = settings.L || APP_data.getLabel;
		var D = settings.D || APP_data.getDescription;

		// ui
		var gs = APP_ui.gridSupport('div');
		var fieldsui = APP_ui.templateUi();
		var view$ = fieldsui.view().addClass('fields-ui');
		var detailPanel = gs.div().addClass('detail-table-panel');
		var buttonPanel = gs.div().addClass('detail-buttons').hide();
		var messageUi = APP_ui.userMessagesUi();
		var headerUi = APP_ui.templateUi();
		var fieldsHeaderTemplate = L(settings);
		var fields = settings.fields || [];
		var directLinkFun = settings.directLinkFun;
		var uiSections = APP_base.sArray2();
		// value
		var currentValue = {};
		var currentData = {};
		// action
		var actionFn;
		var actions = [];

		view$.append(detailPanel, buttonPanel, messageUi.view());

		table$ = gs.table().addClass('detail-table');

		detailPanel.append(table$);

		fieldsui.value = value;
		fieldsui.data = data;
		fieldsui.cxMap = {};

		headerUi.view().addClass('title').text(fieldsHeaderTemplate);

		fieldsui.headerUi = function() {
			return headerUi;
		};

		fieldsui.action = action;

		$.each(fields, function(index, field) {
			var uiSection = field.uiSection || '', secList;
			secList = uiSections.get(uiSection) || [];
			secList.push(field);
			uiSections.put(uiSection, secList);
		});

		$.each(uiSections.list(), function(i, fields) {
			var sectionName = uiSections.getKeyAt(i);
			var descr = D(sectionName);
			var sec$;
			if (sectionName) {
				var tr$ = gs.row().appendTo(table$);
				tr$.append(sec$ = APP_ui.div(L(sectionName),
						'section-title section-title-' + sectionName));
				APP_ui.addTooltip(sec$, descr);
			}
			$.each(fields, function(index, field) {
				var name, cellValue, td$, tr$, label, descr, map, ui;
				map = {
					'field' : field
				};
				name = field.name;
				cellValue = currentValue[name];
				tr$ = gs.row().appendTo(table$);
				map.tr$ = tr$;
				label = L(field);
				descr = D(field);

				// field.serviceFn = field.serviceFn || settings.serviceFn;

				ui = field.ui || APP_ui.widgetUi(field);
				map.ui = ui;

				tr$.append(td$ = gs.cell().addClass(
						'field-name field-name-' + name).text(label));
				APP_ui.addTooltip(td$, descr);
				tr$.append(gs.cell()
						.addClass('field-value field-value-' + name).append(
								ui.view()));
				fieldsui.cxMap[name] = map;
			});
		});

		return fieldsui;

		/**
		 * @memberOf fieldsUi
		 */
		function action(arg0) {
			if (_.isFunction(arg0)) {
				actionFn = arg0;
			} else if (_.isObject(arg0)) {
				actions.push(arg0);
			}
		}

		function fireAction(aEvent) {
			if (_.isFunction(actionFn)) {
				actionFn(aEvent);
			}
		}

		function value(data) {
			var value = APP_data.firstObject(data);
			var t, cx;
			if (_.isObject(value)) {

				currentValue = _.extend(currentValue || {}, value);
				cx = {
					'row' : currentValue
				};

				$.each(fieldsui.cxMap, function(name, e) {
					var cellValue, visible;
					cellValue = currentValue[name];

					// set value

					if (!_.isUndefined(cellValue)) {
						e.ui.value(cellValue);
					} else {
						e.ui.value('');
					}

					visible = APP_base.bool(APP_base.findValue(e.field.visible,
							cx));

					e.tr$.addClass('visible-' + visible);

				});

				buildActionPanel();
				t = APP_base.texting(fieldsHeaderTemplate, currentValue);
				fieldsui.headerUi().view().html(t);
			}

			// WHY ??
			$.each(fieldsui.cxMap, function(name, e) {
				currentValue[name] = e.ui.value();
			});

			return currentValue;
		}

		function buildActionPanel() {
			var i, action, cx, isEmpty;
			cx = {
				'row' : currentValue
			};
			buttonPanel.empty().hide();
			$.each(actions, function(i, action) {
				var label, actionUiFn, actionUi;
				if (APP_ui.isActionVisible(action, cx)) {
					buttonPanel.show();
					label = L(action);
					actionUiFn = APP_base.findFunction(action.uiType
							|| 'APP_ui.buttonUi');
					actionUi = actionUiFn($.extend({}, action, {
						'label' : label
					}));
					actionUi.action(function(event) {
						messageUi.data('Start with \'' + action.name + '\'.');
						fireAction({
							'event' : event,
							'ui' : fieldsui,
							'action' : action,
							'value' : fieldsui.value(),
							'callback' : function(data) {
								messageUi.data(data);
								if (messageUi.size() > 0) {
									return false;
								} else {
									messageUi.data('\'' + action.name
											+ '\' done.');
								}
								return true;
							}
						});
						return false;
					});

					// button$.addClass('action-name-' + action.name);
					buttonPanel.append(actionUi.view());
				}
			});
			if (_.isFunction(directLinkFun)) {
				buttonPanel.append(APP_ui.link('direct-link', function() {
					directLinkFun({
						'name' : settings.name,
						'value' : value()
					});
				}));
			}

		}

		function data(arg0) {
			value(arg0);
		}

	}

	APP_ui.fieldsUi = fieldsUi;

	//
	// FIELDS UI -end-
	//

	/**
	 * @memberOf localHelperFunctions
	 */
	function addTooltip(e$, text) {
		if (text) {
			e$.attr('title', text).addClass('tooltip-added');
			if (_.isFunction(e$.tooltip)) {
				e$.tooltip();
			}
		}
	}
	APP_ui.addTooltip = addTooltip;

	//
	//
	// TABLE UI -start-
	//
	// 

	/**
	 * @memberOf tableUi
	 */
	function tableUi(settings) {
		settings = settings || {};

		var L = settings.L || APP_data.getLabel;
		var D = settings.D || APP_data.getDescription;
		//
		var tableui = APP_ui.templateUi();
		var i, c, rowSelector = null, messageCb;
		var toolbarUi, main$, view$;
		var fields = _.clone(settings.fields || []);
		var displaySettings = settings.displaySettings || {};
		var hiddenRow = displaySettings.hiddenRow || [];
		// actions
		var rowActions = [];
		var rowSelectAction;
		var refreshAction;
		var actionFn;
		// data
		var currentData;
		var start = 0;
		var currentSelection = {};
		var currentValue = {};
		var keys = [];
		// ui/defs
		var name = settings.name || 'noName';
		var headerTable$, headerTr$, dataTable$;
		var viewDefId = settings.viewDefId || 'noViewDefId';
		var headerUi = APP_ui.templateUi();
		var headerTemplate;
		var gs = APP_ui.gridSupport('div');
		// 
		var filterEditors = [];
		var defaultColWidth = settings.defaultColWidth || 100;
		// editors
		var tableEditors;
		var tableEditable = APP_base.findValue(settings.editable);

		init();

		function init() {

			// we add an additional field to the fields ...
			fields.push({
				'width' : rowActions.length * 60,
				// 'label' : 'actions',
				'cellRenderer' : actionsCellRenderer(rowActions),
				'name' : 'action-column'
			});

			headerTemplate = L(settings);

			headerUi.view().addClass('title').text(headerTemplate);

			// view parts
			view$ = tableui.view().addClass('table-ui').addClass(
					name.split('.').join('-'));
			toolbarUi = tableToolbarUi();

			main$ = $('<div>').addClass('main');
			view$.append(toolbarUi.view(), main$);

			// header table

			headerTable$ = gs.table().addClass('header-table');
			headerTr$ = gs.row().appendTo(headerTable$);

			tableui.action = action;

			//
			// header, field and filter
			//
			$.each(fields, function(index, field) {
				var td$, filterUi;
				var label, label$;
				var asc = true;
				var visible;
				var cx = {
					'field' : field
				};

				if (field.isKey === true) {
					keys.push(field.name);
				}

				td$ = gs.cell();
				visible = APP_base.bool(APP_base.findValue(field.visible, cx));
				td$.addClass('field-name field-name-' + field.name
						+ ' field-column ' + 'field-column-' + field.name
						+ ' visible-' + visible);
				headerTr$.append(td$);

				label = L(field);

				if (field.filter) {
					filterUi = APP_ui.inputUi();
					filterUi.action(refreshSelect);
					filterEditors.push({
						'ui' : filterUi,
						'name' : field.name,
						'filter' : field.filter,
						'type' : field.type
					});
					td$.append(filterUi.view());
				} else {
					td$.append(APP_ui.div().addClass('filter-placeholder'));
				}
				label$ = $('<div>').addClass('label-cell').text(label);
				APP_ui.addTooltip(label$, D(field));

				// sort on click on header
				if (field.name) {
					label$.click(function() {
						if (!_.isUndefined(currentData)) {
							rQ.sortBy(currentData, field.name, asc = !asc);
							populateData(currentData);
						}
					}).addClass('pointer');
				}

				td$.append(label$);
			});

			settings.keys = settings.keys || keys;

			main$.append(headerTable$);

			dataTable$ = gs.table().addClass('data-table');
			main$.append(dataTable$);

		}

		/**
		 * @memberOf tableUi
		 */
		function action(arg0) {
			if (_.isFunction(arg0)) {
				actionFn = arg0;
			} else if (_.isObject(arg0)) {
				if (arg0.source === 'rowSelect') {
					rowSelectAction = arg0;
				} else if (arg0.source === 'row') {
					rowActions.push(arg0);
				} else {
					if (APP_ui.isActionVisible(arg0, {})) {
						toolbarUi.action(arg0);
						if (arg0.type === 'refresh') {
							refreshAction = arg0;
						}
					}
				}
			}
		}

		/**
		 * @memberOf tableUi
		 */
		function showBusy() {
			fireMessage('Search started. Waiting for response...');
			dataTable$.empty().append(APP_ui.busyImage());
		}

		/**
		 * @memberOf tableUi
		 */
		function fireMessage(msg) {
			if (_.isFunction(messageCb)) {
				messageCb(msg);
			}
		}

		/**
		 * @memberOf tableUi
		 */
		function actionsCellRenderer(actions) {

			return commandsCellRenderer;

			function commandsCellRenderer(td$, rowIndex, colIndex, row, field) {
				var div$ = APP_ui.div().addClass('row-actions field-column')
						.appendTo(td$);
				var actionCounter = 0;
				var name = field.name;
				$.each(actions, function(i, action) {
					var label, actionUiFn, actionUi, cx;
					cx = {
						'row' : row
					};
					if (APP_ui.isActionVisible(action, cx)) {
						label = L(action);
						actionUiFn = APP_base.findFunction(action.uiType
								|| 'APP_ui.buttonUi');
						actionUi = actionUiFn($.extend({}, action, {
							'label' : label,
							'buttonType' : 'link'
						}));
						actionUi.action(function(event) {
							fireAction({
								'event' : event,
								'ui' : tableui,
								'action' : action,
								'value' : rowValues(rowIndex, row),
								'callback' : function(data) {
									var list = rQ.toList(data);
									if (action.type === 'rowUpdate') {
										if (list.length > 0) {
											populateRow(td$, rowIndex, name,
													list[0]);
										}
										return false;
									}
									return true;
								}
							});
							return false;
						});
						actionCounter++;
						div$.append(actionUi.view());
					}
				});

			}
		}

		function populateRow(td$, rowIndex, name, row) {

		}

		/**
		 * @memberOf tableUi
		 */
		function populateData(data, trIn$, rowIndexIn, nameIn, rowIn) {
			var t, i, j, row, columnName, cell, cellRenderer, table$, tr$, td$;
			var rowRendererFn;
			var cellRendererFns;
			var rowEditors;
			//
			var columnNames = [];
			var list = rQ.toList(data);

			currentData = data;

			if (list.length === 0) {
				toolbarUi.message(L('noDataFound'));
			} else if (!data.table && data.exception) {
				toolbarUi.message(data.exception);
			} else {

				t = L('found :totalCount'
						+ (true === data.hasMore ? ' (and more). displaying :size'
								: '. displaying :size'));
				t = APP_base.texting(t, data);
				toolbarUi.message(t);
			}

			//
			// row renderer preparation
			//
			rowRendererFn = APP_base.findFunction(settings.rowRenderer,
					defaultRowRenderer);
			//
			// cell renderer preparation
			//
			cellRendererFns = {};
			$.each(fields,
					function(i, field) {
						var cellRendererFn = null;

						columnNames.push(field.name);

						cellRendererFn = APP_base.findFunction(
								field.cellRenderer,
								createDefaultCellRenderer(field));
						cellRendererFns[field.name] = function(td$, rowIndex,
								colIndex) {
							cellRendererFn.apply(this, arguments);
						};

					});
			//
			// NEW
			//

			if (rowIn) {
				tr$ = trIn$;
				rowEditors = [];
				tableEditors[rowIndexIn] = rowEditors;
				rowRendererFn(tr$, rowIndexIn, rowIn, rowEditors);
				for (j = 0; j < columnNames.length; j++) {
					columnName = columnNames[j];
					cell = rowIn[columnName];
					cellRenderer = cellRendererFns[columnName];
					td$ = gs.cell().appendTo(tr$);
					cellRenderer(td$, rowIndexIn, j, rowIn, fields[j],
							rowEditors);
				}
			} else {
				dataTable$.empty();

				tableEditors = [];
				for (i = 0; i < list.length; i++) {
					row = list[i];
					tr$ = gs.row().appendTo(dataTable$);
					rowEditors = [];
					tableEditors.push(rowEditors);
					rowRendererFn(tr$, i, row, rowEditors);
					for (j = 0; j < columnNames.length; j++) {
						columnName = columnNames[j];
						cell = row[columnName];
						cellRenderer = cellRendererFns[columnName];
						td$ = gs.cell().appendTo(tr$);
						cellRenderer(td$, i, j, row, fields[j], rowEditors);
					}
				}
				scrollToSelected(dataTable$);
			}

			//
			// DEFAULT ROW RENDERER
			//

			/**
			 * @memberOf tableUi
			 */
			function defaultRowRenderer(tr$, rowIndex, row, rowEditors) {

				var keyString = APP_base.keyString(row, settings.keys);
				tr$.addClass(rowIndex % 2 == 0 ? 'even' : 'odd');
				tr$.data('rowIndex', rowIndex);
				tr$.data('keyString', keyString);
				if (rowSelectAction) {
					tr$.addClass('row-select-action');
				}
				tr$
						.click(function(event) {
							currentSelectedTr$ = tr$;
							if (_.isFunction(rowSelector)) {
								rowSelector(event, rowIndex, row);
							}
							currentSelection = {
								'tr$' : tr$,
								'rowIndex' : rowIndex,
								'row' : row,
								// 'position' : tr$.position(),
								'keyString' : keyString
							};
							tr$.siblings().removeClass('selected');
							tr$.addClass('selected');
							if (rowSelectAction) {
								logger
										.debug('tableui : start fireAction with rowSelectAction');
								fireAction({
									'event' : event,
									'action' : rowSelectAction,
									'ui' : tableui,
									'value' : rowValues(rowIndex, row)
								});
							}
							return false;
						});

			}

			//
			// CREATE DEFAULT CELL RENDERER
			// 

			/**
			 * @memberOf tableUi
			 */
			function createDefaultCellRenderer(colDef) {

				var uiTypeFn = APP_ui.uiTypeFn(colDef.uiType);

				function defaultCellRenderer(td$, rowIndex, colIndex, row,
						fieldDef, rowEditorList) {

					var ui, name = fieldDef.name, cell = row[name];
					var uidef = _.clone(fieldDef);
					var cx = {
						'row' : row,
						'name' : name
					};
					uidef.editable = APP_base.findValue(
							fieldDef.editable || false, cx);
					var visible = APP_base.bool(APP_base.findValue(
							fieldDef.visible, cx));
					td$
							.addClass('visible-' + visible)
							.addClass(
									'field-value field-value-' + name
											+ ' field-column '
											+ 'field-column-' + name)
							.addClass(
									'type-'
											+ (uidef.editable ? 'edit' : 'view'));
					if (_.isFunction(uiTypeFn)) {
						ui = uiTypeFn(uidef, row);
						ui.value(cell);
						td$.append(ui.view());
						rowEditorList.push({
							'name' : name,
							'ui' : ui
						});
						return;
					}

				}
				return defaultCellRenderer;
			}

			/**
			 * @memberOf tableUi populateData
			 */

			function scrollToSelected(dataTable$) {
				var i, tr$, trs;
				var rowIndex, keyString;

				// has to be redone
				return;
				trs = dataTable$.find('grid-row');
				keyString = currentSelection.keyString;
				//
				//
				//
				for (i = 0; i < trs.length; i++) {
					tr$ = $(trs[i]);
					if (keyString !== '' && tr$.data('keyString') === keyString) {
						scrollDiv$.scrollTo(tr$.addClass('selected'), 800);
						return;
					}
				}
				//
				//
				//
				for (i = 0; i < trs.length; i++) {
					tr$ = $(trs[i]);
					rowIndex = tr$.data('rowIndex');
					if (currentSelection.rowIndex === rowIndex) {
						scrollDiv$.scrollTo(tr$.addClass('selected'), 800);
						break;
					}
				}
			}

		}
		// end of populateData

		/**
		 * @memberOf tableUi
		 */
		function rowValues(rowIndex, row) {
			var i, ce;
			var rowEditors = tableEditors[rowIndex];
			var value = $.extend({}, filterValues(), currentValue, row);
			for (i = 0; i < rowEditors.length; i++) {
				ce = rowEditors[i];
				value[ce.name] = ce.ui.value();
			}
			return value;
		}

		/**
		 * @memberOf tableUi
		 */
		function filterValues() {
			var values = {};
			$.each(filterEditors, function(index, filterUi) {
				var ui = filterUi.ui;
				var name = filterUi.name;
				var value = ui.value();
				if (filterUi.filter === 'startWith'
						&& filterUi.type !== 'numeric') {
					value = (value || '') + '%';
				}
				if (value) {
					values[name + FILTER_POSTFIX] = value;
				}
			});
			return values;
		}

		/**
		 * @memberOf tableUi
		 */
		function refreshSelect(e) {
			var code;
			if (e) {
				code = (e.keyCode ? e.keyCode : e.which);
			} else {
				code = 13;
			}
			if (code == 13) {
				doRefresh();
			}
		}

		/**
		 * @memberOf tableUi
		 */
		function doRefresh(cbDone) {
			var values = $.extend(currentValue, filterValues());

			if (_.isObject(refreshAction)) {
				showBusy();
				fireAction({
					'action' : refreshAction,
					'ui' : tableui,
					'value' : values,
					'callback' : function(data) {
						populateData(data);
						if (_.isFunction(cbDone)) {
							cbDone();
						}
						return false;
					}
				});
			} else {
				alert('-no refresh action-');
			}
			return false;
		}

		function fireAction(aEvent) {
			if (_.isFunction(actionFn)) {
				actionFn(aEvent);
			}
		}

		/**
		 * @memberOf tableUi
		 */
		function tableToolbarUi(settings) {
			settings = settings || {};
			var ui = APP_ui.templateUi();
			var view$ = ui.view().addClass('toolbar-ui');
			var commandBar$ = $('<div>').addClass('table-actions actions');
			var message$ = $('<div>').addClass('message');
			var title$;
			ui.actionDefs = [];

			title$ = $('<div>', {
				'text' : settings.title || ''
			}).addClass('title');

			view$.append(title$, commandBar$, message$);

			ui.title = title;
			ui.message = message;
			ui.action = action;
			ui.removeCommands = removeCommands;

			return ui;

			function removeCommands() {
				commandBar$.empty();
				ui.actionDefs = [];
			}

			function action(action) {
				var i, button$;

				if (action.name === 'refresh') {
					button$ = APP_ui.button(L(action), doRefresh);
					button$.addClass('action-name-' + action.name);
					// window.setTimeout(function() {
					// button$.click();
					// }, 10);
				} else {
					button$ = APP_ui.button(L(action), function(event) {
						fireAction({
							'event' : event,
							'action' : action,
							'ui' : tableui,
							'value' : currentValue
						});
						return false;
					});
					button$.addClass('action-name-' + action.name);
				}
				commandBar$.append(button$);

			}

			function title(arg0) {
				if (_.isString(arg0)) {
					title$.text(arg0);
				}
				return title$.text();
			}

			function message(arg0) {
				if (_.isString(arg0)) {
					title$.text(arg0);
				}
				return message$.text();
			}

		}

		tableui.show = function() {
			doRefresh();
			tableui.view().show();
		};

		tableui.data = function(arg0) {
			if (_.isObject(arg0)) {
				populateData(arg0);
			}
		};

		tableui.value = function(arg0) {
			if (_.isObject(arg0)) {
				currentValue = arg0;
				// filter
				$.each(filterEditors, function(i, fui) {
					var name = fui.name;
					var value = arg0[name];
					if (fui.ui && fui.ui.value) {
						fui.ui.value(value);
					}
				});
				// headerUi
				this.headerUi().view().html(
						APP_base.texting(headerTemplate, currentValue));
			}
		};

		tableui.headerUi = function() {
			return headerUi;
		};

		return tableui;

	}
	APP_ui.tableUi = tableUi;

	//
	// TABLE UI -end-
	//

	//
	//
	// SOME UTILITY FUNCTION FOR TT3
	//
	//

	//
	// IS ACTION VISIBLE -start-
	//

	function isActionVisible(action, cx) {
		if (!_.isObject(action)) {
			return false;
		}
		return !!APP_base.findValue(action.visible || true, cx);
	}

	APP_ui.isActionVisible = isActionVisible;

	//
	// LITTLE GRID
	//

	function littleServiceDataUi(settings) {
		settings = settings || {};
		var ui, view$, fields, header = [], editable, table$, toolbar$, gs, L, D, editors = [];
		editable = settings.editable;
		L = settings.L || APP_data.getLabel;
		D = settings.D || APP_data.getDescription;
		ui = APP_ui.templateUi();
		view$ = ui.view().addClass('ui-little-service-data');
		gs = APP_ui.gridSupport();
		table$ = gs.table();
		toolbar$ = APP_ui.div('', 'toolbar');
		if (editable) {
			toolbar$.append(APP_ui.button(L('add'), function() {
				_addEntryRow({});
			}));
		}
		view$.append(table$, toolbar$);

		fields = settings.fields;
		_.each(fields, function(e, i) {
			header.push(e.name);
		});

		if (editable) {
			data({
				'header' : header,
				'table' : []
			});
		}
		ui.value = value;
		return ui;

		function value(arg0) {
			var serviceData;
			if (!_.isUndefined(arg0)) {
				if (_.isString(arg0)) {
					try {
						serviceData = JSON.parse(arg0);

					} catch (e) {

					}
				} else if (_.isObject(arg0)) {
					serviceData = arg0;
				}
				if (_.isObject(serviceData)) {
					data(serviceData);
				}

			}
			return serialize();
		}

		function data(serviceData) {
			var list, tr$, editorRow;
			header = serviceData.header || header;
			list = rQ.toList(serviceData);
			// header
			tr$ = gs.row().addClass('header');
			table$.empty().append(tr$);
			_.each(header, function(h, i) {
				tr$.append(gs.cell().addClass('field-column field-column-' + h)
						.text(L(h)));
			});
			//
			_.each(list, function(e, i) {
				_addEntryRow(e);
			});
		}

		function _addEntryRow(e) {
			var editorRow = {}, position;
			var tr$ = gs.row();
			table$.append(tr$);
			editors.push(editorRow);
			position = editors.length - 1;
			_.each(header, function(h, i) {
				var td$, uiTypeFn, editor;
				td$ = gs.cell().addClass('field-column-' + h).appendTo(tr$);
				uiTypeFn = APP_ui.uiTypeFn(fields[i].uiType, editable), editor;
				editor = uiTypeFn();
				editorRow[h] = editor;
				td$.append(editor.view());
				editor.value(e[h]);
			});
			if (editable) {

				tr$.append(APP_ui.button(L('del'), function() {
					editors[position] = null;
					tr$.remove();
				}));
			}
		}

		function serialize() {
			var sd = {
				'header' : header,
				'table' : []
			};
			_.each(editors, function(editorRow, i) {
				var row = [];
				if (_.isObject(editorRow)) {
					sd.table.push(row);
					_.each(header, function(h, i) {
						row.push(editorRow[h].value());
					});
				}
			});
			return JSON.stringify(sd);
		}
	}
	APP_ui.littleServiceDataUi = littleServiceDataUi;

	//
	// DOWNLOAD FILE CELL RENDERER
	//

	function downloadFileCellRenderer(td$, rowIndex, colIndex, row, fieldDef,
			rowEditorList) {

		var name, cx, visible, url, a$, label, file;
		name = fieldDef.name;
		cx = {
			'row' : row,
			'name' : name
		};
		visible = APP_base.bool(APP_base.findValue(fieldDef.visible, cx));
		td$.addClass('visible-' + visible).addClass(
				'field-value field-value-' + name + ' field-column '
						+ 'field-column-' + name);

		file = row;
		label = file.label || file.filename + ' (' + file.fileTid + ')';
		url = 'docu/sha/' + file.fileTid + '/' + file.filename;
		a$ = $('<a>', {
			'href' : url,
			'target' : 'File-' + file.fileTid
		}).text(label);
		a$.click(function(e) {
			e.stopPropagation();
		});
		td$.append(a$.css({
			'text-decoration' : 'none',
			'color' : '#1674FF'
		}));
	}

	APP_ui.downloadFileCellRenderer = downloadFileCellRenderer;

})();
