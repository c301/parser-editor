/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Draggable = require('react-draggable');
var _ = require('lodash');
var $ = require('jquery');
var workspaceStore = require('../js/workspaceStore');
var WorkspaceItemControls = require('./WorkspaceItemControls');
var WorkspaceItemEditorForm = require('./WorkspaceItemEditorForm');


var WorkspaceItem = React.createClass({
  getInitialState: function () {
    return {
      editing: false,
      dragging: false,
      currentDragItem: null
    }
  },
  handleEditClick: function () {
    this.setState({
      editing: !this.state.editing
    })
  },
  editingFinished: function (e) {
    console.log('editingFinished')
    var self = this;
    var $modal = $(this.refs.itemEditorModal.getDOMNode());
    $modal.modal('hide');
    this.setState({
      editing: false
    })
  },
  showEditorModal: function () {
    var self = this;
    var $modal = $(this.refs.itemEditorModal.getDOMNode());
    $modal.modal('show');
    $modal.on('hidden.bs.modal', function (e) {
      self.setState({
        editing: false
      })
    })
  },
  onDragStart: function (event) {
    event.stopPropagation();
    this.props.dragStart(event, this)
  },
  onDragEnd: function (event) {
    if (event.stopPropagation) {
      event.stopPropagation(); // stops the browser from redirecting.
    }

    if (event.preventDefault) {
      event.preventDefault();
    }
    this.props.dragEnd(event, this)
  },
  onDrop: function (event) {
    if (event.stopPropagation) {
      event.stopPropagation(); // stops the browser from redirecting.
    }

    if (event.preventDefault) {
      event.preventDefault();
    }

    this.props.drop(event, this)
  },
  onDragOver: function (event) {
    if (event.stopPropagation) {
      event.stopPropagation(); // stops the browser from redirecting.
    }

    if (event.preventDefault) {
      event.preventDefault();
    }

    this.props.dragOver(event, this)
  },
  onDragEnter: function (event) {
    event.preventDefault();
  },
  onDragLeave: function (event) {
    event.preventDefault();
  },
  getShortName: function () {
    return this.props.item.name.split('/').pop();
  },
  render: function () {
    var self = this;
    var item = this.props.item
    var children = workspaceStore.getChildrenForItem(item);
    var type = workspaceStore.getTypeForItem(item).split('/').pop();

    var createWorkspaceItem = function (item) {
      return (
        <WorkspaceItem
          showControls={self.props.showControls}
          dragStart={self.props.dragStart}
          dragEnd={self.props.dragEnd}
          dragOver={self.props.dragOver}
          drop={self.props.drop}
          key={item.id}
          item={item}
        />
      )
    }
    var workspaceItems = _.map( children, createWorkspaceItem );

    if( this.state.editing ){
      this.showEditorModal();
    }
    var cx = React.addons.classSet;
    var classes = cx({
      'row': true,
      'workspace-item': true
    });

    var controls = false;

    if(this.props.showControls){
      controls = (
        <WorkspaceItemControls
          item={item}
          handleEditClick={this.handleEditClick}
        />
      );
    }
    return (

        <div
          draggable="true"
          data-id={item.id}
          data-parent={item.parent ? item.parent : 0}
          key={item.id}
          onDragStart={this.onDragStart}
          onDragEnd={this.onDragEnd}
          onDragEnter={this.onDragEnter}
          onDragOver={this.onDragOver}
          onDrop={this.onDrop}
          className={classes}>

          <span className="obj-name obj-manual">{this.getShortName()}</span>
          <span className="obj-type">{type}</span>

          {controls}

          {workspaceItems}

          <div className="modal fade" ref="itemEditorModal" role="dialog" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h4 className="modal-title" id="myModalLabel">
                    Edit item: {item.name}
                  </h4>
                </div>
                <div className="modal-body">
                  <WorkspaceItemEditorForm
                    editing={this.state.editing}
                    item={item}
                    handleSubmit={this.editingFinished}
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
  }
});

module.exports = WorkspaceItem;
