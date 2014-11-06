require('./model');
var doT = require('dot/doT');

module.exports = Model.build('Template', 'templates', {
    element : {type:'Element'},
    parent : {type:'Element'}
}, {
    render : function(o){
        return (doT.template(this.data.value))(o);
    }
});
