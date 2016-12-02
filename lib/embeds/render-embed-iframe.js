import element from 'magic-virtual-element';

export default ({id, url = '', type}) => {
  const embedId = id || url.replace(/https:\/\/[^\/]*\//, '');
  return (<iframe id={`${type}-${embedId}`} type={`${type}`} frameBorder='0' width='100%' src='javascript:false'></iframe>);
};
