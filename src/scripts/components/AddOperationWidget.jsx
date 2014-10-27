/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var _ = require('lodash');
var $ = require('jquery');
var workspaceStore = require('../js/workspaceStore');
var workspaceActions = require('../js/workspaceActions');

var AddOperationWidget = React.createClass({
  openModal: function () {
    var self = this;
    var $modal = $(this.refs.addOperationModal.getDOMNode());
    $modal.modal('show');
  },
  addOperation: function () {
    var self = this;

    var jsonText = this.refs.operationJson.getDOMNode().value;
    try{
      var operation = JSON.parse(jsonText);

      console.log('Creating operation..', operation);

      if(operation.type){
        workspaceActions.addOperation(operation);
      }
      var $modal = $(this.refs.addOperationModal.getDOMNode());
      $modal.modal('hide');
    }catch(e){
      console.log('Bad JSON');
    }
  },
  render: function () {
    return  (
      <div className="container">
        <button
        onClick={this.openModal}
        className="btn btn-success" type="button">Add Operation</button>

        <div className="modal fade" ref="addOperationModal" role="dialog" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 className="modal-title" id="myModalLabel">
                Put json for new operation
                </h4>
              </div>
              <div className="modal-body">
                <textarea
                  defaultValue={'{\n\t"type": ""\n}'}
                  ref="operationJson"
                  id="operation-json"
                  name="operation-json"
                  rows="10"
                >
                </textarea>
              </div>
              <div className="modal-footer">
                <button
                onClick={this.addOperation}
                type="button" className="btn btn-success">Save</button>
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
})

module.exports = AddOperationWidget;

