/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var workspaceStore = require('../js/workspaceStore');
var WorkspaceItem = require('./WorkspaceItem');
var WorkspaceControl = require('./WorkspaceControl');

var placeholder = document.createElement("div");
placeholder.className = "placeholder";

function getOffset(elem) {
    if (elem.getBoundingClientRect) {
        // "правильный" вариант
        return getOffsetRect(elem)
    } else {
        // пусть работает хоть как-то
        return getOffsetSum(elem)
    }
}

function getOffsetSum(elem) {
    var top=0, left=0
    while(elem) {
        top = top + parseInt(elem.offsetTop)
        left = left + parseInt(elem.offsetLeft)
        elem = elem.offsetParent
    }

    return {top: top, left: left}
}

function getOffsetRect(elem) {
    // (1)
    var box = elem.getBoundingClientRect()

    // (2)
    var body = document.body
    var docElem = document.documentElement

    // (3)
    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft

    // (4)
    var clientTop = docElem.clientTop || body.clientTop || 0
    var clientLeft = docElem.clientLeft || body.clientLeft || 0

    // (5)
    var top  = box.top +  scrollTop - clientTop
    var left = box.left + scrollLeft - clientLeft

    return { top: Math.round(top), left: Math.round(left) }
}

var Workspace = React.createClass({
    getInitialState: function () {
        var item = this.props.item;
        return {
            item: item
        }
    },
    /**
     * Start drag'n'drop functionality
     */
    dragStart: function (e, component) {
      this.dragged = component.getDOMNode();
      this.setState({
        draggingItem: component.props.item
      })
    },
    dragOver: function (e, component) {
      if(!this.state.draggingItem) return;

      if(e.target.className == "placeholder") return;

      var sameParent = component.props.item.parent === this.state.draggingItem.parent;
      var isItMe = component.props.item.id === this.state.draggingItem.id;
      if( isItMe || !sameParent ){
        return;
      }else{
        // console.log(component.props.item, this.state.draggingItem);
      }

      this.dragged.style.display = "none";

      this.setState({
        overItem: component.props.item
      })
      this.over = component.getDOMNode();

      // Inside the dragOver method
      var relY = e.clientY - getOffset(this.over).top;
      var height = this.over.offsetHeight / 2;
      var parent = this.over.parentNode;

      if(relY > height) {
        this.nodePlacement = "after";
        parent.insertBefore(placeholder, component.getDOMNode().nextElementSibling);
      }
      else if(relY < height) {
        this.nodePlacement = "before"
        parent.insertBefore(placeholder, component.getDOMNode());
      }
    },
    dragEnd: function (e, component) {
        this.dragged.style.display = "block";
        if( !this.state.draggingItem || !this.state.overItem ){
          this.setState({
            draggingItem: null,
            overItem: null
          });
          return;
        }
        this.dragged.parentNode.removeChild(placeholder);

        workspaceStore.sortItem(this.state.draggingItem, this.state.overItem, this.nodePlacement);
        this.setState({
          draggingItem: null,
          overItem: null
        });
    },
    drop: function (e, component) {
      //
    },
    /**
     * End drag'n'drop functionality
     */

    updateRootItems: function () {
        var rootItems = workspaceStore.getRootItems();
        if(rootItems){
            this.setState({
                item: rootItems[0]
            });
        }
    },
    componentDidMount: function () {
        this.listener = workspaceStore.addChangeListener(this.updateRootItems);
    },
    componentWillUnmount: function () {
        //remove listeners here
        workspaceStore.removeChangeListener(this.listener);
    },

    onInstanseSelected: function (newRootId) {
        var newRoot = workspaceStore.getByItemId(newRootId);
        this.setState({
            item: newRoot
        });
    },
    render: function () {
        var item = this.state.item;
        var wItem = false;
        var rootTypes = workspaceStore.getRootArrays();
        var rootInstanses = workspaceStore.getInstanses(rootTypes);
        var controls = false;
        if(this.props.showControls){
          controls = (
            <WorkspaceControl
              onInstanseSelected={this.onInstanseSelected}
              rootTypes={rootTypes}
              rootInstanses={rootInstanses}
            />
          );
        }
        if(item){
            wItem = (
              <WorkspaceItem
                showControls={this.props.showControls}
                dragStart={this.dragStart}
                dragOver={this.dragOver}
                dragEnd={this.dragEnd}
                drop={this.drop}
                key={item.id}
                item={item}
              />
            )
        }
        return (
          <div>
            {controls}
            {wItem}
            <div className="row workspace-row">
            </div>
          </div>
        )
    }
})

module.exports = Workspace;


