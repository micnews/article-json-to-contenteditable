import parseKeyCode from 'keycode';

const metaKeyAnd = (e, keyname) => {
  const parsedKeyname = parseKeyCode(e.keyCode);
  return e.metaKey && parsedKeyname === keyname;
};

const isUndo = (e) => {
  return metaKeyAnd(e, 'z') && !e.shiftKey;
};

const isRedo = (e) => {
  return metaKeyAnd(e, 'z') && e.shiftKey;
};

export default function setupEvents (cb, onUndo, onRedo) {
  const callback = ({delegateTarget}) => cb({delegateTarget});
  const callbackNextTick = ({delegateTarget}) => process.nextTick(() => cb({delegateTarget}));

  const onKeyDown = e => {
    if (onUndo && isUndo(e)) {
      e.preventDefault();
      callback(e);
      return process.nextTick(() => onUndo());
    }

    if (onRedo && isRedo(e)) {
      e.preventDefault();
      callback(e);
      return process.nextTick(() => onRedo());
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
