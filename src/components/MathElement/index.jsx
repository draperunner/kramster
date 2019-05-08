import React from 'react'
import renderMathInElement from 'katex/dist/contrib/auto-render'

class MathElement extends React.Component {
  componentDidMount() {
    renderMathInElement(this.mathElement)
  }

  componentDidUpdate() {
    renderMathInElement(this.mathElement)
  }

  render() {
    return (
      <span
        {...this.props}
        ref={(input) => {
          this.mathElement = input
        }}
      >
        { this.props.children }
      </span>
    )
  }
}

export default MathElement
