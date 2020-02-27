import React from 'react'
import styles from './Kitem.css'

interface Props {
  body: string
  head: number | string
  color: string
  minHeight?: boolean
  onClick?: (
    event:
      | React.MouseEvent<HTMLAnchorElement>
      | React.KeyboardEvent<HTMLAnchorElement>,
  ) => void
}

const Kitem = (props: Props): JSX.Element => {
  const mobile = window.screen.width < 800

  let className = `${styles.kitem} `

  if (props.color) {
    className += `${styles[props.color]} `
  }

  if (props.minHeight && !mobile) {
    className += `${styles.minHeight} `
  }

  if (!mobile && props.onClick) {
    className += `${styles.clickable} `
  }

  if (!props.onClick) {
    return (
      <div className={className}>
        <div className={styles[`${props.color}head`]}>
          <h3>{props.head || ''}</h3>
        </div>
        <div className={styles.body}>
          <p>{props.body}</p>
        </div>
      </div>
    )
  }

  return (
    <a
      className={className}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.which === 13 && props.onClick && props.onClick(e)}
      onClick={props.onClick}
    >
      <div className={styles[`${props.color}head`]}>
        <h3>{props.head}</h3>
      </div>
      <div className={styles.body}>
        <p>{props.body}</p>
      </div>
    </a>
  )
}

export default Kitem
