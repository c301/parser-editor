require([ 'js/compiler', 'js/cms', 'js/storage', 'bower/lodash/dist/lodash' ], 
    function ( Compiler, CMS, storage, _ ) {
        console.log('APP start..');

        var afterInit = function () {
            console.log('DB was filled.')
        }
        storage.init( afterInit );
    })
