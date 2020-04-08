import React from 'react'
import renderMathInElement from 'katex/dist/contrib/auto-render'

interface Props {
  dangerouslySetInnerHTML?: {
    __html: string
  }
}

class MathElement extends React.Component<Props> {
  mathElement: any

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
        {this.props.children}
      </span>
    )
  }
}

export default MathElement
