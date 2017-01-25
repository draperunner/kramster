import React from 'react';

const Kitem = props =>
  /*
  const mobile = deviceDetector.isMobile();

  const role = (!props.clickable || props.clickable !== 'false')
    ? 'button' : '';

  if (props.color && elem[0].firstChild.className.indexOf(`kitem-${props.color}`) < 0) {
    elem[0].firstChild.className = `${elem[0].firstChild.className} kitem-${props.color}`;
  }

  if (props.minHeight && !mobile
    && elem[0].firstChild.className.indexOf('kitem-min-height') < 0) {
    elem[0].firstChild.className = `${elem[0].firstChild.className} kitem-min-height`;
  }

  if (mobile || (props.clickable && props.clickable === 'false')) {
    const className = elem[0].firstChild.className;
    elem[0].firstChild.className = className.replace('kitem-clickable', '');
  }

  props.$observe('color', () => {
    elem[0].firstChild.className = `${elem[0].firstChild.className} kitem-${props.color}`;
  });

  props.$observe('role', () => {
    role = (props.clickable || props.clickable) ? 'button' : '';
  });
  */

   (
     <div className="kitem kitem-clickable" role={props.role}>
       <div className="head">
         <h3>{ props.head }</h3>
       </div>
       <div className="body">
         <p>{ props.body }</p>
       </div>
     </div>
  );

Kitem.propTypes = {
  role: React.PropTypes.string,
  body: React.PropTypes.string,
  head: React.PropTypes.node,
  // color: React.PropTypes.node,
  // clickable: React.PropTypes.bool,
};

export default Kitem;
