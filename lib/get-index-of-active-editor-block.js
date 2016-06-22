export default (container) => {
  const selection = window.getSelection();
  let node = selection.anchorNode;
  if (!node || !container.contains(node)) {
    return -1;
  }

  while (node.parentNode && node.parentNode !== container) {
    node = node.parentNode;
  }

  return [].indexOf.call(container.children, node);
};
