/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var _ = require('lodash');
var AddNewChildItem = require('./AddNewChildItem');
var DeleteItem = require('./DeleteItem');

var AddRow = React.createClass({
  render: function () {
    return(
           <a href="#" onClick={this.incCounter} className="btn btn-link btn-xs"><span className="glyphicon glyphicon-plus"></span>
           Row : {this.props.numClicks}
           </a>
          )
  }
})


var EditRow = React.createClass({
  render: function () {
    return <a href="#" onClick={this.props.handleClick} className="btn btn-link btn-xs"><span className="glyphicon glyphicon-edit"></span></a>
  }
})

var SortRow = React.createClass({
  render: function () {
    var item = this.props.item;
    var handleClass = "glyphicon glyphicon-move sort";
    return(
        <a href="#" className="btn btn-link btn-xs"><span className={handleClass}></span></a>
          )
  }
})
var WorkspaceItemControls = React.createClass({
  render: function () {
    var item = this.props.item;
    return (
            <span className="obj-controls">
            <EditRow handleClick={this.props.handleEditClick}></EditRow>
            <DeleteItem item={item}></DeleteItem>
            <AddRow ></AddRow>
            <SortRow item={item}></SortRow>
            <AddNewChildItem
            item={item}
            />
            </span>
           )
  }
})
module.exports = WorkspaceItemControls;
