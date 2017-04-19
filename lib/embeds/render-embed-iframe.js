/* eslint-disable no-script-url */

import React, { PropTypes } from 'react';

const EmbedIframe = ({ id, url = '', height, type, passRef = () => {} }) => {
  const embedId = id || url.replace(/https:\/\/[^/]*\//, '').replace(/\W+/g, '');
  return (<iframe
    id={`${type}-${embedId}`}
    type={`${type}`}
    frameBorder='0'
    width='100%'
    src='javascript:false'
    height={height}
    ref={passRef}
  />);
};

EmbedIframe.propTypes = {
  url: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  passRef: PropTypes.func,
};

export default EmbedIframe;
