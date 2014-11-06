require('./model');

Model.build('Rule', 'rules', {
    base : {type:'Element'},
    target : {type:'Element'}
});
