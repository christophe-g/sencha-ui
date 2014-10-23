//====================
//   ComboTree
//====================
// @lastpudate: 2013-02-09T11:57:54.755+01:00
// file: /db/es.dev/sencha/extClass/classes/widget/ui/ComboTree.js
Ext.define("E.widget.ui.ComboTree",
{
 "alias" : "widget.ui_combotree", "extend" : "E.widget.ui.ComboFieldBox" 
,/*::::*/
    autoSelect : false,  // prevent errors when trying to set nodes 
	pickerXtype : 'treepanel',
	maxPickerHeight: 300,
	minPickerHeight: 100,
	getPickerStore: function() {
		return this.pickerStore = this.store;
	},
	createPicker: function() {
        var me = this,
            picker,
            pickerCfg = Ext.apply({
                xtype: me.pickerXtype,
                pickerField: me,
                selModel: {
                    mode: me.multiSelect ? 'SIMPLE' : 'SINGLE',
                    enableInitialSelection: false
                },
                floating: true,
                store: me.getPickerStore(),
                width: 20, // need to put width and height , otherwise layout fail
                height: 20,
                columns: me.columns,
	    		minHeight: me.minPickerHeight,
	    		maxHeight: me.maxPickerHeight,
	    		minWidth: me.minPickerWidth,
	    		displayField: me.displayField,
     			valueField: me.valueField,
     			descField: me.descField,
                rootVisible : false,  
				useArrows : true,
	            preserveScrollOnRefresh: true

            }, me.pickerCfg, me.defaultPickerCfg);

        picker = me.picker = Ext.widget(pickerCfg);

        me.mon(picker, {
            refresh: me.onListRefresh,
            checkchange: me.onCheckChange,
         	afteritemexpand: me.onAfterItemExpand,
         	beforeload: me.onBeforeLoad,
            scope: me
        });

        return picker;
	},

	onCheckChange: function(r, checked) {
		var me = this,
			id = r.get(me.valueField),
			st = me.getValueStore(),
			val = st.data.getValues('id')
		me._isChecked = true;
		if(checked && (val.indexOf(id) < 0) ) {
			if(!me.findRecordByValue(id)) {me.store.add(r.data)} // add to combostore if not already present
			val.push(id)
		} else {
			Ext.Array.remove(val, id) 
		}
		st.removeAll();
		me.setValue(val)
		delete me._isChecked;
	},
	onAfterItemExpand: function( n) {
		this.syncSelection(n);
	},
	onBeforeLoad: function(st, op, ev) {
	     var node, sel; // allow to check is raw xml contains items first
	     if ((node = op.node) && (node.raw && !node.loaded) && (sel = st.getProxy().getReader().extractData(node.raw)) && sel.length) {
              node.appendChild(sel);
              node.expand();
              return false
	     }
	},
	syncSelection: function(node){
		var me = this; 
		if(me.isExpanded && !me._isChecked) {
			var node = node || me.picker.getRootNode(),
				values = me.getValue();
			node.cascadeBy(function(n) {
				var c = n.get('checked');
				if(c == false || c == true) {
					n.set('checked', values.indexOf(n.get(me.valueField)) > -1) 
				}
				else if(c === null) {
					n.set('checked', false)	
				}
			})
		}
	},
	onExpand: function() {
		var me =this;
		me.callParent();
		me.syncSelection()
	},
	/*onCollapse: function() {
		var me =this;
		me.processBind()
	},*/
	




/*::::*/
}
);
