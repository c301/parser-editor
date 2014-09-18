define(function () {
    var app = {};
    "use strict";
    console.log('CMS loading..');

    app.alert = function (message) {
        require(['dijit/Dialog'], function(Dialog){
            var dialog = new Dialog({ title: 'Hello!', content: message });
            dialog.show();
        });
    }

    app.notification = function (message) {
        require(['js/components/dialog/dialog'], function(Dialog){
            var dialog = new Dialog({
                content: message
            });
            dialog.show();
        });
    }
    return app;
});

