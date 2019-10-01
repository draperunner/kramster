import React from 'react'
import PropTypes from 'prop-types'
import './Kitem.css'

const Kitem = (props) => {
  const mobile = window.screen.width < 800

  let className = 'kitem '

  if (props.color) {
    className += `${props.color} `
  }

  if (props.minHeight && !mobile) {
    className += 'minHeight '
  }

  if (!mobile && props.onClick) {
    className += 'clickable '
  }

  if (!props.onClick) {
    return (
      <div className={className}>
        <div className={`${props.color}head`}>
          <h3>
            { props.head || '' }
          </h3>
        </div>
        <div className="body">
          <p>
            { props.body }
          </p>
        </div>
      </div>
    )
  }

  return ( // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a
      className={className}
      role="button"
      tabIndex={0}
      focusable
      onKeyDown={(e) => e.which === 13 && props.onClick(e)}
      onClick={props.onClick}
    >
      <div className={`${props.color}head`}>
        <h3>
          { props.head }
        </h3>
      </div>
      <div className="body">
        <p>
          { props.body }
        </p>
      </div>
    </a>
  )
}

Kitem.propTypes = {
  body: PropTypes.string,
  head: PropTypes.node,
  color: PropTypes.node,
  minHeight: PropTypes.bool,
  onClick: PropTypes.func,
}

export default Kitem
