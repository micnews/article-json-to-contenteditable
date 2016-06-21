import getSelectionRangeFromElm from 'get-selection-range-from-elm';

export default elm => {
  const range = getSelectionRangeFromElm(elm);

  return range && range.getBoundingClientRect() || null;
};
