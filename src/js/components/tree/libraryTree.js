define( function (  ) {
    require([
        "dojo/aspect", "dojo/json", "dojo/query", "dojo/store/Memory", "dojo/store/Observable",
    "dijit/Tree", "dijit/tree/ObjectStoreModel", "dijit/tree/dndSource", "dojo/text!./test/tree-data.js"
    ], function(aspect, json, query, Memory, Observable,
    Tree, ObjectStoreModel, dndSource, data){
        // set up the store to get the tree data, plus define the method
        // to query the children of a node
        var governmentStore = new Memory({
            data: json.parse(data),
            getChildren: function(object){
                return this.query({parent: object.id});
            }
        });

        // To support dynamic data changes, including DnD,
        // the store must support put(child, {parent: parent}).
        // But dojo/store/Memory doesn't, so we have to implement it.
        // Since our store is relational, that just amounts to setting child.parent
        // to the parent's id.
        aspect.around(governmentStore, "put", function(originalPut){
            return function(obj, options){
                if(options && options.parent){
                    obj.parent = options.parent.id;
                }
                return originalPut.call(governmentStore, obj, options);
            }
        });

        // give store Observable interface so Tree can track updates
        governmentStore = new Observable(governmentStore);

        // set up the model, assigning governmentStore, and assigning method to identify leaf nodes of tree
        var governmentModel = new ObjectStoreModel({
            store: governmentStore,
            query: {id: 'root'},
            mayHaveChildren: function(object){
                var children = governmentStore.query({parent: object.id});
                return !!children.total;
            }
        });


        var tree = new Tree({
            showRoot: false,
            model: governmentModel,
            // define the drag-n-drop controller
            dndController: function( tree, options ){
                options.copyState = function () {
                    return true;
                }
                return dndSource( tree, options );
            }

        }, "library-tree");

        tree.startup();

        query("#add-new-child").on("click", function(){
            // get the selected object from the tree
            var selectedObject = tree.get("selectedItems")[0];
            if(!selectedObject){
                return alert("No object selected");
            }

            // add a new child item
            var childItem = {
                name: "New child",
                id: Math.random()
            };
            governmentStore.put(childItem, {
                overwrite: true,
                dndParams: {
                    itemCreator: function () {
                        console.log(arguments);
                    }
                },
                parent: selectedObject
            });
        });
        tree.on("dblclick", function(object){
            object.name = prompt("Enter a new name for the object");
            governmentStore.put(object);
        }, true);
    });
})
