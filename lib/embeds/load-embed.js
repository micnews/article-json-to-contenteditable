/* @flow */
/* eslint-disable no-param-reassign, no-console */

import type { IFrameWithPropsType } from '../types';

type PropsType = {
  iframe: IFrameWithPropsType,
  content: any,
  onLoaded?: Function,
  onResize?: Function,
};

const noop = () => {};

export default ({ iframe, content, onLoaded = noop, onResize = noop }: PropsType) => {
  const onloaded = () => {
    const doc = iframe.contentWindow.document;
    iframe.contentWindow.resize = () => {
      let height;
      // Don't crash if for some reason we don't have access to the iframe document.
      try {
        height = iframe.contentWindow && iframe.contentWindow.document.body.scrollHeight;
      } catch (e) {
        console.error(e);
        height = 150;
      }
      iframe.height = String(height);
      onResize({ height });
    };
    doc.open().write(content);
    doc.close();
    onLoaded();
  };

  if (iframe.contentWindow && iframe.contentWindow.document) {
    onloaded();
  } else {
    iframe.onload = onloaded;
  }
};
