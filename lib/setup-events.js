import parseKeyCode from 'keycode';

const metaKeyAnd = (e, keyname) => {
  const parsedKeyname = parseKeyCode(e.keyCode);
  return e.metaKey && parsedKeyname === keyname;
};

export default function setupEvents (cb) {
  const callback = ({delegateTarget, target}) => cb({delegateTarget, target});
  const callbackNextTick = ({delegateTarget, target}) => process.nextTick(() => cb({delegateTarget, target}));
  const onKeyDown = e => {
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
