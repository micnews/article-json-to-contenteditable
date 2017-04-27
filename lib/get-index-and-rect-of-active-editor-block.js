/* @flow */

export default (container: HTMLElement) => {
  const selection = window.getSelection();
  let node = selection.anchorNode;
  if (!node || !container.contains(node) || container === node) {
    return {
      index: -1,
      boundingClientRect: null,
    };
  }

  while (node.parentNode && node.parentNode !== container) {
    node = node.parentNode;
  }

  return {
    index: [].indexOf.call(container.children, node),
    boundingClientRect: (node.getBoundingClientRect && node.getBoundingClientRect()) || null,
  };
};
