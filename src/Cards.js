import React, { Component, cloneElement } from 'react'
import ReactDOM from 'react-dom'
import { DIRECTIONS } from './utils'

class SwipeCards extends Component {
  constructor (props) {
    super(props)

    this.state = {
      index: 0,
      alertLeft: false,
      alertRight: false,
      alertTop: false,
      alertBottom: false,
      containerSize: { x: 0, y: 0 }
    };

    this.removeCard = this.removeCard.bind(this)
    this.setSize = this.setSize.bind(this)
    this.renderChildren = this.renderChildren.bind(this);
    this.renderDirections = this.renderDirections.bind(this);
  }

  removeCard (side, cardId) {
    const { children, onEnd } = this.props
    setTimeout(() => this.setState({ [`alert${side}`]: false }), 300)
    
    if (children.length === (this.state.index + 1) && onEnd) onEnd()

    this.setState({
      index: this.state.index + 1,
      [`alert${side}`]: true
    })
  }
  
  componentDidMount () {
    this.setSize()
    window.addEventListener('resize', this.setSize)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.setSize)
  }

  setSize () {
    const container = ReactDOM.findDOMNode(this)
    if (!container) return;

    const containerSize = {
      x: container.offsetWidth,
      y: container.offsetHeight
    }
    this.setState({ containerSize })
  }

  renderChildren() {
    const { props: { children }, state: { containerSize, index}} = this;

    return children.reduce((memo, c, i) => {
      if (index > i) return memo

      const props = {
        key: i,
        containerSize,
        index: children.length - index,
        ...DIRECTIONS.reduce((m, d) => ({ 
          ...m, 
          [`onOutScreen${d}`]: () => this.removeCard(d) 
        }), {}),
        active: index === i
      }
      return [ cloneElement(c, props), ...memo ]
    }, []);
  }

  renderDirections() {
    return DIRECTIONS.map(d =>
      <div 
        key={d} 
        className={`${this.state[`alert${d}`] ? 'alert-visible': ''} alert-${d.toLowerCase()} alert`}>
        {this.props[`alert${d}`]}
      </div>
    );
  }

  render () {
    const { props: { className}, state: { containerSize}} = this;

    return (
      <div className={className}>
        {containerSize.x && containerSize.y && [
          this.renderDirections(),
          <div key="cards" id='cards'> {this.renderChildren()} </div>
        ]}
      </div>
    )
  }
}

export default SwipeCards
