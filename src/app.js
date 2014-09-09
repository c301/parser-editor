require([ 
    'js/compiler',
    'js/cms',
    'js/storage',
    'bower/lodash/dist/lodash',
    'dojo/domReady!'
], 
function ( Compiler, CMS, storage, _ ) {
    "use strict";
    var APP = {};

    console.log('APP start..');

    var afterInit = function () {
        console.log('DB was filled.')
        applyTree('DB was filled.');
    }
    storage.init( afterInit );

    function applyTree(message) {
        require(['dijit/Dialog'], function(Dialog){
            var dialog = new Dialog({ title: 'Hello!', content: message });
            dialog.show();
        });
    }
})
