var profile = (function(){
    return {
        basePath: ".",
        releaseDir: "../app",
        releaseName: "lib",
        action: "release",
        packages:[{
            name: "dojo",
            location: "bower_components/dojo"
        }],
        resourceTags: {
            amd: function(filename, mid) {
                return /\.js$/.test(filename);
            }
        },
        layers: {
            "dist": {
                customBase: true,
                boot: true
            }
        }
    };
})();
