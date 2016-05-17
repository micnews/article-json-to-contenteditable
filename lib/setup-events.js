import parseKeyCode from 'keycode';

function metaKeyAnd (e, keyname) {
  const parsedKeyname = parseKeyCode(e.keyCode);
  return e.metaKey && parsedKeyname === keyname;
}

export default function setupEvents (cb) {
  const callback = ({delegateTarget}) => process.nextTick(() => cb({ delegateTarget }));
  function onKeyDown (e) {
    const parsedKeyname = parseKeyCode(e.keyCode);
    if (parsedKeyname === 'enter' || parsedKeyname === 'backspace' ||
      metaKeyAnd(e, 'b') || metaKeyAnd(e, 'i')) {
      callback(e);
    }
  }

  function onPaste (e) {
    callback(e);
  }

  function onCut (e) {
    callback(e);
  }

  return { onKeyDown, onPaste, onCut };
}
