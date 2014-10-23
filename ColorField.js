//====================
//   ColorField
//====================
// @lastpudate: 2013-02-20T17:18:53.853+01:00
// file: /db/es.dev/sencha/extClass/classes/widget/ui/ColorField.js
Ext.define("E.widget.ui.ColorField",
{
 "alias" : "widget.ui_colorfield", "extend" : "Ext.form.field.Trigger", "requires" : "E.widget.ui.ColorPicker" 
,/*::::*/

	triggerConfig: {
		src: Ext.BLANK_IMAGE_URL,
		tag: "img",
		cls: "x-form-trigger x-form-color-trigger"
	},
	invalidText: "Colors must be in a the hex format #FFFFFF.",
	regex: /^\#[0-9A-F]{6}$/i,
	allowBlank: false,
	initComponent: function () {
		this.callParent()
		this.addEvents('select');
		this.on('change', function (c, v) {
			this.onSelect(c, v);
		}, this);
	},
	// private
	onDestroy: function () {
		Ext.destroy(this.menu);
		this.callParent()
		//        Ext.ux.ColorField.superclass.onDestroy.call(this);
	},

	// private
	afterRender: function () {
		//Ext.ux.ColorField.superclass.afterRender.call(this);
		this.callParent(arguments)
		this.inputEl.setStyle('background', this.value);
		this.detectFontColor();
	},

	/**
	 * @method onTriggerClick
	 * @hide
	 */
	// private
	onTriggerClick: function (e) {
		if (this.disabled) {
			return;
		}

		this.menu = new E.widget.ui.ColorPicker({
			value: this.value,
			shadow: true,
			autoShow: true,
			hideOnClick: false,
			fallback: this.fallback
		});
		this.menu.alignTo(this.inputEl, 'tl-bl?');
		//this.menu.doLayout();
		this.menuEvents('on');
		this.menu.show(this.inputEl);
	},

	//private
	menuEvents: function (method) {
		this.menu[method]('select', this.onSelect, this);
		this.menu[method]('hide', this.onMenuHide, this);
		this.menu[method]('show', this.onFocus, this);
	},

	onSelect: function (m, d) {
		d = Ext.isString(d) && d.substr(0, 1)  != '#' && d != '' ? '#' + d : d;
		this.setValue(d);
		this.fireEvent('select', this, d);
		this.inputEl.setStyle('background', d);
		this.detectFontColor();
	},

	// private
	// Detects whether the font color should be white or black, according to the
	// current color of the background
	detectFontColor: function () {
		if (!this.menu || !this.menu.picker.rawValue) {
			if (!this.value || this.value == '') value = 'FFFFFF';
			else {
				var h2d = function (d) {
						return parseInt(d, 16);
					}
				var value = [
					h2d(this.value.slice(1, 3)),
					h2d(this.value.slice(3, 5)),
					h2d(this.value.slice(5))
					];
			}
		} else var value = this.menu.picker.rawValue;
		var avg = (value[0] + value[1] + value[2]) / 3;
		this.inputEl.setStyle('color', (avg > 128) ? '#000' : '#FFF');
	},

	onMenuHide: function () {
		this.focus(false, 60);
		this.menuEvents('un');
	}




/*::::*/
}
);
