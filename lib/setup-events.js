import parseKeyCode from 'keycode';

export default function setupEvents (cb, getCustomKeyDown = () => {}) {
  const callback = ({delegateTarget}) => cb({delegateTarget});
  const callbackNextTick = ({delegateTarget}) => process.nextTick(() => cb({delegateTarget}));

  const onKeyDown = e => {
    const onCustomKeyDown = getCustomKeyDown(e);
    if (onCustomKeyDown) {
      e.preventDefault();
      return process.nextTick(() => onCustomKeyDown());
    }

    // Cut and paste events are handled in onCut and onPaste
    const parsedKeyname = parseKeyCode(e.keyCode);
    if (e.metaKey && (parsedKeyname === 'v' || parsedKeyname === 'x')) {
      return;
    }

    callbackNextTick(e);
  };

  const onCut = callbackNextTick;
  const onPaste = callbackNextTick;
  const onMouseUp = callback;

  return {onKeyDown, onPaste, onCut, onMouseUp};
}
