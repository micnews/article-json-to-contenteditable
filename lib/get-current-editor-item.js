export default (container) => {
  const selection = window.getSelection();
  let node = selection.anchorNode;
  while (node && node.parentNode && node.parentNode !== container) {
    node = node.parentNode;
  }

  return node && node.parentNode === container ? node : null;
}
