//====================
//   BoundValueKeyNav
//====================
// @lastpudate: 2014-10-22T12:18:30.992+02:00
// file: /db/es.dev/sencha/extClass/classes/widget/ui/BoundValueKeyNav.js
Ext.define("E.widget.ui.BoundValueKeyNav",
{
 "alias" : ["ui_boundvaluekeynav", "view.navigation.boundvaluekeynav"], "extend" : "Ext.view.NavigationModel" 
,/*::::*/
initKeyNav : function(){
  this.callParent(arguments);
  //allow to delete selected items
  this.keyNav.addBindings({
      'del': this.onKeyDel, 
      'space': this.onKeyDel, 
      scope: this});
},

onKeyDown: function(keyEvent){
  this.view.pickerField.expand()
},
onKeyDel: function(keyEvent){
  this.view.onDataChange(keyEvent.record, 'remove')
}


/*::::*/
}
);
