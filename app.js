require([ 
    'js/compiler',
    'js/cms',
    'js/storage',
    'bower/lodash/dist/lodash',
    'dojo/domReady!'
], 
function ( Compiler, CMS, storage, _ ) {
    "use strict";

    console.log('APP start..');

    var afterInit = function () {
        console.log('DB was filled.')
    }
    storage.init( afterInit );
})
