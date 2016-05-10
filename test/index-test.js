/* eslint-disable deku/no-unknown-property */

import test from 'tape-catch';
import element from 'magic-virtual-element';
import { renderString, render, tree } from 'deku';
import createEvent from 'create-event';
import ArticleJsonToContenteditable from '../lib/index';

test('<ArticleJsonToContenteditable />', t => {
  const expected = renderString(tree(<div contenteditable='true'><article></article></div>));
  const actual = renderString(tree(<ArticleJsonToContenteditable items={[]} />));

  t.equal(actual, expected);
  t.end();
});

function keydown (opts) {
  return createEvent('keydown', opts);
}

if (process.browser) {
  test('<ArticleJsonToContenteditable onInput', t => {
    const container = document.createElement('div');
    let onUpdateCalled = false;

    function onInput ({articleJson}) {
      onUpdateCalled = true;
    }

    const app = tree(<ArticleJsonToContenteditable items={[]} onInput={onInput}/>);
    render(app, container);
    container.querySelector('article').dispatchEvent(keydown({ key: 'a' }));
    process.nextTick(() => {
      t.notOk(onUpdateCalled, 'onUpdate was not called');

      container.querySelector('article').dispatchEvent(keydown({ key: 'enter' }));
      process.nextTick(() => {
        t.ok(onUpdateCalled, 'onUpdate was called');
        t.end();
      });
    });
  });
}
