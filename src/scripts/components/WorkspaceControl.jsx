/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var _ = require('lodash');
var $ = jQuery = require("jquery");
var workspaceStore = require('../js/workspaceStore');
var workspaceActions = require('../js/workspaceActions');

var WorkspaceControl = React.createClass({
  getInitialState: function () {
    // this.instanses = workspaceStore.getInstanses(this.props.rootTypes[0]);
    return {
      rootType: this.props.rootTypes[0],
      // rootInstanse: instanses[0]
    }
  },
  typeSelected: function (e) {
    var newType = _.find( this.props.rootTypes, function (el) {
      return e.target.value == el.id;
    } );

    this.setState({
      rootType: newType
    })

  },
  instanseSelected: function (e) {
    this.props.onInstanseSelected(e.target.value);
  },
  createNewInstanse: function () {
    var name = this.refs.newItemName.getDOMNode().value;
    console.log('createNewInstanse', this.refs.newItemName, name);
    if(name){
      var newItem = {
        name: name,
        ancestor: this.state.rootType.id
      }
      workspaceActions.createItem(newItem);
      this.refs.newItemName.getDOMNode().value = '';
    }else{
      //place notification here
      console.log('Empty name. Please pick up the name first');
    }
  },
  render: function () {
    var typeSelectBoxOptions = [];
    var instansesSelectBoxOptions = [];
    var instanses = this.props.rootInstanses[this.state.rootType.id]
    var instansesSelect;

    this.props.rootTypes.forEach(function ( item ) {
      typeSelectBoxOptions.push( <option value={item.id}>{item.name}</option> );
    });


    if(instanses.length){
      instanses.forEach(function ( item ) {
        instansesSelectBoxOptions.push( <option value={item.id}>{item.name}</option> );
      });
      instansesSelect = (
                            <div className="form-group">
                              <select className="form-control"
                                onChange={this.instanseSelected}
                                >
                                  {instansesSelectBoxOptions}
                                </select>
                            </div>
      )
    }
    return (
            <nav className="navbar navbar-default" role="navigation">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="#">Workspace</a>
                    </div>
                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <form className="navbar-form navbar-left" role="search">

                            <div className="form-group">
                              <select className="form-control"
                                onChange={this.typeSelected}>
                                  {typeSelectBoxOptions}
                                </select>
                            </div>

                            {instansesSelect}

                            <div className="input-group">
                                <input ref="newItemName" type="text" className="form-control" placeholder="New name"/>
                                <div className="input-group-btn">
                                  <button
                                    onClick={this.createNewInstanse}
                                    type="button" className="btn btn-info">
                                    <span className="glyphicon glyphicon-plus"></span>
                                  </button>
                                </div>
                            </div>
                            <a className="btn btn-success" href="">Undo</a>
                            <a className="btn btn-success" href="">Redo</a>
                        </form>
                    </div>
                </div>
            </nav>
          )
  }
})
module.exports = WorkspaceControl;

