import React from 'react';
import PropTypes from 'prop-types';
import styles from './Kitem.css';

const Kitem = (props) => {
  const mobile = window.screen.width < 800;

  const role = (props.onClick) ? 'button' : '';

  let className = `${styles.kitem} `;

  if (props.color) {
    className += `${styles[props.color]} `;
  }

  if (props.minHeight && !mobile) {
    className += `${styles.minHeight} `;
  }

  if (!mobile && props.onClick) {
    className += `${styles.clickable} `;
  }

  return (
    <div className={className} role={role} onClick={props.onClick}>
      <div className={styles[`${props.color}head`]}>
        <h3>{ props.head }</h3>
      </div>
      <div className={styles.body}>
        <p>{ props.body }</p>
      </div>
    </div>
  );
};

Kitem.propTypes = {
  body: PropTypes.string,
  head: PropTypes.node,
  color: PropTypes.node,
  minHeight: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Kitem;
