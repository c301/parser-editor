var dojoConfig = {
    async: true,
    isDebug: true,
    paths: {
        'js': '/../js',
        'test': '/../test',
        'bower': '/../bower_components',
    },
    deps: [ 'app.js' ],
    callback: function () {
        console.log('init..')
    }
}
