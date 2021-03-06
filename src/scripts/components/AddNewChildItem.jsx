/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var _ = require('lodash');
var $ = jQuery = require("jquery");
var workspaceStore = require('../js/workspaceStore');
var workspaceActions = require('../js/workspaceActions');
var WorkspaceAddNewForm = require('./WorkspaceAddNewForm');

var AddNewWorkspaceItem = React.createClass({
  getInitialState: function () {
    return {
      adding: false,
      addingItem: null
    }
  },
  handleSubmit: function (e) {
    var $modal = $(this.refs.itemAddModal.getDOMNode());
    $modal.modal('hide');
    this.setState({
      adding: false
    })
  },
  handleClick: function (e) {
    var self = this;
    var $target = $(e.target);
    var newItemAncestorId = $target.data('id');

    this.setState({
      adding: !this.state.adding,
      addingItem: workspaceStore.getByItemId(newItemAncestorId)
    })

    var $modal = $(this.refs.itemAddModal.getDOMNode());
    $modal.modal();
  },
  getChildOptions: function (possibleChild) {
    return possibleChild.map(function (child) {
      return (
        <li role="presentation">
            <a role="menuitem" data-id={child.id} tabindex="-1" href="#" >{child.name}</a>
        </li>
      )
    });
  },
  render: function () {
    var item = this.props.item;
    var possibleChild = workspaceStore.getPossibleChild(item);
    var childOptions = this.getChildOptions(possibleChild);

    return(
    <span className="dropdown">
        <button type="button" className="btn btn-link dropdown-toggle" data-toggle="dropdown">
            <span className="glyphicon glyphicon-plus"></span>&nbsp;Add Child
            <span className="caret"></span>
        </button>
        <ul onClick={this.handleClick} className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
            {childOptions}
        </ul>

        <div className="modal fade" ref="itemAddModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 className="modal-title" id="myModalLabel">
                            Add item: {this.state.addingItem ? this.state.addingItem.name : false}
                        </h4>
                    </div>
                    <div className="modal-body">
                        <WorkspaceAddNewForm
                            addingItem={this.state.addingItem}
                            item={item}
                            handleSubmit={this.handleSubmit}
                        />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </span>
          )
  }
})
module.exports = AddNewWorkspaceItem;
