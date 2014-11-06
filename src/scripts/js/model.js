'use strict';

var Storage = require('./storage');

/**
 * Detects format and callback among arguments passed
 *
 * @param args
 *
 * @returns {{format: string, callback: Function}}
 */
var getFormatAndCallback = function(args){
    var callback = function(){return true;},
        format = 'models';
    for(var i = 0; i < args.length; i++){
        if(typeof args[i] == 'function'){
            callback = args[i];
        }else{
            format = args[i];
        }
    }
    return {format:format,callback:callback};
};

window['Model'] = {
    /**
     * Builds new Model type
     *
     * @param type - type name
     * @param table - table in db
     * @param relations - {relationName : {type:RelationType[, complement:reverseRelationName]}}
     * @param props - extra properties and methods
     *
     * @returns {Function} - Model type
     */
    build : function(type, table, relations, props) {
        /**
         * Type constructior
         *
         * @param id - ID in table
         */
        var model = function(id){
            this.data = Storage.db[this.table][id];
        };
        /** Extra properties */
        for (var prop in props) {
            if (props.hasOwnProperty(prop)) {
                model.prototype[prop] = props[prop];
            }
        }
        /** Table name */
        model.table = model.prototype.table = table;
        /** Type name */
        model.type = model.prototype.type = type;
        /**
         * Find data in table
         *
         * @param {Function} callback - function to filter on
         * @param {String} format - return format ids | rows | models (default)
         *
         * @returns {Array}
         */
        model.find = function(callback, format) {
            var row,
                rows = [],
                table = this.table,
                input = getFormatAndCallback(arguments);
            for(var id in Storage.db[table]){
                if (!Storage.db[table].hasOwnProperty(id)) {
                    continue;
                }
                if(!!Storage.db[table][id] && input.callback(row = Storage.db[table][id])){
                    switch (input.format) {
                        case 'ids':
                            rows.push(id);
                            break;
                        case 'rows':
                            rows.push(Storage.db[table][id]);
                            break;
                        case 'models':default:
                            rows.push(new window[this.type](id));
                    }
                }
            }
            return rows;
        };
        /**
         * Makes new row in db
         *
         * @param data
         *
         * @returns {this}
         */
        model.make = function(data) {
            var id = Storage.db[this.table].length;
            data.id = id;
            Storage.db[this.table][id] = data;
            return new window[this.type](id);
        };
        /**
         * Updates a row in db
         *
         * @param data
         *
         * @returns {*} - old data
         */
        model.prototype.update = function(data) {
            var oldData = this.data;
            for (var i in Storage.db[this.table][this.data.id]) {
                if (Storage.db[this.table][this.data.id].hasOwnProperty(i) && data.hasOwnProperty(i)) {
                    Storage.db[this.table][this.data.id][i] = data[i];
                }
            }
            this.data = Storage.db[this.table][this.data.id];
            return oldData;
        };
        /**
         * Removes a row in db
         *
         * @returns {*} - old data
         */
        model.prototype.remove = function() {
            Storage.db[this.table][this.data.id] = null;
            return this.data;
        };
        /**
         * Relations
         */
        for(var field in relations){
            if (!relations.hasOwnProperty(field)) {
                continue;
            }
            var relation = relations[field],
                rtype = relation.type;
            /** Simple relation */
            model.prototype[field] = function(field, rtype){
                return function(){
                    var self = this;
                    if(self.data[field] == null){
                        return null;
                    }
                    var input = getFormatAndCallback(arguments),
                        result = window[rtype].find(function(row){return row.id == self.data[field] && input.callback(row);}, input.format);
                    return result.length ? result[0] : null;
                }
            }(field, rtype);
            /** Self relations */
            if(type == rtype){
                /** Recursive */
                model.prototype[field + 's'] = function(field){
                    return function(){
                        var self = this;
                        if(self.data[field] == null){
                            return [];
                        }
                        var input = getFormatAndCallback(arguments);
                        var node = self[field]();
                        var result = [];
                        if(input.callback(node.data)){
                            result = [self[field](input.format)]
                        }
                        return result.concat(node[field + 's'](input.format, input.callback));
                    }
                }(field);
                /** Reverse */
                model.prototype[relation.complement] = function(field, rtype){
                    return function(){
                        var self = this;
                        var input = getFormatAndCallback(arguments);
                        return window[rtype].find(function(row){
                            return row[field] == self.data.id && input.callback(row);
                        }, input.format);
                    }
                }(field, rtype);
            }
        }

        return window[type] = model;
    }
};
