// Configure application.
var appConfig = {
    // Get base url from current url.
    baseUrl: location.href.substring(0,location.href.lastIndexOf("/")+1)
};

var dojoConfig = {
    async: true,
    isDebug: true,
    paths: {
        'js': '/../js',
        'test': '/../test',
        'bower': '/../bower_components',
    },
    packages: [
        {
            location: '/js/vendor/dbootstrap',
            name: 'dbootstrap'
        }
    ],
    deps: [ 'app.js' ],
    callback: function () {
        console.log('init..')
    }
}
