//====================
//   TxtCmp
//====================
// @lastpudate: 2013-02-09T11:57:54.681+01:00
// file: /db/es.dev/sencha/extClass/classes/widget/ui/TxtCmp.js
Ext.define("E.widget.ui.TxtCmp",
{
 "alias" : "widget.ui_txtcmp", "extend" : "Ext.Component" 
,/*::::*/

  ariaRole  	: 'heading',
  padding	:  '2 0 10',
  focusable	: false,
  baseCls	: 'x-form-msg',
  text		: '',
  rootEl		: 'span',
  //flex : 1, 
  initComponent: function() {
	 Ext.apply(this.renderData ,  {
	    	  	text: this.text,
	      	cls  : this.baseCls,
	      	ui   : this.ui,
	      	rootEl	: this.rootEl
	  	});
	this.callParent()  	
  },
  renderTpl : ['<{rootEl} class="{cls}-text {cls}-text-{ui}">{text}</{rootEl}>'],
  onRender : function() {
  	   Ext.apply(this.renderSelectors, {
  	   		bodyEl: '.' + this.baseCls,
  		   	textEl: '.' + this.baseCls + '-text' 
  	});
  	this.callParent(arguments)
  }
      




/*::::*/
}
);
