//====================
//   ComboFieldBox
//====================
// @lastpudate: 2014-10-22T12:22:24.714+02:00
// file: /db/es.dev/sencha/extClass/classes/widget/ui/ComboFieldBox.js
Ext.define("E.widget.ui.ComboFieldBox",
{
 "alias" : "widget.ui_combofieldbox", "extend" : "Ext.form.field.ComboBox", "requires" : ["E.widget.ui.ComboView", "E.widget.ui.BoundValueKeyNav", "E.widget.ui.BoundListViewKeyNav"] 
,/*::::*/

	multiSelect: true,
	/**
 	 * @cfg
	 * maximum height for inputEl. 
	 */
	maxHeight: 150,
	/**
	 * @cfg
	 * name of field used for description/tooltip
	 */
	descField: null,
	/**
	 * @cfg
	 * config object passed to the view 
	 * viewCfg: {},
	 */
	/**
	 * @cfg {String} iconClsField
	 * The underlying iconCls field name to bind to this ComboBox.
	 * iconClsField: '',
	 */
	/**
	 * @cfg {Boolean} createNewOnEnter
	 * When forceSelection is false, new records can be created by the user. This configuration
	 * option has no effect if forceSelection is true, which is the default.
	 */
	createNewOnEnter: false,
	/**
	 * @cfg {Boolean} forceSelection
	 * override parent config. If force selection is set to false and    
	 */
	forceSelection: true, 
	/**
	 * @cfg {Boolean} selectOnTab
	 * Whether the Tab key should select the currently highlighted item.
	 */
	selectOnTab : false,
	/**
	 * @cfg {String} trigger1Cls
	 * css class for the first trigger. To have just one trigger acting like in usual combo, set trigger1Cls to null. First trigger clears all values
	 */
	 triggers: {
	 	"clear" : {
	 		cls: Ext.baseCSSPrefix + 'form-clear-trigger',
	 		handler: function() {
	 			this.setValue("");
	 			this.collapse();
	 		}
	 	}
	 },
	
	/**
	 * @cfg {String} listIconCls
	 * css class to use when an iconClsField is set. This class is injected into getInnerTpl method when constructing the comboBox boundList
	 */

    listIconCls : 'x-boundlist-icon',
    
    config: {
    	valueStore : null,
    	valueModel : null
    },
	// defaultValueModel : 'E.data.model.lookup.lookup',
    fieldSubTpl: [
        '<div class="{hiddenDataCls}" role="presentation"></div>',
        '<div id="{id}"',
            '<tpl if="readOnly"> readonly="readonly"</tpl>',
            '<tpl if="disabled"> disabled="disabled"</tpl>',
            '<tpl if="tabIdx"> tabIndex="{tabIdx}"</tpl>',
            '<tpl if="name"> name="{name}"</tpl>',
            '<tpl if="fieldStyle"> style="{fieldStyle}"</tpl>',
            '<tpl if="placeholder"> placeholder="{placeholder}"</tpl>',
            '<tpl if="size"> size="{size}"</tpl>',
            'class="{fieldCls} {typeCls} x-boxselect" autocomplete="off" />',
        '</div>',

    {
        compiled: true,
        disableFormats: true
    }
    ],
    getSubTplData: function () {
        var me = this,
            fieldStyle = me.getFieldStyle(),
            ret = me.callParent(arguments);
        ret.fieldStyle = (fieldStyle || '') + ';overflow:auto;height:'+ (me.height ? (me.height + 'px;') : 'auto;') + (me.maxHeight ? ('max-height:' + me.maxHeight + 'px;') : '');
        delete me.height; //need to delete height for the correct component height to be recalculated on layout. 
        return ret;
    },

    initComponent: function () {
        var me = this;
       
        me.setValueStore();
       	var selModel = me.multiSelect 
       		? {selModel: {mode: 'SIMPLE'}, navigationModel :'boundlistviewkeynav'} 
       		: {selModel: {mode: 'SINGLE'}, navigationModel :'boundlistviewkeynav'};
        //me.listConfig = Ext.apply(me.listConfig || {}, {selModel: {mode: me.multiSelect ? 'SIMPLE' : 'SINGLE', enableKeyNav: false}});
        me.listConfig = Ext.apply(me.listConfig || {}, selModel);
        if(me.iconClsField || me.descField) {Ext.apply(me.listConfig, {getInnerTpl: function(displayField) {
						return '<div data-qtip="{' +me.descField +'}" class="'+ ((me.iconClsField && me.listIconCls) ? me.listIconCls :'') +' {'+me.iconClsField + '}">{' + me.displayField +'}</div>';
						}
					})
				};
        me.callParent(arguments);
    },
    applyValueStore : function(store) {
    	if(store && store.isStore) {
    		return store
    	}
    	return new Ext.data.Store({
                    model: this.store ? this.store.model : this.getValueModel
            });
    },
    updateValueModel : function(model){
    	var valueStore = this.getValueStore()
    	if(valueStore && model) {
    		valueStore.setModel(model)
    	}
    },
    bindStore : function(store){
    	this.callParent(arguments)
    	var valueStore = this.getValueStore()
    	
    	if(valueStore && this.store) {
    		var model = this.store.getModel()
    		this.valueField = model.idField.name;
    		valueStore.setModel(model)
    	}
    },
    /**
    * get all field values from value store and re-set combobox values
    */
    setStoreValues: function() {
        var me = this, 
            st = me.getValueStore();
        me.setValue(st.data.getValues("id"));
        me.syncSelection();   
    },
    getValueModels: function () {
        return this.valueModels || [];
    },
    afterSetValue: function (action){
        var me = this,
        	valueStore = me.getValueStore(), 
        	rec;
	    valueStore.removeAll();
		valueStore.add(me.getValueModels());
		if (me.isExpanded) {
			me.alignPicker();
		}
		me.syncSelection();
		if(me.view && (rec = valueStore.getAt(valueStore.getCount() -1))) {
			me.view.select(rec)
		}
	   	//me.updateLayout();
	},
	assertValue: Ext.emptyFn,
    setValue: function (value, action) {
        var me = this;
        if(me.tempValue) {
    	    var picker = me.getPicker(),
	        	oldPr = picker.preserveScrollOnRefresh;
			value = Ext.Array.unique(value.concat(me.tempValue))
        	var val = me.store.data.getValues("id");
			if(me.typeAhead && (me.store.getCount() == 1)) {
				var v = me.store.getAt(0).get(me.valueField);
				me.oldMulti != true ? value = v : value.push(v);
				me._needCollapse = true;
			}
			me.store.data.addAll(
				Ext.Array.filter(me.valueStore.data.items, function(i) {return (Ext.Array.indexOf(val,i.data[me.valueField]) < 0)})
				)
			picker.preserveScrollOnRefresh = true;
			if(me.picker.refresh) {me.picker.refresh()};
        	picker.preserveScrollOnRefresh = oldPr;
        }
        me.callParent([value, false]);
        me.afterSetValue(action)
    },
    getRawValue: function () {
        return Ext.valueFrom(this.rawValue, '');
    },
    doRawQuery: function() {
     	var me = this,
			qe;
     	if(me.view && me.typeAhead && (qe = me.view.inputEl.getValue())) {
	    	me.tempValue = me.value;
	    	me.tempMulti = me.multiSelect;
	    	me.multiSelect = true; 
	    	this.doQuery(qe, false, true);
	    	me.multiSelect = me.oldMulti; 
	        delete me.tempMulti;
	        delete me.tempValue;
			if(me._needCollapse){
				me.collapse();
		        delete me._needCollapse;				
			}
	        else {
				me.onExpand();
				me._preventClear = true;
				me.view.inputEl.focus();
				me.view.inputEl.dom.value=qe;
				delete me._preventClear;
	        }
		}
    },
    onKeyDown : function(event) {
    	if(event.keyCode == 13) { //react only if we have "Enter" 
    		this.onEnter(event)
    	}
    },
    onBlur: function(event) {
    	var me = this;
    	me.view.inputEl.dom.value ='';
    	me.view.inputEl.setWidth(10);
    	me.callParent(arguments);
    	if(!me.valueStore.getCount()){
    		me.view.refresh() //reset emtpyText
    	}
    }, 
    onClick : function(event) {
    	var me = this
    	if(!event.getTarget(me.view.itemSelector, 3)){ //only expand/collapse if not clicked on a value item
    		me[me.isExpanded ? 'collapse' : 'expand']() 
    	}
    	me.onFocus()
    },
    onFocus: function() {
    	var me = this,
    		view = me.view;
    	if(me.__focusing) {
    		delete me.__focusing;
    		return
    		}	
    	me.callParent(arguments);
    	if(me.picker) {
    		me.picker.getNavigationModel().disable()
    	}
    	view.inputEl.setWidth(view.inputWidth)
    	if(me._preventClear != true) {
	    	me.store.clearFilter();
    		if(me.picker && me.picker.refresh) {me.picker.refresh()};
    	}
    	me.__focusing = true
    	if(!me.valueStore.getCount()){
    		me.view.clearEmptyEl(); //clear emtpyText if no value
    		me.expand();
    	}
    	me.view.focus(); 
    },
	onEnter: function(event){
		var me = this,
			rawValue;
		if(me.readOnly || me.disabled || !me.editable) {return}
		if(me.multiSelect 
				&& me.createNewOnEnter == true 
				&&  (rawValue = event.target.value) && (!Ext.isEmpty(rawValue))) {
			var rec = me.store.findExact(me.valueField, rawValue);
			if(rec < 0) {
				 rec = {};
				rec[me.valueField] = rawValue;
				rec[me.displayField] = rawValue;
				rec= me.store.add(rec);
			me.getValueStore().add(rec);
			me.setStoreValues();
		}
	// 		me.view.focus();	
		}
	},
    createRecord: function(rawValue) {
   		var me= this, rec = {};
		rec[me.valueField] = rawValue;
		rec[me.displayField] = rawValue;
		return rec
    },
    afterRender : function() {
    	var me = this;
    	me.callParent(arguments);
		me.buildView();
    },
    buildView : function() {
        var me = this;
        if (!me.view) {
            me.view = new E.widget.ui.ComboView(Ext.apply({
                store: me.valueStore,
                deferEmptyText: me.value != "",
                emptyText: me.emptyText || '',
                pickerField: me,
                navigationModel: 'boundvaluekeynav',
                renderTo: me.inputEl
       }, me.viewCfg))
       }
       me.view.refresh()
    },

    onDestroy: function() {
        var me = this;
        if(me.view) {Ext.destroy(me.view)};
        if(me.boxKeyNav) {Ext.destroy(me.boxKeyNav)};
        me.callParent(arguments);
    }




/*::::*/
}
);
