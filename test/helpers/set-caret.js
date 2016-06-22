export default (elm, position) => {
  const selection = window.getSelection();
  selection.removeAllRanges();
  const range = document.createRange();
  range.setStart(elm, position);
  selection.addRange(range);
};
