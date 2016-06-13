import element from 'magic-virtual-element';

export default ({id, type}) => {
  return (<iframe id={`${type}-${id}`} type={`${type}`} frameBorder='0' width='100%' src='javascript:false'></iframe>);
};
