requirejs.config({
    baseUrl: 'js',
    paths: {
        jquery: '/bower_components/jquery/dist/jquery.min',
        bootstrap: '/bower_components/bootstrap/dist/js/bootstrap.min',
        lodash: '/bower_components/lodash/dist/lodash.min',
        react: '/bower_components/react/react',
        // JSXTransformer: '/bower_components/react/JSXTransformer',
        JSXTransformer: 
            '/bower_components/jsx-requirejs-plugin/js/JSXTransformer-0.11.1',
        text: '/bower_components/requirejs-text/text',
        jsx: '/bower_components/jsx-requirejs-plugin/js/jsx'
    }
});

require([
    'jquery',
    'lodash',
    'react',
    'jsx!/components/Main',
    'bootstrap',

],function ( $, _, React, Main ) {
    console.log('starting..');
    //entrypoint
})
