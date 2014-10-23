//====================
//   Extra
//====================
// @lastpudate: 2013-02-09T11:57:54.762+01:00
// file: /db/es.dev/sencha/extClass/classes/widget/ui/Extra.js
Ext.define("E.widget.ui.Extra",
{
 "alias" : "widget.ui_extra", "extend" : "Ext.panel.Panel" 
,/*::::*/

//plugins:['xf-formControl'],
extraType: 'documentation',
cls: 'util_extra',
height: 80,
//border: 0, 
//bodyPadding: 8,
autoScroll: true, 
border: '0 0 1 0',
flex: 0,
initComponent: function () {
	
	//var doc = this.getDoc();
	//E.util.Extra.superclass.initComponent.call(this);
	this.callParent(arguments)
	this.getParentConfig('modelType');
	this.html = this.getExtra()
	//this.on('render',function() {this.getExtra()}, this, {single: true})
	//this.el = this.getDoc();
},
getExtra: function () {
	var extra = E.xforms.model.ModelMgr.get(this.modelType).extra[ this.extraType];
	//var extra = 'coucou';
	//ci('getDoc', extra);
	return "" + ( extra ? extra.innerHTML: "" )
	/*if (extra && extra.firstChild) {
	this.body.dom.appendChild(extra.firstChild.cloneNode(true))
	/\*var u = this.body.getUpdater();
	if(this.renderer){
	u.setRenderer(this.renderer);
	}
	u.update(extra);*\/
	
	/\*var div 	= Ext.get(document.createElement('div'));
	Ext.each(extra.childNodes, function(d) { div.appendChild(d)});
	return div;*\/
	}*/
}





/*::::*/
}
);
