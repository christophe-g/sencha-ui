//====================
//   ComboView
//====================
// @lastpudate: 2013-02-09T11:57:54.734+01:00
// file: /db/es.dev/sencha/extClass/classes/widget/ui/ComboView.js
Ext.define("E.widget.ui.ComboView",
{
 "alias" : "widget.ui_comboview", "extend" : "Ext.view.View" 
,/*::::*/

/**
      * @cfg {Boolean} maxLength
      * maximum length for viewItems. If text is longer, it gets 'ellipsisied'.  
      */
    maxLength: 18,
    /**
      * @cfg {Boolean} removeOnDblClick
      * true to unselect viewItem on double click  
      */
    removeOnDblClick: true,
    /**
      * @cfg {Boolean} inputWidth
      * width for the inputfield  
      */
    inputWidth: 40,
    itemSelector: 'li.x-boxselect-item',
    closeCls: 'x-boxselect-item-close',
     /**
     * Set Xtemplate fot the ComboView (called if me.tpl is not existing)
     * @returns {Ext.XTemplate} Returns template 
     */

    childEls: [
        'listWrap', 'listEl', 'inputEl' 
    ],

    renderTpl: [
        '<div id="{id}-listWrap" data-ref="listWrap" role="presentation" class="{baseCls}-list-ct ', Ext.dom.Element.unselectableCls, '">',
            '<ul  class="x-boxselect-list x-tab-default {fieldCls} {typeCls}">',
           		'<span id="{id}-listEl" data-ref="listEl">',
           		'</span>', 	
           		'<input class="x-boxselect-input" id="{id}-inputEl" data-ref="inputEl" style="width:10px;"/>', // need this to manage focus; width of input is larger in createNewOnEnter is set to true
            '</ul>',
           
        '</div>',
        {
            disableFormats: true
        }
    ],

    setTpl: function() {
    	 var me = this,
    	 	id = me.id, 
            field = me.pickerField,
            displayField = field.displayField,
            descField = field.descField,
            iconClsField = field.iconClsField;
        me.tpl = new Ext.XTemplate(
                '<tpl for=".">', 
                    '<li class="x-boxselect-item ', 
                    iconClsField ? ('x-boxselect-icon {' + iconClsField + '}"') : '"', 
                    descField ? ('data-qtitle="{' + displayField + '}" data-qtip="{' + descField + '}">') : '>', 
                    '<div class="x-boxselect-item-text">{[this.ellipsis(values.', displayField, ')]}</div>', 
                    '<div class="x-tab-close-btn ', me.closeCls, '"></div>', 
                '</li>', 
            '</tpl>', 
         {
            compiled: true,
            disableFormats: true,
            length: me.maxLength,
            ellipsis: function (txt) {
                return Ext.String.ellipsis(txt, this.length)
            }
        })
        return me.tpl;
    },
    initComponent: function () {
        var me = this;
        if (!me.tpl) {me.tpl= me.setTpl()};
        if (!me.selModel) {
            me.selModel = {enableKeyNav: false};
        }
        me.callParent(arguments)
    },
    privates : {
    	getFocusEl: function () {
      		//return this.pickerField.el
        	return this.inputEl
    	},
    	getTargetEl : function() {
     		return this.listEl
    	}
    	},
   addFocusListener: function (force) {
        var me = this;
        if (!me.focusListenerAdded || force) {
            me.callParent(); // force argument only valid in ComboView
            var focusEl = me.getFocusEl();
            if (focusEl) {
                 focusEl.on({
                     focus: me.pickerField.onFocus,
                     blur: me.pickerField.onBlur,
                     keydown: me.pickerField.onKeyDown, //we have keydown here instead of on the keyNav because keyNav ould not react when the valueStore is empty
                     scope: me.pickerField
                 });
                 me.pickerField.el.on({
                     click: me.pickerField.onClick,
//                     blur: me.pickerField.onBlur,
                     scope: me.pickerField
                 })
            }
        }		
    }, 
    onItemClick: function (r, h, i, e, o) {
        if (e.getTarget('.' + this.closeCls)) {
            return this.onDataChange(r, 'remove')
        }
        this.highlightItem(h)
    },
    onItemDblClick: function (r, h, i, e, o) {
        if (this.removeOnDblClick) {
            this.onDataChange(r, 'remove')
        }
    },
    onDataChange: function (r, action) {
        var me = this;
        if(me.pickerField.readOnly || me.pickerField.disabled) {return}
        if (action == 'remove') {
            me.store.remove(r)
        }
        me.pickerField.setStoreValues()
    },
    applyNavigationModel : function(nav) {
    	nav = this.callParent(arguments)
    	nav.initKeyNav = Ext.Function.createSequence(nav.initKeyNav, function() {
    		this.keyNav.map.ignoreInputFields = false; //allow the view to react to key events. 
    		//this.keyNav.map.enabled = false;
    	})
		
    	return nav
    },
    listeners: {
        refresh: {
            fn: function () { 
            	var me = this;
	               	 this.applyRenderSelectors();
    	            this.addFocusListener(this);
            }
        }
    },
    onDestroy: function () {
        var me = this,
            focusEl;
        if (focusEl = me.getFocusEl()) {
            focusEl.clearListeners()
        }
    }




/*::::*/
}
);
