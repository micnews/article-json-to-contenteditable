export default (startElm, startPos, endElm, endPos) => {
  const selection = window.getSelection();
  selection.removeAllRanges();
  const range = document.createRange();
  range.setStart(startElm, startPos);
  range.setEnd(endElm, endPos);
  selection.addRange(range);
};
