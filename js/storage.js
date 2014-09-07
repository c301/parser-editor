define([ 'test/test-data' ], function () {
    console.log('Storage loading..');

    //fill db with arbitrary data
    function _init( callback ) {
        callback();
    }
    function _get(key, callback) {
        callback(localStorage[key]);
    }
    function _set(key, value, callback) {
        localStorage[key] = value;
        callback(true);
    }
    return {
        init: _init,
        get: _get,
        set: _set
    };
});
