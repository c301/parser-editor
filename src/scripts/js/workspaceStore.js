'use strict';

var _ = require('lodash');

var workspaceState = {
  objects : [
    {id: 0,name:'Workspace',value:null,parent:null,ancestor:null,type:"list"},
    {id: 1,name:'Configs',value:null,parent:null,ancestor:null,type:"array", root: true},
    {id: 3,name:'Config',value:null,parent:null,ancestor:1,type:"instance"},  //initial empty config

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

    {id: 19,name:'Projects',value:null,parent:null,ancestor:null,type:"array", root: true},
    {id: 20,name:'Configurations',value:null,parent:null,ancestor:null,type:"array", root: true}
  ],
  macros : [
    {macro:18,rule:111,pos:111}
  ],
  rules : [
    {id:0,base:1, target:4},
    {id:0,base:4, target:5},
    {id:0,base:5, target:12},
    {id:0,base:5, target:16},
    {id:0,base:12, target:13},
    {id:0,base:12, target:14},
    {id:0,base:12, target:15},
    {id:0,base:16, target:17}
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
// if(localStorage['workspaceState']){
//     localStorage['workspaceState'] = JSON.stringify(workspaceState);
// }

workspaceState = JSON.parse( localStorage['workspaceState'] || null ) || workspaceState;

window.workspaceStore = {
  workspaceState: workspaceState.objects,
  workspaceRules: workspaceState.rules,
  counter: 0,
  listeners: [],
  compile: function ( item ) {
    var toReturn = '';
    if(item){
      var children = this.getChildrenForItem(item);
      if(children){
        toReturn += item.id ;
        children.forEach(function (item) {
          toReturn +=  workspaceStore.compile(item);
        });
      }else{
        toReturn = item.id;
      }
    }else{
      toReturn = this.getRootItems().map(function (item) {
        return workspaceStore.compile(item);
      });
      toReturn.join('');
    }
    return toReturn;
  },
  getByItemId: function (id) {
    return _.find(this.workspaceState, function (item) {
      return item.id == id;
    })
  },
  getChildrenForItem: function (rootItem) {
    var byParent = function (item) {
      return rootItem.id == item.parent;
    }
    var children = _.filter(this.workspaceState, byParent);
    return children;
  },
  getInstansesForItem: function (rootItem) {
    var byParent = function (item) {
      return rootItem.id == item.ancestor;
    }
    var children = _.filter(this.workspaceState, byParent);
    return children;
  },
  getTypeForItem: function (rootItem) {
    var ancestor = function (item) {
      return rootItem.ancestor == item.id;
    }
    var itemAncestor = _.find(this.workspaceState, ancestor);
    if(itemAncestor){
      return itemAncestor.name;
    }else{
      return 'Generic type';
    }
  },
  getRootArrays: function () {
    var onlyRoot = function (item) {
      return item.parent == null && item.type == 'array';
    }
    var workspaceItems = _.filter(this.workspaceState, onlyRoot);
    return workspaceItems;
  },
  getInstanses: function (items) {
    var instanses = {};
    var self = this;
    _.each(items, function (item) {
      instanses[item.id] = self.getInstansesForItem(item);
    })
    return instanses;
  },
  getRootItems: function () {
    var onlyRoot = function (item) {
      return item.parent == null && item.ancestor != null && item.type == 'instance';
    }
    var workspaceItems = _.filter(this.workspaceState, onlyRoot);
    return workspaceItems;
  },
  getPossibleChild: function (item) {
    var self = this;
    var possibleChild = [];
    this.workspaceRules.forEach(function (rule) {
      if(rule.base == item.ancestor){
        possibleChild.push(self.getByItemId(rule.target))
      }
    })
    return possibleChild;
  },
  addOperation: function ( operation ) {
    var emptyItem = {
      name:'Config/Row/Operations/Operation/',
      value:null,
      parent:null,
      ancestor:5,
      type:"struct"
    };
    var newItem = emptyItem;
    newItem.name += operation.type;

    //crap! redo.
    newItem.id = this.workspaceState[this.workspaceState.length - 1].id + 1;

    var newRule = {
      id: this.workspaceRules[this.workspaceRules.length - 1].id + 1,
      base: newItem.ancestor,
      target: newItem.id
    };

    console.log('Creating new op:', newItem, newRule);
    this.workspaceState.push(newItem);
    this.workspaceRules.push(newRule);
    this.emitChanges();
  },
  instantiateClass: function (idToInstantiate, parentItem) {
    // console.log('store instantiated', idToInstantiate, parentItem);
    var ancestor = this.getByItemId(idToInstantiate);
    var newItem = _.clone(ancestor);
    //crap! redo.
    newItem.id = this.workspaceState[this.workspaceState.length - 1].id + 1;
    newItem.type = 'instance';
    newItem.ancestor = ancestor.id;
    newItem.parent = parentItem.id;
    this.workspaceState.push(newItem);
    this.emitChanges();
  },
  createItem: function (fields) {
    var emptyItem = {name:'',value:null,parent:null,ancestor:null,type:"instance"};
    var newItem = _.assign(emptyItem, fields);
    //crap! redo.
    newItem.id = this.workspaceState[this.workspaceState.length - 1].id + 1;
    this.workspaceState.push(newItem);
    this.emitChanges();
  },
  update: function (id, updates) {
    var updateById = function (item) {
      if(item.id == id){
        var newItem = _.assign(item, updates)
        return newItem;
      }else{
        return item;
      }
    }
    this.workspaceState = _.map(this.workspaceState, updateById )
  },
  deleteItem: function (item) {
    var removeItemAndChild = function (nextItem) {
      return ( item.id != nextItem.id) && (item.id != nextItem.parent);
    }
    this.workspaceState = _.filter(this.workspaceState, removeItemAndChild)
    this.emitChanges();
  },
  sortItem: function (item1, item2, itemPlacement) {
    if(item1.parent != item2.parent){
      return false;
    }

    var from = _.findIndex(this.workspaceState, function (item) {
      return item.id == item1.id;
    })
    var to = _.findIndex(this.workspaceState, function (item) {
      return item.id == item2.id;
    })

    if(from < to) to--;
    if(itemPlacement == "after") to++;
    this.workspaceState.splice(to, 0, this.workspaceState.splice(from, 1)[0]);

    this.emitChanges();
  },
  addChangeListener: function (cb) {
    var index = this.listeners.push(cb) - 1;
    return index;
  },
  removeChangeListener: function (listenerId) {
    this.listeners = _.reject(this.listeners, function (v, index) {
      return index === listenerId;
    });
  },
  emitChanges: function () {
    workspaceState.objects = this.workspaceState;
    workspaceState.rules = this.workspaceRules;

    localStorage['workspaceState'] = JSON.stringify(workspaceState);
    this.listeners.forEach(function (cb) {
      cb();
    })
  }
};

module.exports = workspaceStore;
