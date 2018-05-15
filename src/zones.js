import React from 'react'
import classNames from 'classnames'
import { DropTarget } from 'react-dnd'

const beforeSource = {
  drop(props, monitor) {
    if (monitor.didDrop()) {
      return
    }
    return {
      before: props.begins,
      rowData: props.rowData,
    }
  },
}
const afterSource = {
  drop(props, monitor) {
    if (monitor.didDrop()) {
      return
    }
    return {
      after: props.ends,
      rowData: props.rowData,
    }
  },
}
function adjacentCollector(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    dropItem: monitor.getItem(),
    dropItemType: monitor.getItemType(),
  }
}
class BeforeZone extends React.Component {
  render() {
    const isActive = (this.props.isOver && this.props.canDrop)
    if (!this.props.dropItem) {
      return null
    }
    return this.props.connectDropTarget(<div className={classNames('before', {
      'active': isActive,
      'long': this.props.long,
      'top': this.props.top,
      'bottom': this.props.bottom,
    })}></div>)
  }
}
const StandardBeforeZone = DropTarget([
  // todo: add external types
  'RBUCKS_EVENT',
], beforeSource, adjacentCollector)(BeforeZone)
class AfterZone extends React.Component {
  render() {
    const isActive = (this.props.isOver && this.props.canDrop)
    if (!this.props.dropItem) {
      return null
    }
    return this.props.connectDropTarget(<div className={classNames('after', {
      'active': isActive,
      'long': this.props.long,
      'top': this.props.top,
      'bottom': this.props.bottom,
      'ender': this.props.ender,
    })}></div>)
  }
}
const StandardAfterZone = DropTarget([
  // todo: add external types
  'RBUCKS_EVENT',
], afterSource, adjacentCollector)(AfterZone)

function CustomBeforeZone(types) {
  return DropTarget([
    'RBUCKS_EVENT',
  ].concat(types), beforeSource, adjacentCollector)(BeforeZone)
}
function CustomAfterZone(types) {
  return DropTarget([
    'RBUCKS_EVENT',
  ].concat(types), afterSource, adjacentCollector)(AfterZone)
}

export {
  StandardBeforeZone as BeforeZone,
  StandardAfterZone as AfterZone,
  CustomBeforeZone,
  CustomAfterZone
}
