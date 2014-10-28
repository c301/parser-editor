var data = {
    rules : [
        // {id:0, base:0, target: 1},
        // {id:0,base:4, target:5},
        // {id:0,base:5, target:12},
        // {id:0,base:5, target:16},
        // {id:0,base:12, target:13},
        // {id:0,base:12, target:14},
        // {id:0,base:12, target:15},
        // {id:0,base:16, target:17}
    ],
    objects : [
        {id: 0, name:'SyndicationGroup', value:null, parent:null, ancestor:null, type:"struct", root: true},
        {id: 1, name:'SyndicationGroup/Name', value:null, parent:0, ancestor:null, type:"scalar"},
        {id: 2, name:'SyndicationGroup/IntegrationPattern', value:null, parent:0, ancestor:null, type:"scalar"},
        {id: 3, name:'SyndicationGroup/SyndicationConfig', value:null, parent:0, ancestor:null, type:"array"},
        {id: 9, name:'SyndicationGroup/NormalizeSpace', value:null, parent:0, ancestor:null, type:"bool"},
        {id: 4, name:'SyndicationConfig/Row', value:null, parent:3, ancestor:null, type:"struct"},
        {id: 5, name:'Row/Name', value:null, parent:4, ancestor:null, type:"scalar"},
        {id: 6, name:'Row/Operations', value:null, parent:4, ancestor:null, type:"array"},
        {id: 7, name:'Operations/Operation', value:null, parent:6, ancestor:null, type:"struct"},
        {id: 8, name:'Operation/Type', value:null, parent:7, ancestor:null, type:"scalar"},

        // {id: 0,name:'Workspace',value:null,parent:null,ancestor:null,type:"list"},
        // {id: 1,name:'Configs',value:null,parent:null,ancestor:null,type:"array", root: true},
        // {id: 3,name:'Config',value:null,parent:null,ancestor:1,type:"instance"},  //initial empty config
        //
        // {id: 4,name:'Config/Row',value:null,parent:null,ancestor:null,type:"struct"},
        // {id: 5,name:'Config/Row/Operations',value:null,parent:null,ancestor:null,type:"list"},
        // {id: 6,name:'Config/Row/Operations/Operation',value:null,parent:null,ancestor:null,type:"abstract"},
        // {id: 7,name:'Config/Row/Operations/Operation/Parameter',value:null,parent:null,ancestor:null,type:"abstract"},
        // {id: 8,name:'Config/Row/Operations/Operation/Parameter/Number',value:null,parent:null,ancestor:7,type:"scalar"},
        // {id: 9,name:'Config/Row/Operations/Operation/Parameter/Boolean',value:null,parent:null,ancestor:7,type:"scalar"},
        // {id:10,name:'Config/Row/Operations/Operation/Parameter/Null',value:null,parent:null,ancestor:7,type:"scalar"},
        // {id:11,name:'Config/Row/Operations/Operation/Parameter/String',value:null,parent:null,ancestor:7,type:"scalar"},
        //
        // {id:12,name:'Config/Row/Operations/Operation/RandomInt',value:null,parent:null,ancestor:6,type:"struct"},
        // {id:13,name:'Config/Row/Operations/Operation/RandomInt/type',value:'randomInt',parent:12,ancestor:11,type:"instance"},
        // {id:14,name:'Config/Row/Operations/Operation/RandomInt/from',value:null,parent:null,ancestor:8,type:"scalar"},
        // {id:15,name:'Config/Row/Operations/Operation/RandomInt/to',value:null,parent:null,ancestor:8,type:"scalar"},
        //
        // {id:16,name:'Config/Row/Operations/Operation/CurrentDocument',value:null,parent:null,ancestor:6,type:"struct"},
        // {id:17,name:'Config/Row/Operations/Operation/CurrentDocument/type',value:'current_document',parent:16,ancestor:11,type:"instance"},
        //
        // {id:18,name:'RandomDocument',value:null,parent:null,ancestor:null,type:"macro"},
        //
        // {id: 19,name:'Projects',value:null,parent:null,ancestor:null,type:"array", root: true},
        // {id: 20,name:'Configurations',value:null,parent:null,ancestor:null,type:"array", root: true}
    ],
    macros : [
        {macro:18,rule:111,pos:111}
    ],
    templates : [
        {id:0,object:3, parent:1,view:null,value:'[{{=it.renderChildren(",")}}]'},
        {id:1,object:4, parent:3,view:null,value:'{“name”:”{{=it.data.name}}”,{{=it.renderChildren(",")}}}'},
        {id:2,object:5, parent:4,view:null,value:'“operations”:[{{=it.renderChildren(",")}}]'},
        {id:3,object:6, parent:5,view:null,value:'{{{c=it.allChildren();ca=[];for(k in c)ca[]=’”’+c[k].data.name+’”:’+c[k].render(); }}{{=ca.join(",")}}}'},
        {id:4,object:7, parent:6,view:null,value:'{{=it.data.value}}'},
        {id:5,object:11,parent:6,view:null,value:'“{{=it.data.value.replace(/\"/g,"\\\"")}}”'},
        {id:6,object:2, parent:1,view:'Workspace: {{=it.data.name}}',value:null},
        {id:7,object:12,parent:5,view:"rand [{{=it.child(14).data.value}} → {{=it.child(15).data.value}}]",value:null}
    ]
};

module.exports = data;
