import React from 'react';

const EmbedIframe = ({ id, url = '', height, type, passRef = () => {} }) => {
  const embedId = id || url.replace(/https:\/\/[^\/]*\//, '').replace(/\W+/g, '');
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

export default EmbedIframe;
