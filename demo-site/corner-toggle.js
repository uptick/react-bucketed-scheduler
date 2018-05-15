import React from 'react'
import ReactDOM from 'react-dom'

class CornerToggleDemo extends React.Component {
  render() {
    return (<p>Corner toggle demo</p>)
  }
}

const mount = document.querySelectorAll('div.demo-corner-toggle')
ReactDOM.render(
  <CornerToggleDemo />,
  mount[0]
)
