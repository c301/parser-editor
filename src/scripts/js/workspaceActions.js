var workspaceStore = require('./workspaceStore');
var _ = require('lodash');

var WorkspaceActions = {
  createItem: function (fields) {
    workspaceStore.createItem(fields);
  },
  updateItem: function (id, updates) {
    workspaceStore.update(id, updates);
  },
  deleteItem: function (item) {
    workspaceStore.deleteItem(item);
  },
  instantiateClass: function (idToInstantiate, parentItem) {
    workspaceStore.instantiateClass(idToInstantiate, parentItem);
  },
  sortItem: function (item1, item2) {
    workspaceStore.sortItem(item1, item2);
  },
  addOperation: function (operation) {
    workspaceStore.addOperation(operation);
  },
  createItemAndAttributes: function ( ancestorItem, parentItem, attributes) {
      var newId = workspaceStore.createItem({
          ancestor: ancestorItem.id,
          parent: parentItem.id
      });
      _.each(attributes, function (attr) {
            workspaceStore.createItem({
                value: attr.value,
                ancestor: attr.ancestor,
                parent: newId
            });
      })
  }
}

module.exports = WorkspaceActions;
