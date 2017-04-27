import React from 'react';
import styles from './Kitem.css';

const Kitem = (props) => {
  const mobile = window.screen.width < 800;

  const role = (!props.clickable || props.clickable !== 'false') ? 'button' : '';

  let className = `${styles.kitem} ${styles.clickable} `;

  if (props.color) {
    className += `${styles[props.color]} `;
  }

  if (props.minHeight && !mobile) {
    className += 'kitem-min-height ';
  }

  if (mobile || (props.clickable && props.clickable === 'false')) {
    className = className.replace('kitem-clickable', '');
  }

  return (
    <div className={className} role={role} onClick={props.onClick}>
      <div className="head">
        <h3>{ props.head }</h3>
      </div>
      <div className="body">
        <p>{ props.body }</p>
      </div>
    </div>
  );
};

Kitem.propTypes = {
  body: React.PropTypes.string,
  head: React.PropTypes.node,
  color: React.PropTypes.node,
  clickable: React.PropTypes.bool,
  minHeight: React.PropTypes.bool,
  onClick: React.PropTypes.func,
};

export default Kitem;
