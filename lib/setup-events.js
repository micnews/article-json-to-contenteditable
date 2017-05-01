import parseKeyCode from 'keycode';

const metaKeysMap = {
  'left command': true,
  'right command': true,
  alt: true,
  ctrl: true,
  shift: true,
  'caps lock': true
};

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

    // Return if the only key pressed is a meta key (needs another key also pressed to do anything)
    if (metaKeysMap[parsedKeyname]) {
      return;
    }

    // dead keys are keys that become something else w a key after
    // example, ´ is a dead key since it + e becomes é
    if (e.key === 'Dead' || e.key === 'Meta') {
      return;
    }

    callbackNextTick(e);
  };

  const onCut = callbackNextTick;
  const onPaste = callbackNextTick;
  const onMouseUp = callback;

  return {onKeyDown, onPaste, onCut, onMouseUp};
}
