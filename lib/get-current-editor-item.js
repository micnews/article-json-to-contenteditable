export default (container) => {
  const selection = window.getSelection();
  let node = selection.anchorNode;
  if (!node || !container.contains(node)) {
    return null;
  }

  while (node.parentNode && node.parentNode !== container) {
    node = node.parentNode;
  }

  return node.parentNode === container ? node : null;
}
