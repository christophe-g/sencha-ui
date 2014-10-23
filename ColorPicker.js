//====================
//   ColorPicker
//====================
// @lastpudate: 2013-02-09T11:57:54.723+01:00
// file: /db/es.dev/sencha/extClass/classes/widget/ui/ColorPicker.js
Ext.define("E.widget.ui.ColorPicker",
{
 "alias" : "widget.ui_colorpicker", "extend" : "Ext.menu.ColorPicker", "requires" : "E.widget.ui.CanvasPalette" 
,/*::::*/

	initComponent: function () {
		var me = this;
		if (!Ext.supports.Canvas || me.fallback == true) {
			me.height = 100;
			me.hideOnClick = true;
			me.callParent();
			return me.processEvent();
		}
		cfg = Ext.apply({}, me.canvasCfg);

		// Ensure we don't get duplicate listeners
		delete cfg.listeners;
		Ext.apply(me, {
			plain: true,
			showSeparator: false,
			items: Ext.applyIf({
				cls: Ext.baseCSSPrefix + 'menu_color-item',
				id: me.pickerId,
				value: me.value,
				xtype: 'ui_canvaspalette'
			}, cfg)
		});

		Ext.menu.ColorPicker.superclass.initComponent.call(me)

		me.picker = me.down('ui_canvaspalette');
		me.processEvent()

	},
	processEvent: function () {
		var me = this;
		me.picker.clearListeners();
		me.relayEvents(me.picker, ['select']);

		if (me.hideOnClick) {
			me.on('select', me.hidePickerOnSelect, me);
		}
	}




/*::::*/
}
);
