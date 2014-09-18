define([
    'dojo/_base/declare', 
    'dijit/Dialog',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!./dialog.html',
    'dijit/form/Button'
], function(declare, Dialog, _WidgetsInTemplateMixin, template){
	return declare('js.dialog.dialog', [Dialog, _WidgetsInTemplateMixin], {
		title: 'Alert',
		templateString: template
	});
});
