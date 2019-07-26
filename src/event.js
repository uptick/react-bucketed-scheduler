import React from 'react'
import moment from 'moment'
import classNames from 'classnames'
import { DragSource } from 'react-dnd'
import {shallowEqual, shallowEqualExcept, shallowItemsDifferExcept} from 'shallow-utils'

import {
  BeforeZone,
  AfterZone,
  CustomBeforeZone,
  CustomAfterZone,
} from './zones.js'

const source = {
  beginDrag(props, monitor) {
    return {
      ...props,
    }
  },
  endDrag(props, monitor) {
    const item = monitor.getItem()

    const dropResult = monitor.getDropResult()
    if (dropResult === null) {
      return
    }

    props.onDrop(props.eventData, props.rowData, dropResult)
  },
}
function collect(connect, monitor) {
  return {
    connectSource: connect.dragSource(),
    connectPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  }
}

class Event extends React.Component {
  static defaultProps = {
    extraClasses: [],
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (!shallowEqual(this.props.customDropTypes, nextProps.customDropTypes)) {
      // console.log('customDropTypes changed')
      return true
    }
    if (!shallowEqual(this.props.rowData, nextProps.rowData)) {
      // console.log('rowData changed')
      return true
    }

    let checkedProps = [
      'customDropTypes',
      'rowData',
    ]
    if (!shallowEqualExcept(this.props, nextProps, checkedProps)) {
      // console.log('misc props changed', shallowItemsDifferExcept(this.props, nextProps, checkedProps))
      return true
    }

    return false
  }
  handleClick = (event) => {
    if (event) {
      event.preventDefault()
    }
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(this.props.eventData)
    }
  }
  render() {
    // console.log('rendering event')
    let droppable = (typeof this.props.onDrop === 'function')
    let begins = Math.max(this.props.begins, this.props.intervalBegins)
    let ends = Math.min(this.props.ends, this.props.intervalEnds)
    let timeFormat = 'h:mm a'

    let AfterZoneClass = AfterZone
    if (this.props.customDropTypes.length > 0) {
      AfterZoneClass = CustomAfterZone(this.props.customDropTypes)
    }
    let BeforeZoneClass = BeforeZone
    if (this.props.customDropTypes.length > 0) {
      BeforeZoneClass = CustomBeforeZone(this.props.customDropTypes)
    }

    let zoneProps = {}
    zoneProps.rowData = this.props.rowData

    let location
    if (this.props.location) {
      location = (<p className="location">{this.props.location}</p>)
    }

    let event = (
      <div
        className={classNames('rbucks-event', {
          'dragging': this.props.isDragging,
          'disabled': this.props.disabled,
          'clickable': typeof this.props.onClick === 'function',
        }, this.props.extraClasses)}
        onClick={this.handleClick}
      >
        {droppable && !this.props.disabled && !this.props.isDragging && (
          <BeforeZoneClass
            begins={this.props.begins - this.props.dropMargin}
            top={true}
            {...zoneProps}
          />
        )}
        {droppable && !this.props.disabled && !this.props.isDragging && (
          <AfterZoneClass
            ends={this.props.ends + this.props.dropMargin}
            bottom={true}
            {...zoneProps}
          />
        )}
        {this.props.connectPreview(<div className="rbucks-content">
          <p className="rbucks-label">{moment(begins, 'x').format(timeFormat)} - {moment(ends, 'x').format(timeFormat)}</p>
          <p>{this.props.title}</p>
          {location}
        </div>)}
      </div>
    )
    if (droppable && !this.props.disabled) {
      event = this.props.connectSource(event)
    }
    return event
  }
}
const DraggableEvent = DragSource('RBUCKS_EVENT', source, collect)(Event)

export {
  Event,
  DraggableEvent,
}
