import React from 'react';

const Kitem = (props) => {
  const mobile = window.screen.width < 800;

  const role = (!props.clickable || props.clickable !== 'false') ? 'button' : '';

  let className = 'kitem kitem-clickable ';

  if (props.color) {
    className += `kitem-${props.color} `;
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
