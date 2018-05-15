import React from 'react'
import ReactDOM from 'react-dom'

class DragDropDemo extends React.Component {
  render() {
    return (<p>Drag n drop demo</p>)
  }
}

const mount = document.querySelectorAll('div.demo-drag-drop')
ReactDOM.render(
  <DragDropDemo />,
  mount[0]
)
