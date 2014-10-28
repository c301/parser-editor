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
      var attributes = workspaceStore.getItemAttributes(item);
      console.log('attributes', attributes);
      _.each( attributes, function ( attribute ) {
        var inputEl = (
            <div className="form-group">
                <label>{attribute.name}</label>
                <input type="text"
                    className="form-control"
                    defaultValue={attribute.value}
                    ref="itemName"
                />
            </div>
        )
        if( attribute.type == "struct" || attribute.type == "array"){
            inputEl = (
                <div className="form-group">
                    <label>{attribute.name}</label>
                    <span class="label">{attribute.value}
                        <a href="#" 
                            className="btn btn-link btn-xs">
                            <span className="glyphicon glyphicon-trash"></span>
                        </a>
                    </span>
                </div>
            )
        }
        if( attribute.type == "bool" ){
            inputEl = (
                <div className="form-group">
                    <label><input type="checkbox" /> {attribute.name}</label>
                </div>
            )
        }

        content.push(
            {inputEl}
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
      this.innerWorkspace = (
            <div className="form-group">
                <Workspace item={item} showControls={false}/>
            </div>
      )
    }
    var formContent = getFormContent(item);

    return (
        <form  role="form" ref="itemEditor">
            <div className="form-group">
                <label>Name</label>
                <input type="text"
                    className="form-control"
                    defaultValue={item.name}
                    ref="itemName"
                />
            </div>
            <hr/>
            {formContent}
            <hr/>
            {this.innerWorkspace}
            <hr/>
            <button type="button"  onClick={this.submitChanges}
                className="btn btn-primary">Save changes</button>
        </form>
    )
  }
})
module.exports = WorkspaceItemEditorForm;

