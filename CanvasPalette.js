//====================
//   CanvasPalette
//====================
// @lastpudate: 2013-02-20T18:29:04.961+01:00
// file: /db/es.dev/sencha/extClass/classes/widget/ui/CanvasPalette.js
Ext.define("E.widget.ui.CanvasPalette",
{
 "alias" : "widget.ui_canvaspalette", "extend" : "Ext.Component" 
,/*::::*/

itemCls: 'x-color-picker',
	defaultValue: "#0000FF",
	width: 200,
	height: 200,
	initComponent: function () {
		this.callParent()
		this.addEvents(
		/**
		 * @event select 
		 * Fires when a color is selected
		 * @param {ColorPalette} this
		 * @param {String} color The 6-digit color hex code (without the # symbol)
		 */
		'select');

		if (!this.value) this.value = this.defaultValue;
	},
	getValue: function () {
		return this.value;
	},

	setValue: function (v) {
		this.value = v;
	},
	onRender: function (container, position) {
		var el = document.createElement("div");
		el.className = this.itemCls;
		container.dom.insertBefore(el, position);
		Ext.get(el).setWidth(this.width);
		this.canvasdiv = Ext.get(el).createChild({
			tag: 'div'
		});
		this.wheel = this.canvasdiv.dom.appendChild(document.createElement("canvas"));
		this.wheel.setAttribute('width', '200');
		this.wheel.setAttribute('height', '200');
		this.wheel.setAttribute('class', 'x-color-picker-wheel');


		/* Draw the wheel image onto the container */
		this.wheel.getContext('2d').drawImage(this.wheelImage, 0, 0);
		this.drawGradient();

		Ext.get(this.wheel).on('click', this.select, this);
		this.callParent();
	},

	// private
	afterRender: function () {
		var me = this;
		me.callParent();
		var t = new Ext.dd.DragDrop(me.wheel)
		t.onDrag = function (e, t) {
				me.select(e, this.DDMInstance.currentTarget);
			};
	},

	select: function (e, t) {
		var context = this.wheel.getContext('2d');
		var coords = [
			e.getX() - Ext.get(t).getLeft(),
			e.getY() - Ext.get(t).getTop()
			];

		try {
			var data = context.getImageData(coords[0], coords[1], 1, 1);
		} catch (e) {
			return;
		} // The user selected an area outside the <canvas>
		// Disallow selecting transparent regions
		var toHex = function () {
				this.color = new Ext.draw.Color(this.rawValue[0], this.rawValue[1], this.rawValue[2])
				this.value = this.color.toString();
			};
		if (data.data[3] == 0) {
			var context = this.gradient.getContext('2d');
			var data = context.getImageData(coords[0], coords[1], 1, 1);
			if (data.data[3] == 0) return;
			this.rawValue = data.data;
			toHex.call(this);
			this.fireEvent('select', this, this.value);
		} else {
			this.rawValue = data.data;
			toHex.call(this)
			this.drawGradient();
			this.fireEvent('select', this, this.value);
		}
	},

	// private
	drawGradient: function () {
		if (!this.gradient) {
			this.gradient = this.canvasdiv.dom.appendChild(document.createElement("canvas"));
			this.gradient.setAttribute('width', '200');
			this.gradient.setAttribute('height', '200');
			this.gradient.setAttribute('class', 'x-color-picker-gradient');
			if (typeof G_vmlCanvasManager != 'undefined') this.gradient = G_vmlCanvasManager.initElement(this.gradient);
			Ext.get(this.gradient).on('click', this.select, this);
		}
		var context = this.gradient.getContext('2d');
		var center = [97.5, 98];

		// Clear the canvas first
		context.clearRect(0, 0, this.gradient.width, this.gradient.height)

		context.beginPath();
		context.fillStyle = this.value;
		context.strokeStyle = this.value;
		context.arc(center[0], center[0], 65, 0, 2 * Math.PI, false);
		context.closePath();
		context.fill();

		/* Draw the wheel image onto the container */
		this.gradient.getContext('2d').drawImage(this.gradientImage, 33, 32);

	}







/*::::*/
}
,
                    function () { /* Preload the picker images so they're available at render time */
                        var p = this.prototype;
                        Ext.onReady(function() {
                            var app = Ext.getApp(),
                                root = app.getImgRef();
								if(Ext.isFunction(root)){
									root = root.apply(app);
									app.setImgRef(root)
								}
                            //root = 'system/resource/img/'
                                p.wheelImage = (function () {
                                    var wheelImage = new Image();
                                    wheelImage.onload = Ext.emptyFn;
                                    wheelImage.src = root + 'wheel.png';
                                return wheelImage;
                            })();
                            p.gradientImage = (function () {
                                var gradientImage = new Image();
                                gradientImage.onload = Ext.emptyFn;
                                gradientImage.src = root + 'gradient.png';
                                return gradientImage;
                        })();
                         }, this, {single: true, priority: -1})
                    }
                    
);
