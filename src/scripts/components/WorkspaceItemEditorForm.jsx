/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var _ = require('lodash');
var workspaceActions = require('../js/workspaceActions');

var WorkspaceItemEditorForm = React.createClass({
  getInitialState: function () {
    return {
      'Workspace': null
    }
  },
  submitChanges: function () {
    this.props.handleSubmit();
    var nameEl = this.refs.itemName.getDOMNode();
    var updates = {
      name: nameEl.value
    }
    console.log('update with name', updates.name)
    workspaceActions.updateItem(this.props.item.id, updates);
  },
  render: function () {

    function getFormContent(item) {
      var content = [];
      var parameters = [1,2,3,4];
      _.each( parameters, function ( parameter ) {
        content.push(
          <div className="form-group">
            <label>Item Name {parameter}</label>
            <input type="text"
              className="form-control"
              defaultValue={item.name}
              ref="itemName"
            />
          </div>
        );
      })

      return content;
    }

    var item = this.props.item;
    // var children = workspaceStore.getChildrjnForItem(item);
    this.innerWorkspace = false;
    // return false;

    if(this.props.editing && !this.innerWorkspace){
      var Workspace = require('./Workspace');
      var item = this.props.item;
      this.innerWorkspace = <Workspace item={item} showControls={false}/>;
    }
    var formContent = getFormContent(item);

    return (
      <form  role="form" ref="itemEditor">
          <div className="form-group">
            <label>Item Name</label>
            <input type="text"
              className="form-control"
              defaultValue={item.name}
              ref="itemName"
            />
          </div>

          {formContent}

          <div className="checkbox">
          <label><input type="checkbox" /> Check me out</label>
        </div>
        {this.innerWorkspace}
        <button type="button"  onClick={this.submitChanges}
        className="btn btn-primary">Save changes</button>
      </form>
    )
  }
})
module.exports = WorkspaceItemEditorForm;

