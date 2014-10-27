var workspaceStore = require('./workspaceStore');

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
  }
}

module.exports = WorkspaceActions;
