import parseKeyCode from 'keycode';

const metaKeyAnd = (e, keyname) => {
  const parsedKeyname = parseKeyCode(e.keyCode);
  return e.metaKey && parsedKeyname === keyname;
};

export default function setupEvents (cb, getCustomKeyDown = () => {}) {
  const callback = ({delegateTarget}) => cb({delegateTarget});
  const callbackNextTick = ({delegateTarget}) => process.nextTick(() => cb({delegateTarget}));

  const onKeyDown = e => {
    const onCustomKeyDown = getCustomKeyDown(e);
    if (onCustomKeyDown) {
      e.preventDefault();
      callback(e);
      return process.nextTick(() => onCustomKeyDown());
    }

    const parsedKeyname = parseKeyCode(e.keyCode);
    if (parsedKeyname === 'enter' || parsedKeyname === 'backspace' ||
      metaKeyAnd(e, 'b') || metaKeyAnd(e, 'i')) {
      callbackNextTick(e);
    }
  };

  const onCut = callbackNextTick;
  const onPaste = callbackNextTick;
  const onBlur = callback;
  const onMouseUp = callback;

  return {onKeyDown, onPaste, onCut, onBlur, onMouseUp};
}
