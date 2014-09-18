require([ 
    'js/compiler',
    'js/cms',
    'js/storage',
    'bower/lodash/dist/lodash',
    'dojo/parser',
    'dojo/domReady!'
], 
function ( Compiler, CMS, storage, _, parser ) {
    "use strict";
    console.log('APP start..');

    var APP = {};
    var afterInit = function () {
        testingStaff('DB was filled.');

    }
    storage.init( afterInit );


    function testingStaff(message) {
        console.log('DB was filled.')

        require(['dojo/on', 'dojo/dom'], function (on, dom) {
            parser.parse();
        })

        require([ 'js/components/tree/libraryTree' ], function () {
            console.log('Tree loaded..');
        })

        require([ 'dojo/dnd/Source' ], function (Source) {
            var wishlist =
                new Source("workspace", {
                    isSource: false,
                    copyState: function () {
                        console.log(arguments);
                        return true;
                    },
                    onDropExternal: function (source, nodes, copy) {
                        console.log(arguments)
                        // summary:
                        //		called only on the current target, when drop is performed
                        //		from an external source
                        // source: Object
                        //		the source which provides items
                        // nodes: Array
                        //		the list of transferred items
                        // copy: Boolean
                        //		copy items, if true, move items otherwise

                        var oldCreator = this._normalizedCreator;
                        // transferring nodes from the source to the target
                        if(this.creator){
                            // use defined creator
                            this._normalizedCreator = function(node, hint){
                                return oldCreator.call(this, source.getItem(node.id).data, hint);
                            };
                        }else{
                            // we have no creator defined => move/clone nodes
                            if(copy){
                                // clone nodes
                                this._normalizedCreator = function(node /*=====, hint =====*/){
                                    var t = source.getItem(node.id);
                                    var n = node.cloneNode(true);
                                    n.id = dnd.getUniqueId();
                                    return {node: n, data: t.data, type: t.type};
                                };
                            }else{
                                // move nodes
                                this._normalizedCreator = function(node /*=====, hint =====*/){
                                    var t = source.getItem(node.id);
                                    source.delItem(node.id);
                                    return {node: node, data: t.data, type: t.type};
                                };
                            }
                        }
                        this.selectNone();
                        if(!copy && !this.creator){
                            source.selectNone();
                        }
                        this.insertNodes(true, nodes, this.before, this.current);
                        if(!copy && this.creator){
                            source.deleteSelectedNodes();
                        }
                        this._normalizedCreator = oldCreator;
                    },
                    creator: function ( node ) {
                        var item = node.item;
                        var div = document.createElement("div");
                        div.appendChild(document.createTextNode(item.name || "Product"));
                        var newNode = { node: div, data: item, type: [ 'libraryItem' ] };
                        return newNode;
                    },
                    checkAcceptance: function ( source, item ) {
                        console.log(source.getSelectedTreeNodes(), source.getItem(item.id), item);
                        return true;
                    }
            });
        })
        console.log('loaded!');
    }
})
