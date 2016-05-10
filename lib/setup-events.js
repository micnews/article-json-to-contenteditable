function metaKeyAnd (e, keyCode) {
  return e.metaKey && e.keyCode === keyCode;
}

export default function setupEvents (cb) {
  const callback = ({delegateTarget}) => process.nextTick(() => cb({ delegateTarget }));
  function onKeyDown (e) {
    if (e.keyCode === 13 || e.keyCode === 8 || metaKeyAnd(e, 66) || metaKeyAnd(e, 73)) {
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
