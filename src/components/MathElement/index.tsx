import React, { useEffect, useRef } from 'react'
import renderMathInElement from 'katex/dist/contrib/auto-render'

interface Props {
  children?: React.ReactNode
  dangerouslySetInnerHTML?: {
    __html: string
  }
}

const MathElement: React.FC<Props> = (props) => {
  const mathElementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (mathElementRef.current) {
      renderMathInElement(mathElementRef.current)
    }
  }, [props])

  return <span {...props} ref={mathElementRef} />
}

export default MathElement
