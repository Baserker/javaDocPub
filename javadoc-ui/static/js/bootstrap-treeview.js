;(function ($, window, document, undefined) {
    'use strict';
    var pluginName = 'treeview';
    var _default = {};
    _default.settings = {
        injectStyle: true,
        levels: 2,
        expandIcon: 'glyphicon glyphicon-plus',
        collapseIcon: 'glyphicon glyphicon-minus',
        emptyIcon: 'glyphicon',
        nodeIcon: '',
        selectedIcon: '',
        checkedIcon: 'glyphicon glyphicon-check',
        uncheckedIcon: 'glyphicon glyphicon-unchecked',
        color: undefined,
        backColor: undefined,
        borderColor: undefined,
        onhoverColor: '#F5F5F5',
        selectedColor: '#FFFFFF',
        selectedBackColor: '#428bca',
        searchResultColor: '#D9534F',
        searchResultBackColor: undefined,
        enableLinks: false,
        highlightSelected: true,
        highlightSearchResults: true,
        showBorder: true,
        showIcon: true,
        showCheckbox: false,
        showTags: false,
        multiSelect: false,
        onNodeChecked: undefined,
        onNodeCollapsed: undefined,
        onNodeDisabled: undefined,
        onNodeEnabled: undefined,
        onNodeExpanded: undefined,
        onNodeSelected: undefined,
        onNodeUnchecked: undefined,
        onNodeUnselected: undefined,
        onSearchComplete: undefined,
        onSearchCleared: undefined
    };
    _default.options = {silent: false, ignoreChildren: false};
    _default.searchOptions = {ignoreCase: true, exactMatch: false, revealResults: true};
    var Tree = function (element, options) {
        this.$element = $(element);
        this.elementId = element.id;
        this.styleId = this.elementId + '-style';
        this.init(options);
        return {
            options: this.options,
            init: $.proxy(this.init, this),
            remove: $.proxy(this.remove, this),
            getNode: $.proxy(this.getNode, this),
            getParent: $.proxy(this.getParent, this),
            getSiblings: $.proxy(this.getSiblings, this),
            getSelected: $.proxy(this.getSelected, this),
            getUnselected: $.proxy(this.getUnselected, this),
            getExpanded: $.proxy(this.getExpanded, this),
            getCollapsed: $.proxy(this.getCollapsed, this),
            getChecked: $.proxy(this.getChecked, this),
            getUnchecked: $.proxy(this.getUnchecked, this),
            getDisabled: $.proxy(this.getDisabled, this),
            getEnabled: $.proxy(this.getEnabled, this),
            selectNode: $.proxy(this.selectNode, this),
            unselectNode: $.proxy(this.unselectNode, this),
            toggleNodeSelected: $.proxy(this.toggleNodeSelected, this),
            collapseAll: $.proxy(this.collapseAll, this),
            collapseNode: $.proxy(this.collapseNode, this),
            expandAll: $.proxy(this.expandAll, this),
            expandNode: $.proxy(this.expandNode, this),
            toggleNodeExpanded: $.proxy(this.toggleNodeExpanded, this),
            revealNode: $.proxy(this.revealNode, this),
            checkAll: $.proxy(this.checkAll, this),
            checkNode: $.proxy(this.checkNode, this),
            uncheckAll: $.proxy(this.uncheckAll, this),
            uncheckNode: $.proxy(this.uncheckNode, this),
            toggleNodeChecked: $.proxy(this.toggleNodeChecked, this),
            disableAll: $.proxy(this.disableAll, this),
            disableNode: $.proxy(this.disableNode, this),
            enableAll: $.proxy(this.enableAll, this),
            enableNode: $.proxy(this.enableNode, this),
            toggleNodeDisabled: $.proxy(this.toggleNodeDisabled, this),
            search: $.proxy(this.search, this),
            clearSearch: $.proxy(this.clearSearch, this)
        };
    };
    Tree.prototype.init = function (options) {
        this.tree = [];
        this.nodes = [];
        if (options.data) {
            if (typeof options.data === 'string') {
                options.data = $.parseJSON(options.data);
            }
            this.tree = $.extend(true, [], options.data);
            delete options.data;
        }
        this.options = $.extend({}, _default.settings, options);
        this.destroy();
        this.subscribeEvents();
        this.setInitialStates({nodes: this.tree}, 0);
        this.render();
    };
    Tree.prototype.remove = function () {
        this.destroy();
        $.removeData(this, pluginName);
        $('#' + this.styleId).remove();
    };
    Tree.prototype.destroy = function () {
        if (!this.initialized) return;
        this.$wrapper.remove();
        this.$wrapper = null;
        this.unsubscribeEvents();
        this.initialized = false;
    };
    Tree.prototype.unsubscribeEvents = function () {
        this.$element.off('click');
        this.$element.off('nodeChecked');
        this.$element.off('nodeCollapsed');
        this.$element.off('nodeDisabled');
        this.$element.off('nodeEnabled');
        this.$element.off('nodeExpanded');
        this.$element.off('nodeSelected');
        this.$element.off('nodeUnchecked');
        this.$element.off('nodeUnselected');
        this.$element.off('searchComplete');
        this.$element.off('searchCleared');
    };
    Tree.prototype.subscribeEvents = function () {
        this.unsubscribeEvents();
        this.$element.on('click', $.proxy(this.clickHandler, this));
        if (typeof (this.options.onNodeChecked) === 'function') {
            this.$element.on('nodeChecked', this.options.onNodeChecked);
        }
        if (typeof (this.options.onNodeCollapsed) === 'function') {
            this.$element.on('nodeCollapsed', this.options.onNodeCollapsed);
        }
        if (typeof (this.options.onNodeDisabled) === 'function') {
            this.$element.on('nodeDisabled', this.options.onNodeDisabled);
        }
        if (typeof (this.options.onNodeEnabled) === 'function') {
            this.$element.on('nodeEnabled', this.options.onNodeEnabled);
        }
        if (typeof (this.options.onNodeExpanded) === 'function') {
            this.$element.on('nodeExpanded', this.options.onNodeExpanded);
        }
        if (typeof (this.options.onNodeSelected) === 'function') {
            this.$element.on('nodeSelected', this.options.onNodeSelected);
        }
        if (typeof (this.options.onNodeUnchecked) === 'function') {
            this.$element.on('nodeUnchecked', this.options.onNodeUnchecked);
        }
        if (typeof (this.options.onNodeUnselected) === 'function') {
            this.$element.on('nodeUnselected', this.options.onNodeUnselected);
        }
        if (typeof (this.options.onSearchComplete) === 'function') {
            this.$element.on('searchComplete', this.options.onSearchComplete);
        }
        if (typeof (this.options.onSearchCleared) === 'function') {
            this.$element.on('searchCleared', this.options.onSearchCleared);
        }
    };
    Tree.prototype.setInitialStates = function (node, level) {
        if (!node.nodes) return;
        level += 1;
        var parent = node;
        var _this = this;
        $.each(node.nodes, function checkStates(index, node) {
            node.nodeId = _this.nodes.length;
            node.parentId = parent.nodeId;
            if (!node.hasOwnProperty('selectable')) {
                node.selectable = true;
            }
            node.state = node.state || {};
            if (!node.state.hasOwnProperty('checked')) {
                node.state.checked = false;
            }
            if (!node.state.hasOwnProperty('disabled')) {
                node.state.disabled = false;
            }
            if (!node.state.hasOwnProperty('expanded')) {
                if (!node.state.disabled && (level < _this.options.levels) && (node.nodes && node.nodes.length > 0)) {
                    node.state.expanded = true;
                } else {
                    node.state.expanded = false;
                }
            }
            if (!node.state.hasOwnProperty('selected')) {
                node.state.selected = false;
            }
            _this.nodes.push(node);
            if (node.nodes) {
                _this.setInitialStates(node, level);
            }
        });
    };
    Tree.prototype.clickHandler = function (event) {
        if (!this.options.enableLinks) event.preventDefault();
        var target = $(event.target);
        var node = this.findNode(target);
        if (!node || node.state.disabled) return;
        var classList = target.attr('class') ? target.attr('class').split(' ') : [];
        if ((classList.indexOf('expand-icon') !== -1)) {
            this.toggleExpandedState(node, _default.options);
            this.render();
        } else if ((classList.indexOf('check-icon') !== -1)) {
            this.toggleCheckedState(node, _default.options);
            this.render();
        } else {
            if (node.selectable) {
                this.toggleSelectedState(node, _default.options);
            } else {
                this.toggleExpandedState(node, _default.options);
            }
            this.render();
        }
    };
    Tree.prototype.findNode = function (target) {
        var nodeId = target.closest('li.list-group-item').attr('data-nodeid');
        var node = this.nodes[nodeId];
        if (!node) {
            console.log('Error: node does not exist');
        }
        return node;
    };
    Tree.prototype.toggleExpandedState = function (node, options) {
        if (!node) return;
        this.setExpandedState(node, !node.state.expanded, options);
    };
    Tree.prototype.setExpandedState = function (node, state, options) {
        if (state === node.state.expanded) return;
        if (state && node.nodes) {
            node.state.expanded = true;
            if (!options.silent) {
                this.$element.trigger('nodeExpanded', $.extend(true, {}, node));
            }
        } else if (!state) {
            node.state.expanded = false;
            if (!options.silent) {
                this.$element.trigger('nodeCollapsed', $.extend(true, {}, node));
            }
            if (node.nodes && !options.ignoreChildren) {
                $.each(node.nodes, $.proxy(function (index, node) {
                    this.setExpandedState(node, false, options);
                }, this));
            }
        }
    };
    Tree.prototype.toggleSelectedState = function (node, options) {
        if (!node) return;
        this.setSelectedState(node, !node.state.selected, options);
    };
    Tree.prototype.setSelectedState = function (node, state, options) {
        if (state === node.state.selected) return;
        if (state) {
            if (!this.options.multiSelect) {
                $.each(this.findNodes('true', 'g', 'state.selected'), $.proxy(function (index, node) {
                    this.setSelectedState(node, false, options);
                }, this));
            }
            node.state.selected = true;
            if (!options.silent) {
                this.$element.trigger('nodeSelected', $.extend(true, {}, node));
            }
        } else {
            node.state.selected = false;
            if (!options.silent) {
                this.$element.trigger('nodeUnselected', $.extend(true, {}, node));
            }
        }
    };
    Tree.prototype.toggleCheckedState = function (node, options) {
        if (!node) return;
        this.setCheckedState(node, !node.state.checked, options);
    };
    Tree.prototype.setCheckedState = function (node, state, options) {
        if (state === node.state.checked) return;
        if (state) {
            node.state.checked = true;
            if (!options.silent) {
                this.$element.trigger('nodeChecked', $.extend(true, {}, node));
            }
        } else {
            node.state.checked = false;
            if (!options.silent) {
                this.$element.trigger('nodeUnchecked', $.extend(true, {}, node));
            }
        }
    };
    Tree.prototype.setDisabledState = function (node, state, options) {
        if (state === node.state.disabled) return;
        if (state) {
            node.state.disabled = true;
            this.setExpandedState(node, false, options);
            this.setSelectedState(node, false, options);
            this.setCheckedState(node, false, options);
            if (!options.silent) {
                this.$element.trigger('nodeDisabled', $.extend(true, {}, node));
            }
        } else {
            node.state.disabled = false;
            if (!options.silent) {
                this.$element.trigger('nodeEnabled', $.extend(true, {}, node));
            }
        }
    };
    Tree.prototype.render = function () {
        if (!this.initialized) {
            this.$element.addClass(pluginName);
            this.$wrapper = $(this.template.list);
            this.injectStyle();
            this.initialized = true;
        }
        this.$element.empty().append(this.$wrapper.empty());
        this.buildTree(this.tree, 0);
    };
    Tree.prototype.buildTree = function (nodes, level) {
        if (!nodes) return;
        level += 1;
        var _this = this;
        $.each(nodes, function addNodes(id, node) {
            var treeItem = $(_this.template.item).addClass('node-' + _this.elementId).addClass(node.state.checked ? 'node-checked' : '').addClass(node.state.disabled ? 'node-disabled' : '').addClass(node.state.selected ? 'node-selected' : '').addClass(node.searchResult ? 'search-result' : '').attr('data-nodeid', node.nodeId).attr('style', _this.buildStyleOverride(node));
            for (var i = 0; i < (level - 1); i++) {
                treeItem.append(_this.template.indent);
            }
            var classList = [];
            if (node.nodes) {
                classList.push('expand-icon');
                if (node.state.expanded) {
                    classList.push(_this.options.collapseIcon);
                } else {
                    classList.push(_this.options.expandIcon);
                }
            } else {
                classList.push(_this.options.emptyIcon);
            }
            treeItem.append($(_this.template.icon).addClass(classList.join(' ')));
            if (_this.options.showIcon) {
                var classList = ['node-icon'];
                classList.push(node.icon || _this.options.nodeIcon);
                if (node.state.selected) {
                    classList.pop();
                    classList.push(node.selectedIcon || _this.options.selectedIcon || node.icon || _this.options.nodeIcon);
                }
                treeItem.append($(_this.template.icon).addClass(classList.join(' ')));
            }
            if (_this.options.showCheckbox) {
                var classList = ['check-icon'];
                if (node.state.checked) {
                    classList.push(_this.options.checkedIcon);
                } else {
                    classList.push(_this.options.uncheckedIcon);
                }
                treeItem.append($(_this.template.icon).addClass(classList.join(' ')));
            }
            if (_this.options.enableLinks) {
                treeItem.append($(_this.template.link).attr('href', node.href).append(node.text));
            } else {
                treeItem.append(node.text);
            }
            if (_this.options.showTags && node.tags) {
                $.each(node.tags, function addTag(id, tag) {
                    treeItem.append($(_this.template.badge).append(tag));
                });
            }
            _this.$wrapper.append(treeItem);
            if (node.nodes && node.state.expanded && !node.state.disabled) {
                return _this.buildTree(node.nodes, level);
            }
        });
    };
    Tree.prototype.buildStyleOverride = function (node) {
        if (node.state.disabled) return '';
        var color = node.color;
        var backColor = node.backColor;
        if (this.options.highlightSelected && node.state.selected) {
            if (this.options.selectedColor) {
                color = this.options.selectedColor;
            }
            if (this.options.selectedBackColor) {
                backColor = this.options.selectedBackColor;
            }
        }
        if (this.options.highlightSearchResults && node.searchResult && !node.state.disabled) {
            if (this.options.searchResultColor) {
                color = this.options.searchResultColor;
            }
            if (this.options.searchResultBackColor) {
                backColor = this.options.searchResultBackColor;
            }
        }
        return 'color:' + color +
            ';background-color:' + backColor + ';';
    };
    Tree.prototype.injectStyle = function () {
        if (this.options.injectStyle && !document.getElementById(this.styleId)) {
            $('<style type="text/css" id="' + this.styleId + '"> ' + this.buildStyle() + ' </style>').appendTo('head');
        }
    };
    Tree.prototype.buildStyle = function () {
        var style = '.node-' + this.elementId + '{';
        if (this.options.color) {
            style += 'color:' + this.options.color + ';';
        }
        if (this.options.backColor) {
            style += 'background-color:' + this.options.backColor + ';';
        }
        if (!this.options.showBorder) {
            style += 'border:none;';
        } else if (this.options.borderColor) {
            style += 'border:1px solid ' + this.options.borderColor + ';';
        }
        style += '}';
        if (this.options.onhoverColor) {
            style += '.node-' + this.elementId + ':not(.node-disabled):hover{' +
                'background-color:' + this.options.onhoverColor + ';' +
                '}';
        }
        return this.css + style;
    };
    Tree.prototype.template = {
        list: '<ul class="list-group"></ul>',
        item: '<li class="list-group-item"></li>',
        indent: '<span class="indent"></span>',
        icon: '<span class="icon"></span>',
        link: '<a href="#" style="color:inherit;"></a>',
        badge: '<span class="badge"></span>'
    };
    Tree.prototype.css = '.treeview .list-group-item{cursor:pointer}.treeview span.indent{margin-left:10px;margin-right:10px}.treeview span.icon{width:12px;margin-right:5px}.treeview .node-disabled{color:silver;cursor:not-allowed}'
    Tree.prototype.getNode = function (nodeId) {
        return this.nodes[nodeId];
    };
    Tree.prototype.getParent = function (identifier) {
        var node = this.identifyNode(identifier);
        return this.nodes[node.parentId];
    };
    Tree.prototype.getSiblings = function (identifier) {
        var node = this.identifyNode(identifier);
        var parent = this.getParent(node);
        var nodes = parent ? parent.nodes : this.tree;
        return nodes.filter(function (obj) {
            return obj.nodeId !== node.nodeId;
        });
    };
    Tree.prototype.getSelected = function () {
        return this.findNodes('true', 'g', 'state.selected');
    };
    Tree.prototype.getUnselected = function () {
        return this.findNodes('false', 'g', 'state.selected');
    };
    Tree.prototype.getExpanded = function () {
        return this.findNodes('true', 'g', 'state.expanded');
    };
    Tree.prototype.getCollapsed = function () {
        return this.findNodes('false', 'g', 'state.expanded');
    };
    Tree.prototype.getChecked = function () {
        return this.findNodes('true', 'g', 'state.checked');
    };
    Tree.prototype.getUnchecked = function () {
        return this.findNodes('false', 'g', 'state.checked');
    };
    Tree.prototype.getDisabled = function () {
        return this.findNodes('true', 'g', 'state.disabled');
    };
    Tree.prototype.getEnabled = function () {
        return this.findNodes('false', 'g', 'state.disabled');
    };
    Tree.prototype.selectNode = function (identifiers, options) {
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.setSelectedState(node, true, options);
        }, this));
        this.render();
    };
    Tree.prototype.unselectNode = function (identifiers, options) {
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.setSelectedState(node, false, options);
        }, this));
        this.render();
    };
    Tree.prototype.toggleNodeSelected = function (identifiers, options) {
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.toggleSelectedState(node, options);
        }, this));
        this.render();
    };
    Tree.prototype.collapseAll = function (options) {
        var identifiers = this.findNodes('true', 'g', 'state.expanded');
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.setExpandedState(node, false, options);
        }, this));
        this.render();
    };
    Tree.prototype.collapseNode = function (identifiers, options) {
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.setExpandedState(node, false, options);
        }, this));
        this.render();
    };
    Tree.prototype.expandAll = function (options) {
        options = $.extend({}, _default.options, options);
        if (options && options.levels) {
            this.expandLevels(this.tree, options.levels, options);
        } else {
            var identifiers = this.findNodes('false', 'g', 'state.expanded');
            this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
                this.setExpandedState(node, true, options);
            }, this));
        }
        this.render();
    };
    Tree.prototype.expandNode = function (identifiers, options) {
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.setExpandedState(node, true, options);
            if (node.nodes && (options && options.levels)) {
                this.expandLevels(node.nodes, options.levels - 1, options);
            }
        }, this));
        this.render();
    };
    Tree.prototype.expandLevels = function (nodes, level, options) {
        options = $.extend({}, _default.options, options);
        $.each(nodes, $.proxy(function (index, node) {
            this.setExpandedState(node, (level > 0) ? true : false, options);
            if (node.nodes) {
                this.expandLevels(node.nodes, level - 1, options);
            }
        }, this));
    };
    Tree.prototype.revealNode = function (identifiers, options) {
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            var parentNode = this.getParent(node);
            while (parentNode) {
                this.setExpandedState(parentNode, true, options);
                parentNode = this.getParent(parentNode);
            }
            ;
        }, this));
        this.render();
    };
    Tree.prototype.toggleNodeExpanded = function (identifiers, options) {
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.toggleExpandedState(node, options);
        }, this));
        this.render();
    };
    Tree.prototype.checkAll = function (options) {
        var identifiers = this.findNodes('false', 'g', 'state.checked');
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.setCheckedState(node, true, options);
        }, this));
        this.render();
    };
    Tree.prototype.checkNode = function (identifiers, options) {
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.setCheckedState(node, true, options);
        }, this));
        this.render();
    };
    Tree.prototype.uncheckAll = function (options) {
        var identifiers = this.findNodes('true', 'g', 'state.checked');
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.setCheckedState(node, false, options);
        }, this));
        this.render();
    };
    Tree.prototype.uncheckNode = function (identifiers, options) {
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.setCheckedState(node, false, options);
        }, this));
        this.render();
    };
    Tree.prototype.toggleNodeChecked = function (identifiers, options) {
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.toggleCheckedState(node, options);
        }, this));
        this.render();
    };
    Tree.prototype.disableAll = function (options) {
        var identifiers = this.findNodes('false', 'g', 'state.disabled');
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.setDisabledState(node, true, options);
        }, this));
        this.render();
    };
    Tree.prototype.disableNode = function (identifiers, options) {
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.setDisabledState(node, true, options);
        }, this));
        this.render();
    };
    Tree.prototype.enableAll = function (options) {
        var identifiers = this.findNodes('true', 'g', 'state.disabled');
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.setDisabledState(node, false, options);
        }, this));
        this.render();
    };
    Tree.prototype.enableNode = function (identifiers, options) {
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.setDisabledState(node, false, options);
        }, this));
        this.render();
    };
    Tree.prototype.toggleNodeDisabled = function (identifiers, options) {
        this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            this.setDisabledState(node, !node.state.disabled, options);
        }, this));
        this.render();
    };
    Tree.prototype.forEachIdentifier = function (identifiers, options, callback) {
        options = $.extend({}, _default.options, options);
        if (!(identifiers instanceof Array)) {
            identifiers = [identifiers];
        }
        $.each(identifiers, $.proxy(function (index, identifier) {
            callback(this.identifyNode(identifier), options);
        }, this));
    };
    Tree.prototype.identifyNode = function (identifier) {
        return ((typeof identifier) === 'number') ? this.nodes[identifier] : identifier;
    };
    Tree.prototype.search = function (pattern, options) {
        options = $.extend({}, _default.searchOptions, options);
        this.clearSearch({render: false});
        var results = [];
        if (pattern && pattern.length > 0) {
            if (options.exactMatch) {
                pattern = '^' + pattern + '$';
            }
            var modifier = 'g';
            if (options.ignoreCase) {
                modifier += 'i';
            }
            results = this.findNodes(pattern, modifier);
            $.each(results, function (index, node) {
                node.searchResult = true;
            })
        }
        if (options.revealResults) {
            this.revealNode(results);
        } else {
            this.render();
        }
        this.$element.trigger('searchComplete', $.extend(true, {}, results));
        return results;
    };
    Tree.prototype.clearSearch = function (options) {
        options = $.extend({}, {render: true}, options);
        var results = $.each(this.findNodes('true', 'g', 'searchResult'), function (index, node) {
            node.searchResult = false;
        });
        if (options.render) {
            this.render();
        }
        this.$element.trigger('searchCleared', $.extend(true, {}, results));
    };
    Tree.prototype.findNodes = function (pattern, modifier, attribute) {
        modifier = modifier || 'g';
        attribute = attribute || 'text';
        var _this = this;
        return $.grep(this.nodes, function (node) {
            var val = _this.getNodeValue(node, attribute);
            if (typeof val === 'string') {
                return val.match(new RegExp(pattern, modifier));
            }
        });
    };
    Tree.prototype.getNodeValue = function (obj, attr) {
        var index = attr.indexOf('.');
        if (index > 0) {
            var _obj = obj[attr.substring(0, index)];
            var _attr = attr.substring(index + 1, attr.length);
            return this.getNodeValue(_obj, _attr);
        } else {
            if (obj.hasOwnProperty(attr)) {
                return obj[attr].toString();
            } else {
                return undefined;
            }
        }
    };
    var logError = function (message) {
        if (window.console) {
            window.console.error(message);
        }
    };
    $.fn[pluginName] = function (options, args) {
        var result;
        this.each(function () {
            var _this = $.data(this, pluginName);
            if (typeof options === 'string') {
                if (!_this) {
                    logError('Not initialized, can not call method : ' + options);
                } else if (!$.isFunction(_this[options]) || options.charAt(0) === '_') {
                    logError('No such method : ' + options);
                } else {
                    if (!(args instanceof Array)) {
                        args = [args];
                    }
                    result = _this[options].apply(_this, args);
                }
            } else if (typeof options === 'boolean') {
                result = _this;
            } else {
                $.data(this, pluginName, new Tree(this, $.extend(true, {}, options)));
            }
        });
        return result || this;
    };
})(jQuery, window, document);