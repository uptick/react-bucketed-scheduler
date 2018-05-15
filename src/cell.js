import React from 'react'
import { activeTime } from 'event-time-utils'
import {shallowEqual, shallowEqualExcept, shallowItemsDifferExcept} from 'shallow-utils'

import Event from './event.js'
import {
  AfterZone,
  CustomAfterZone,
} from './zones.js'

class Cell extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (!shallowEqual(this.props.interval, nextProps.interval)) {
      // console.log('interval changed')
      return true
    }
    if (!shallowEqual(this.props.events, nextProps.events)) {
      // console.log('events changed')
      return true
    }
    if (!shallowEqual(this.props.customDropTypes, nextProps.customDropTypes)) {
      // console.log('customDropTypes changed')
      return true
    }
    if (!shallowEqual(this.props.rowData, nextProps.rowData)) {
      // console.log('rowData changed')
      return true
    }

    let checkedProps = [
      'interval',
      'events',
      'customDropTypes',
      'rowData',
    ]
    if (!shallowEqualExcept(this.props, nextProps, checkedProps)) {
      // console.log('misc props changed', shallowItemsDifferExcept(this.props, nextProps, checkedProps))
      return true
    }

    return false
  }
  render() {
    // console.log('rendering cell')
    let AfterZoneClass = AfterZone
    if (this.props.customDropTypes.length > 0) {
      AfterZoneClass = CustomAfterZone(this.props.customDropTypes)
    }

    let intBegins = +this.props.interval.begins
    let intEnds = +this.props.interval.ends

    return (
      <div
        className="rbucks-cell"
      >
        <AfterZoneClass
          ends={intBegins + this.props.beginsOffset}
          long={true}
          rowData={this.props.rowData}
        />
        {this.props.events.map((event) => {
          return (
            <Event
              key={`event-${event.id}`}
              intervalBegins={intBegins}
              intervalEnds={intEnds}
              rowData={this.props.rowData}
              customDropTypes={this.props.customDropTypes}
              onClick={this.props.onEventClick}
              onDrop={this.props.onEventDrop}
              {...event}
            />
          )
        })}
        <span className="rbucks-label">{activeTime(this.props.events, intBegins, intEnds)}h</span>
      </div>
    )
  }
}

export default Cell
