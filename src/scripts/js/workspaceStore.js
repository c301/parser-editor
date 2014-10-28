'use strict';

var _ = require('lodash');

var guid = (function() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return function() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };
})();

var workspaceState = require('./workspaceStoreData');
// if(localStorage['workspaceState']){
//     localStorage['workspaceState'] = JSON.stringify(workspaceState);
// }

// workspaceState = JSON.parse( localStorage['workspaceState'] || null ) || workspaceState;

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
            return item.root;
        }
        var workspaceItems = _.filter(this.workspaceState, onlyRoot);
        return workspaceItems;
    },
    getItemAttributes: function (item) {
        var attributes = [];
        var ancestor = null;
        if(item.type !== "instance"){
            ancestor = item;
        }else{
            ancestor = this.getByItemId(item.ancestor);
        }

        var filterAttributes = function (wItem) {
            return wItem.type != 'instance' && wItem.parent == ancestor.id;
        }
        var workspaceItems = _.filter(this.workspaceState, filterAttributes);

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
        var ancestor = self.getByItemId(item.ancestor);
        //Uncomment later
        /*
         * this.workspaceRules.forEach(function (rule) {
         *     if(rule.base == item.ancestor){
         *         possibleChild.push(self.getByItemId(rule.target))
         *     }
         * })
         */

        this.workspaceState.forEach(function (wItem) {
            var structOrArray = wItem.type == "struct" || wItem.type == "array";
            if(wItem.parent == ancestor.id && structOrArray){
                possibleChild.push(wItem)
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
        newItem.id = guid();

        var newRule = {
            id: guid(),
            base: newItem.ancestor,
            target: newItem.id
        };

        // console.log('Creating new op:', newItem, newRule);
        this.workspaceState.push(newItem);
        this.workspaceRules.push(newRule);
        this.emitChanges();
    },
    instantiateClass: function (ancestor, parentItem) {
        // console.log('store instantiated', ancestor, parentItem);
        var newItem = _.clone(ancestor);
        //crap! redo.
        newItem.id = guid();
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
        newItem.id = guid();
        // console.log('New Item created', newItem);
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
}

module.exports = workspaceStore;
