import React from 'react'
import moment from 'moment'
import { shallowEqual, shallowEqualExcept, shallowItemsDifferExcept } from 'shallow-utils'

import Corner from './corner.js'
import {
  AfterZone,
  CustomAfterZone,
} from './zones.js'

class Header extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (!shallowEqual(this.props.intervals, nextProps.intervals)) {
      // console.log('intervals changed')
      return true
    }

    let checkedProps = [
      'intervals',
    ]
    if (!shallowEqualExcept(this.props, nextProps, checkedProps)) {
      // console.log('misc props changed', shallowItemsDifferExcept(this.props, nextProps, checkedProps))
      return true
    }

    return false
  }
  render() {
    // console.log('rendering header')
    let droppable = (typeof this.props.onEventDrop === 'function')

    let AfterZoneClass = AfterZone
    if (droppable && this.props.customDropTypes.length > 0) {
      AfterZoneClass = CustomAfterZone(this.props.customDropTypes)
    }

    return (
      <div className="rbucks-row rbucks-header">
        {this.props.showTitle && (
          <div className="rbucks-cell rbucks-title">{this.props.children}</div>
        )}
        {this.props.intervals.map((interval) => {
          let intBegins = +interval.begins
          return (
            <div
              className="rbucks-cell"
              key={`interval-${+interval.begins}`}
            >
              {droppable && (
                <AfterZoneClass
                  ends={intBegins + this.props.beginsOffset}
                  long={true}
                  rowData={this.props.rowData}
                />
              )}
              <h3>{moment(interval.begins, 'x').format(this.props.titleFormat)}</h3>
            </div>
          )
        })}
      </div>
    )
  }
}

class Scheduler extends React.Component {
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
    const corners = []
    const children = []
    React.Children.map(this.props.children, (child) => {
      if (child.type === Corner) {
        corners.push(child)
        return
      }
      children.push(React.cloneElement(child, {
        showTitle: this.props.showTitles,
        intervals: this.props.intervals,
        customDropTypes: this.props.customDropTypes,
        onEventDrop: this.props.onEventDrop,
        onEventClick: this.props.onEventClick,
        showActiveTime: this.props.showActiveTime,
        dropMargin: this.props.dropMargin,
      }))
    })
    return (
      <div className="rbucks-root">
        <Header
          showTitle={this.props.showTitles}
          intervals={this.props.intervals}
          titleFormat={this.props.headerTitleFormat}
          beginsOffset={this.props.headerBeginsOffset}
          customDropTypes={this.props.customDropTypes}
          rowData={this.props.headerRowData}
          onEventDrop={this.props.onEventDrop}
        >
          {corners}
        </Header>
        {children}
      </div>
    )
  }
}
Scheduler.defaultProps = {
  showTitles: true,
  showActiveTime: true,
  headerTitleFormat: 'ddd',
  onEventDrop: function(event, rowData, dropData) {
    console.log('RBuckS: dropped rbucks event', event, 'at', rowData, dropData)
  },
  onEventClick: function(event) {
    console.log('RBuckS: clicked rbucks event', event)
  },
  customDropTypes: [],
  headerRowData: {},
  headerBeginsOffset: 0,
  dropMargin: 0,
}

export default Scheduler
