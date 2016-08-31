export default function setupEvents (cb, getCustomKeyDown = () => {}) {
  const callback = ({delegateTarget}) => cb({delegateTarget});
  const callbackNextTick = ({delegateTarget}) => process.nextTick(() => cb({delegateTarget}));

  const onKeyDown = e => {
    const onCustomKeyDown = getCustomKeyDown(e);
    if (onCustomKeyDown) {
      e.preventDefault();
      return process.nextTick(() => onCustomKeyDown());
    }

    callbackNextTick(e);
  };

  const onCut = callbackNextTick;
  const onPaste = callbackNextTick;
  const onBlur = callback;
  const onMouseUp = callback;

  return {onKeyDown, onPaste, onCut, onBlur, onMouseUp};
}
