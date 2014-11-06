/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var _ = require('lodash');
var workspaceActions = require('../js/workspaceActions');

var WorkspaceAddNewForm = React.createClass({
  submitChanges: function (e) {
      var form = this.refs.editorForm.getDOMNode();
      var item = this.props.item;
      var elements = _.filter(form.elements, function (el) {
          return !!el.name;
      })
      var childToInstantiate = _.map( elements, function (el) {
          return {
              ancestor: el.name,
              value: el.value
          }
      })
      workspaceActions.createItemAndAttributes(
          this.props.addingItem, 
          this.props.item, 
          childToInstantiate
      );
      this.props.handleSubmit(e);
  },
  render: function () {
    var item = this.props.addingItem;

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
                    name={attribute.id}
                    defaultValue={attribute.value}
                    ref="itemName"
                />
            </div>
        );
        if( attribute.type == "struct" || attribute.type == "array"){
            inputEl = (
                <div className="form-group">
                    <label>{attribute.name}</label>
                    <input 
                        name={attribute.id}
                        value="on"
                        type="hidden" /> 
                    <span class="label">{attribute.value}
                        <a href="#" 
                            className="btn btn-link btn-xs">
                            <span className="glyphicon glyphicon-trash"></span>
                        </a>
                        <a href="#" 
                            className="btn btn-link btn-xs">
                            <span className="glyphicon glyphicon-plus"></span>
                        </a>
                    </span>
                </div>
            )
        }
        if( attribute.type == "bool" ){
            inputEl = (
                <div className="form-group">
                    <label>
                        <input 
                            name={attribute.id}
                            type="checkbox" /> 
                        {attribute.name}
                    </label>
                </div>
            )
        }

        content.push(
            {inputEl}
        );
      })

      return content;
    }

    var formContent = item ? getFormContent(item) : false;

    return (
      <form  role="form" ref="editorForm">
        {formContent}
        <button type="button"  onClick={this.submitChanges}
            className="btn btn-primary">
            Save changes
        </button>
      </form>
    )
  }
})

module.exports = WorkspaceAddNewForm;
