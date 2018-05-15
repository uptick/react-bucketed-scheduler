import React from 'react'
import { activeTime, eventsInRange, chronoEventsComparer } from 'event-time-utils'
import { shallowEqual, shallowEqualExcept, shallowItemsDifferExcept } from 'shallow-utils'

import {
  AfterZone,
  CustomAfterZone,
} from './zones.js'
import Cell from './cell.js'

class Row extends React.Component {
  onEventClick = (event) => {
    this.props.onEventClick(event)
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (!shallowEqual(this.props.events, nextProps.events)) {
      // console.log('events changed')
      return true
    }
    if (!shallowEqual(this.props.intervals, nextProps.intervals)) {
      // console.log('intervals changed')
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
      'events',
      'intervals',
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
    // console.log('rendering row')
    let rangeStart = 0
    let rangeEnd = 0
    if (this.props.intervals.length > 0) {
      rangeStart = +this.props.intervals.begins
      rangeEnd = +this.props.intervals[this.props.intervals.length - 1].ends
    }

    let AfterZoneClass = AfterZone
    if (this.props.customDropTypes.length > 0) {
      AfterZoneClass = CustomAfterZone(this.props.customDropTypes)
    }

    return (
      <div className="rbucks-row">
        {this.props.showTitle && (
          <div className="rbucks-cell rbucks-title">
            {'title' in this.props && (
              <h2>{this.props.title}</h2>
            )}
            <span className="rbucks-label">{activeTime(this.props.events, rangeStart, rangeEnd)}h</span>
          </div>
        )}
        {this.props.intervals.map((interval) => {
          let intBegins = +interval.begins
          let intEnds = +interval.ends
          let events = eventsInRange(this.props.events, intBegins, intEnds)
          events.sort(chronoEventsComparer)
          return (
            <Cell
              key={`cell-${intBegins}`}
              interval={interval}
              rowData={this.props.rowData}
              events={events}
              beginsOffset={this.props.beginsOffset}
              customDropTypes={this.props.customDropTypes}
              onEventClick={this.onEventClick}
              onEventDrop={this.props.onEventDrop}
            />
          )
        })}
      </div>
    )
  }
}
Row.defaultProps = {
  beginsOffset: 0,
  endsOffset: 0,
  rowData: {},
}

export default Row
