/* eslint-disable deku/no-unknown-property */

import element from 'magic-virtual-element';
import setupArticle from 'article-json-html-render';
import embeds from './embeds';

const Article = setupArticle({
  embeds: embeds,
  renderEmptyTextNodes: true
});

export default {
  name: 'Component',
  render: ({props: {items, onInput}}) => {
    const events = setupEvents(onInput);
    return (<div contenteditable='true' {...events}>
      <Article items={items || []} />
    </div>);
  }
};

function metaKeyAnd (e, keyCode) {
  return e.metaKey && e.keyCode === keyCode;
}

function setupEvents (cb) {
  const callback = () => process.nextTick(cb);
  function onKeyDown (e) {
    if (e.keyCode === 13 || e.keyCode === 8 || metaKeyAnd(e, 66) || metaKeyAnd(e, 73)) {
      callback();
    }
  }

  function onPaste () {
    callback();
  }

  function onCut () {
    callback();
  }

  return { onKeyDown, onPaste, onCut };
}
