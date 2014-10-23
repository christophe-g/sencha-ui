//====================
//   SrvMsg
//====================
// @lastpudate: 2013-02-09T11:57:54.69+01:00
// file: /db/es.dev/sencha/extClass/classes/widget/ui/SrvMsg.js
Ext.define("E.widget.ui.SrvMsg",
{
 "alias" : "widget.ui_srvmsg", "extend" : "Ext.container.Container" 
,/*::::*/

padding	: 10,
baseCls		: 'srv-msg',
titleCls		: 'txt-title', 
wrapCls 	: 'srv-msg-wrap',
contentCls	: 'srv-msg-content',
descCls		: 'txt-short',
bodyCls	: 'txt-body',
autoScroll	: true,
//model		: 'E.data.model.ditaMsg',
htmlMsg 	: '',
buildItems	: function() { 
	var me = this;
	me.items = [me.msgContainer, me.msgView]
},
initComponent : function() {
	var me = this;
	if (!me.store) { Ext.Error.raise('SrvMsg instansiatied without store')};
	me.msgContainer = Ext.create('Ext.container.Container', {
		html	: me.htmlMsg,
		cls		: me.bodyCls  
	});
	me.msgView =  Ext.create('Ext.view.View', {
		store			: me.store,
		itemSelector	: 'div.'+me.wrapCls ,
		emptyText		: 'there is no item to display'.lo(),
		tpl:['<tpl for=".">',
				'<div class="'+me.wrapCls +'">',
					'<h3 class="'+me.titleCls +'">{title}</h3>',
					'<div class="'+me.contentCls +'">',
						'<a target="" class="icon icon-no-repeat {type}_16"></a>',
						'<div  class="'+me.descCls +'">{shortDesc}</div>',
						'<div class="'+me.bodyCls +'">{body}</div>',
					'</div>',
				'</div>',
			'</tpl>',
			'<div class="x-clear"></div>']
	});
	me.buildItems();
	me.callParent();
}





/*::::*/
}
);
