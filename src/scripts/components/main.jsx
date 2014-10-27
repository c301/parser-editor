/** @jsx React.DOM */

var React = require('react/addons');
var {DefaultRoute, Route, Routes} = require('react-router');
var Workspace = require('./Workspace');
var AddOperationWidget = require('./AddOperationWidget');
var workspaceStore = require('../js/workspaceStore');
var $ = jQuery = require("jquery");

// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

// CSS
require('../../../bower_components/bootstrap/dist/css/bootstrap.css');
require('../../../bower_components/bootstrap/dist/js/bootstrap.js');

var rootItem = workspaceStore.getRootItems()[0];

React.renderComponent(
  <Workspace
    showControls={true}
    item={rootItem}
  />, $('#workspace-root')[0]
);

React.renderComponent(
  <AddOperationWidget
  />, $('#add-operation')[0]
);
