//====================
//   BoundListViewKeyNav
//====================
// @lastpudate: 2014-10-22T12:18:31.013+02:00
// file: /db/es.dev/sencha/extClass/classes/widget/ui/BoundListViewKeyNav.js
Ext.define("E.widget.ui.BoundListViewKeyNav",
{
 "alias" : ["ui_boundlistviewkeynav", "view.navigation.boundlistviewkeynav"], "extend" : "Ext.view.BoundListKeyNav" 
,/*::::*/
initKeyNav : function(){
  this.callParent(arguments);
  //allow to delete selected items
  if(this.keyNav) {
    this.keyNav.addBindings({
      'del': this.onKeyDel, 
      'space': this.onKeyDel, 
      scope: this});
  }
},
onKeyDel : function(event) {
    var view, record ;
    if((view = this.getValueView())&&(record = view.getSelection())){
        view.onDataChange(record, 'remove') 
    }

},
onKeyLeft: function(keyEvent){
//   console.info("LEFT")
  this.getValueNavigationModel().onKeyLeft(keyEvent)
},
onKeyRight: function(keyEvent){
//   console.info("Right")
  this.getValueNavigationModel().onKeyRight(keyEvent)
},
getValueView : function() {
  return this.view.pickerField && this.view.pickerField.view
},
getValueNavigationModel : function() {
  var view = this.getValueView()
  return view && view.getNavigationModel()
},
enable : function() {
  this.callParent(arguments)
  var navmodel = this.getValueNavigationModel()
  if(navmodel) {navmodel.disable()}
},
disable : function() {
  this.callParent(arguments)
  var navmodel = this.getValueNavigationModel()
  if(navmodel) {navmodel.enable()}
}




/*::::*/
}
);
