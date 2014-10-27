/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var _ = require('lodash');
var WorkspaceAddNewForm = React.createClass({
  submitChanges: function (e) {
    this.props.handleSubmit(e);
  },
  render: function () {
    var item = this.props.item;
    return (
      <form  role="form" ref="itemEditor">
      <div className="form-group">
      <label for="exampleInputPassword1">Some Item Field</label>
        <input type="text" className="form-control"/>
      </div>
      <div className="checkbox">
      <label><input type="checkbox" /> Check me out</label>
      </div>
      <button type="button"  onClick={this.submitChanges}
      className="btn btn-primary">Save changes</button>
      </form>
    )
  }
})

module.exports = WorkspaceAddNewForm;
