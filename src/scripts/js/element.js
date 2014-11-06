require('./model');
var Undo = require('./undo');
var stack = new Undo.Stack();
var MakeCommand = Undo.Command.extend({
    constructor: function(data) {
        this.subStack = new Undo.Stack();
        this.data = data;
    },
    execute: function() {
        var el = Element.make(data);
        this.data = el.data;
        if (el.ancestor().data.type == 'struct') {
            var childrenProtos = el.bases('ids');
            for (var i = 0; i < childrenProtos.length; i ++) {
                this.subStack.execute(new MakeCommand({
                    name: null,
                    value: null,
                    parent: el.data.id,
                    ancestor: childrenProtos[i],
                    type: 'instance'
                }));
            }
        }
    }
});

module.exports = Model.build('Element', 'elements', {
    parent : {type:'Element', complement:'children'}, // parent/parents/children(format, callback)
    ancestor : {type:'Element', complement:'descendants'} // ancestor/ancestors/descendants(format, callback)
}, {

    /**
     * Get rules where this == rule.target
     *
     * @param callback - function(row){return ...;}
     * @param format - rows|ids|models, default values is 'models'
     * @returns Array of rows, ids or models depending on format
     */
    parent : function(callback, format){},

     /**
     * Get rules where this == rule.target
     *
     * @param callback - function(row){return ...;}
     * @param format - rows|ids|models, default values is 'models'
     * @returns Array of rows, ids or models depending on format
     */
    targetRules : function(callback, format){
        var input = this.getFormatAndCallback(arguments);
        var ancestorsIds = this.ancestors('ids');
        return find('Rule', function(row){
            return ~ancestorsIds.indexOf(row.target) && input.callback(row);
        }, input.format);
    },

    /**
     * Get this children plus ancestors children
     *
     * @param callback - function(row){return ...;}
     * @param format - rows|ids|models, default values is 'models'
     * @returns Array of rows, ids or models depending on format
     */
    allChildren : function(callback, format){
        var input = this.getFormatAndCallback(arguments);
        var children = this.children(input.format, input.callback);
        var ancestors = this.ancestors();
        for (var i = 0; i < ancestors.length; i++) {
            children = children.concat(ancestors[i].children(input.format, input.callback));
        }
        return children;
    },

    /**
     * Get all children ancestors
     *
     * @param callback - function(row){return ...;}
     * @param format - rows|ids|models, default values is 'models'
     * @returns Array of rows, ids or models depending on format
     */
    allChildrenAncestors : function(callback, format){
        var input = this.getFormatAndCallback(arguments),
            protos = [],
            allChildren = this.allChildren();
        for(var i = 0; i < allChildren.length; i++){
            protos = protos.concat(allChildren[i].ancestors(input.type, input.callback));
        }
        return protos;
    },

    /**
     * Get template that mostly fits object and its parent
     *
     * @returns null|template
     */
    template : function(){
        var t = null,
            tc = this,
            tp = this.parent();
        do{
            tc = tc.ancestor();
            do {
                tp = tp.ancestor();
                result = (function(tp, tc) {
                    return Template.find(function (row) {
                        return row.object == tc.data.id && row.parent == tp.data.id && row.value != null;
                    });
                })(tp, tc);
                if(result.length){
                    t = result[0];
                }
            } while(t == null && tp != null);
        } while(t == null && tc != null);
        return t;
    },

    /**
     * Get objects that can be instantiated here except those that are already instantiated
     *
     * @param callback - function(row){return ...;}
     * @param format - rows|ids|models, default values is 'models'
     * @returns Array of rows, ids or models depending on format
     */
    bases : function(callback, format){
        var input = this.getFormatAndCallback(arguments),
            allChildrenAncestorsIds = this.allChildrenAncestors('ids'),
            rules = this.targetRules(),
            bases = [];
        for(var i = 0; i < rules.length; i++){
            bases = bases.concat(
                rules[i].base(input.format, function(row){
                    return input.callback(row) && !~allChildrenAncestorsIds.indexOf(row.id);
                })
            );
        }
        return bases;
    },

    /**
     * Get this name or ancestor's one
     *
     * @param full - if true than name will not be stripped
     * @returns null|string
     */
    name : function(full){
        if((name = this.data.name) == null){
            var ancestorsWithNames = this.ancestors(function(row){return row.name != null});
            if(!ancestorsWithNames.length){
                return null;
            }
            name = ancestorsWithNames[0].data.name;
        }
        return typeof full == 'undefined' || !full ? name.replace(/^.+\/([^\/]+)$/, '$1') : name;
    },

    /**
     * Evaluates own tempate
     *
     * @returns Callback
     */
    render : function(){
        var t = this.template();
        return t == null ? '' : t.render(this);
    }
});
