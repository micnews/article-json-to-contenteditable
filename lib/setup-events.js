/* @flow */

import parseKeyCode from 'keycode';

import type { KeydownEventType, GetCustomKeyDownType } from './types';

type CbType = () => void;

export default function setupEvents(cb: CbType, getCustomKeyDown: GetCustomKeyDownType = () => {}) {
  const callback = () => cb();
  const callbackNextTick = () =>
    process.nextTick(() => cb());

  const onKeyDown = (e: KeydownEventType) => {
    const onCustomKeyDown = getCustomKeyDown(e);
    if (onCustomKeyDown) {
      e.preventDefault();
      return process.nextTick(onCustomKeyDown);
    }

    // Cut and paste events are handled in onCut and onPaste
    const parsedKeyname = parseKeyCode(e.keyCode);
    if (e.metaKey && (parsedKeyname === 'v' || parsedKeyname === 'x')) {
      return undefined;
    }

    // dead keys are keys that become something else w a key after
    // example, ´ is a dead key since it + e becomes é
    if (e.key === 'Dead') {
      return undefined;
    }

    return callbackNextTick(e);
  };

  const onCut = callbackNextTick;
  const onPaste = callbackNextTick;

  return { onKeyDown, onPaste, onCut };
}
