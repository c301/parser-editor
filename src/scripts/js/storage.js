'use strict';

var db;
if(1 || !localStorage['db']){
    db = {
        elements : [
            {id: 0,name:'Workspace',value:null,parent:null,ancestor:null,type:"array"},
            {id: 1,name:'Configs',value:null,parent:null,ancestor:null,type:"array"},
            {id: 2,name:'Configs',value:null,parent:0,ancestor:1,type:"instance"},
            {id: 3,name:'Config',value:null,parent:null,ancestor:null,type:"array"},
            {id: 4,name:'Config/Row',value:null,parent:null,ancestor:null,type:"struct"},
            {id: 5,name:'Config/Row/Operations',value:null,parent:null,ancestor:null,type:"list"},
            {id: 6,name:'Config/Row/Operations/Operation',value:null,parent:null,ancestor:null,type:"abstract"},
            {id: 7,name:'Config/Row/Operations/Operation/Parameter',value:null,parent:null,ancestor:null,type:"abstract"},
            {id: 8,name:'Config/Row/Operations/Operation/Parameter/Number',value:null,parent:null,ancestor:7,type:"scalar"},
            {id: 9,name:'Config/Row/Operations/Operation/Parameter/Boolean',value:null,parent:null,ancestor:7,type:"scalar"},
            {id:10,name:'Config/Row/Operations/Operation/Parameter/Null',value:null,parent:null,ancestor:7,type:"scalar"},
            {id:11,name:'Config/Row/Operations/Operation/Parameter/String',value:null,parent:null,ancestor:7,type:"scalar"},
            {id:12,name:'Config/Row/Operations/Operation/RandomInt',value:null,parent:null,ancestor:6,type:"struct"},
            {id:13,name:'Config/Row/Operations/Operation/RandomInt/type',value:'randomInt',parent:12,ancestor:11,type:"instance"},
            {id:14,name:'Config/Row/Operations/Operation/RandomInt/from',value:null,parent:null,ancestor:8,type:"scalar"},
            {id:15,name:'Config/Row/Operations/Operation/RandomInt/to',value:null,parent:null,ancestor:8,type:"scalar"},
            {id:16,name:'Config/Row/Operations/Operation/CurrentDocument',value:null,parent:null,ancestor:6,type:"struct"},
            {id:17,name:'Config/Row/Operations/Operation/CurrentDocument/type',value:'current_document',parent:16,ancestor:11,type:"instance"},
            {id:18,name:'RandomDocument',value:null,parent:null,ancestor:null,type:"macro"},
            {id:19,name:'Config/Row/Operations/Operation/RandomIntMoreThan10',value:null,parent:null,ancestor:12,type:"struct"},
            {id:20,name:null,value:10,parent:19,ancestor:5,type:"instance"},
            {id:21,name:null,value:null,parent:null,ancestor:5,type:"instance"}
        ],
        macros : [
            {macro:18,rule:111,pos:111}
        ],
        rules : [
            {id:0,base:3, target:1},
            {id:1,base:4, target:3},
            {id:2,base:5, target:4},
            {id:3,base:6, target:5},
            {id:4,base:14,target:12},
            {id:5,base:15,target:12}
        ],
        templates : [
            {id:0,element:3, parent:1,value:'[{{=it.renderChildren(",")}}]'},
            {id:1,element:4, parent:3,value:'{“name”:”{{=it.data.name}}”,{{=it.renderChildren(",")}}}'},
            {id:2,element:5, parent:4,value:'“operations”:[{{=it.renderChildren(",")}}]'},
            {id:3,element:6, parent:5,value:'{{{c=it.allChildren();ca=[];for(k in c)ca[]=’”’+c[k].data.name+’”:’+c[k].render(); }}{{=ca.join(",")}}}'},
            {id:4,element:7, parent:6,value:'{{=it.data.value}}'},
            {id:5,element:11,parent:6,value:'“{{=it.data.value.replace(/\"/g,"\\\"")}}”'}
        ]
    };
    localStorage['db'] = JSON.stringify(db);
} else {
    db = JSON.parse( localStorage['db'] );
}

module.exports = {
    db : db,
    save : function() {
        localStorage['db'] = JSON.stringify(this.db)
    }
};
