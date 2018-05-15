import React from 'react'
import ReactDOM from 'react-dom'

class DisplayEventsDemo extends React.Component {
  render() {
    return (<p>Display events demo</p>)
  }
}

const mount = document.querySelectorAll('div.demo-display-events')
ReactDOM.render(
  <DisplayEventsDemo />,
  mount[0]
)
