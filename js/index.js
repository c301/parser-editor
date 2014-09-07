require.config({
    baseUrl: 'js',
    paths: {
        'lodash': '../bower_components/lodash/dist/lodash.min'
        'Q': '../bower_components/q/q'
    }
});

// Start the main app logic.
require([ 'compiler', 'cms', 'storage', 'lodash', 'Q' ], function( Compiler, CMS, storage, _, Q) {
    console.log('APP start..');

    var afterInit = function () {
        console.log('DB was filled.')
    }
    storage.init( afterInit );
});
