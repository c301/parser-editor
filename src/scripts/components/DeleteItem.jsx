/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var _ = require('lodash');
var workspaceStore = require('../js/workspaceStore');
var workspaceActions = require('../js/workspaceActions');

var DeleteItem = React.createClass({
  handleClick: function () {
    var item = this.props.item;
    workspaceActions.deleteItem(item);
  },
  render: function () {
    return <a href="#" onClick={this.handleClick} className="btn btn-link btn-xs"><span className="glyphicon glyphicon-trash"></span></a>
  }
})

module.exports = DeleteItem;
