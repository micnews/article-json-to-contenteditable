/* eslint-disable deku/no-unknown-property */

import test from 'tape-catch';
import element from 'magic-virtual-element';
import { renderString, render, tree } from 'deku';
import createEvent from 'create-event';
import setupArticleJsonToContenteditable from '../lib/index';
import setCaret from './helpers/set-caret';
import setSelection from './helpers/set-selection';
import parseKeyCode from 'keycode';

const ArticleJsonToContenteditable = setupArticleJsonToContenteditable();

test('<ArticleJsonToContenteditable />', t => {
  const expected = renderString(tree(<article contenteditable='true'></article>));
  const actual = renderString(tree(<ArticleJsonToContenteditable items={[]} />));

  t.equal(actual, expected);
  t.end();
});

function keydown (opts) {
  return createEvent('keydown', opts);
}

function mouseup () {
  return new window.MouseEvent('mouseup');
}

let previousApp;
function renderAppInContainer (app) {
  if (previousApp) {
    previousApp.unmount();
  }

  const container = document.body.appendChild(document.createElement('div'));
  render(app, container);
  previousApp = app;
  return container;
}

if (process.browser) {
  test('<ArticleJsonToContenteditable /> items', t => {
    const items = [
      {
        'type': 'paragraph',
        'children': [{
          'type': 'text',
          'content': 'Text text text',
          'href': null,
          'italic': false,
          'bold': false,
          'mark': false,
          'markClass': null
        }]
      },
      {
        'type': 'embed',
        'embedType': 'instagram',
        'caption': [],
        'date': {},
        'user': {},
        'id': 'tsxp1hhQTG',
        'text': '',
        'url': 'https://instagram.com/p/tsxp1hhQTG'
      }
    ];

    const expected = renderString(tree(
      <article contenteditable='true'>
        <p>Text text text</p>
        <figure contenteditable='false'>
          <iframe id='instagram-tsxp1hhQTG' type='instagram' frameborder='0' width='100%' src='javascript:false'></iframe>
        </figure>
      </article>));
    const app = tree(<ArticleJsonToContenteditable items={items} />);
    const container = renderAppInContainer(app);
    const actual = container.innerHTML;

    t.equal(actual, expected);
    t.end();
  });

  test('<ArticleJsonToContenteditable onUpdate keydown', t => {
    let onUpdateCalled = false;

    function onUpdate ({items, selectionBoundingClientRect}) {
      onUpdateCalled = true;
      t.ok(Array.isArray(items), 'items is an Array');
      t.equal(selectionBoundingClientRect, null, 'selectionBoundingClientRect is null');
    }

    const app = tree(<ArticleJsonToContenteditable items={[]} onUpdate={onUpdate}/>);
    const container = renderAppInContainer(app);
    container.querySelector('article').dispatchEvent(keydown({ key: 'a' }));
    t.notOk(onUpdateCalled, 'onUpdate was not called');
    process.nextTick(() => {
      t.ok(onUpdateCalled, 'onUpdate was called');
      t.end();
    });
  });

  test('<ArticleJsonToContenteditable onUpdate mouseup command', t => {
    let onUpdateCalled = false;

    function onUpdate ({items, selectionBoundingClientRect}) {
      onUpdateCalled = true;
      t.ok(Array.isArray(items), 'items is an Array');
      t.equal(selectionBoundingClientRect, null, 'selectionBoundingClientRect is null');
    }

    const app = tree(<ArticleJsonToContenteditable items={[]} onUpdate={onUpdate}/>);
    const container = renderAppInContainer(app);
    container.querySelector('article').dispatchEvent(mouseup());
    process.nextTick(() => {
      t.ok(onUpdateCalled, 'onUpdate was called');
      t.end();
    });
  });

  test('<ArticleJsonToContenteditable onUpdate on blur', t => {
    const expected = [
      {
        type: 'paragraph',
        children: [
          {
            type: 'linebreak'
          }
        ]
      }
    ];
    let onUpdateCalled = false;
    let actual;

    function onUpdate ({items, selectionBoundingClientRect}) {
      onUpdateCalled = true;
      actual = items;
      t.ok(Array.isArray(items), 'items is an Array');
      t.equal(selectionBoundingClientRect, null, 'selectionBoundingClientRect is null');
    }

    const app = tree(<ArticleJsonToContenteditable items={[]} onUpdate={onUpdate}/>);
    const container = renderAppInContainer(app);
    container.querySelector('article').dispatchEvent(new window.Event('blur'));
    t.ok(onUpdateCalled, 'onUpdate was called');
    t.deepEqual(actual, expected);
    t.end();
  });

  // Dispatching events does not cause any sideeffects like setting the caret/selection.
  // So here is a separate test for `activeItemIndex` property returned by onUpdate
  // where the caret position is set explicitly.
  test('<ArticleJsonToContenteditable onUpdate returns activeItem', t => {
    const items = [{
      'type': 'paragraph',
      'children': [{
        'type': 'text',
        'content': 'Text text text',
        'href': null,
        'italic': false,
        'bold': false,
        'mark': false,
        'markClass': null
      }]
    }];
    const app = tree(<ArticleJsonToContenteditable items={items} onUpdate={onUpdate}/>);
    const container = renderAppInContainer(app);
    const firstParagraph = container.querySelector('article p');

    const expected = {
      index: 0,
      boundingClientRect: firstParagraph.getBoundingClientRect()
    };
    let onUpdateCalled = false;

    function onUpdate ({activeItem}) {
      onUpdateCalled = true;
      t.deepEqual(activeItem, expected);
    }

    setCaret(firstParagraph, 0);
    container.querySelector('article').dispatchEvent(mouseup());
    t.ok(onUpdateCalled, 'onUpdate was called');
    t.end();
  });

  test('<ArticleJsonToContenteditable customKeyDown', t => {
    let customKeyDownCalled = false;
    let updateCalled = false;

    function getCustomKeyDown (e) {
      if (e.metaKey && parseKeyCode(e.keyCode) === 's') {
        return () => {
          customKeyDownCalled = true;
        };
      }
    }

    function onUpdate () {
      updateCalled = true;
    }

    const app = tree(<ArticleJsonToContenteditable
      items={[]}
      onUpdate={onUpdate}
      getCustomKeyDown={getCustomKeyDown}
    />);
    const container = renderAppInContainer(app);
    const customKeyDownCancelled = !container.querySelector('article').dispatchEvent(keydown({meta: true, key: 's'}));
    t.ok(updateCalled, 'onUpdate was called');
    t.ok(customKeyDownCancelled, 'customKeyDown event should be cancelled');

    process.nextTick(() => {
      t.ok(customKeyDownCalled, 'customKeyDown was called');

      t.end();
    });
  });

  test('<ArticleJsonToContenteditable> selections default behaviour', t => {
    const initialItems = [{
      type: 'paragraph',
      children: [{
        type: 'text',
        content: null,
        href: null,
        italic: false,
        bold: false,
        mark: true,
        markClass: 'selection-start'
      }, {
        type: 'text',
        content: 'text-1',
        href: null,
        italic: false,
        bold: false,
        mark: false,
        markClass: null
      }, {
        type: 'text',
        content: null,
        href: null,
        italic: false,
        bold: false,
        mark: true,
        markClass: 'selection-end'
      }]
    }, {
      type: 'paragraph',
      children: [{
        type: 'text',
        content: 'text-2',
        href: null,
        italic: false,
        bold: false,
        mark: false,
        markClass: null
      }]
    }];
    const expected = [{
      type: 'paragraph',
      children: [{
        type: 'text',
        content: 'text-1',
        href: null,
        italic: false,
        bold: false,
        strikethrough: false,
        mark: false,
        markClass: null
      }]
    }, {
      type: 'paragraph',
      children: [{
        type: 'text',
        content: null,
        href: null,
        italic: false,
        bold: false,
        strikethrough: false,
        mark: true,
        markClass: 'selection-start'
      }, {
        type: 'text',
        content: 'text-2',
        href: null,
        italic: false,
        bold: false,
        strikethrough: false,
        mark: false,
        markClass: null
      }, {
        type: 'text',
        content: null,
        href: null,
        italic: false,
        bold: false,
        strikethrough: false,
        mark: true,
        markClass: 'selection-end'
      }]
    }];
    const app = tree(<ArticleJsonToContenteditable items={initialItems} onUpdate={onUpdate}/>);
    const container = renderAppInContainer(app);
    const secondParagraph = container.querySelectorAll('article p')[1];
    let onUpdateCalled = false;

    function onUpdate ({items}) {
      onUpdateCalled = true;
      t.deepEqual(items, expected);
    }

    setSelection(secondParagraph, 0, secondParagraph, 1);
    container.querySelector('article').dispatchEvent(mouseup());
    t.ok(onUpdateCalled, 'onUpdate was called');
    app.unmount();
    t.end();
  });

  test('<ArticleJsonToContenteditable> selections=false', t => {
    const items = [{
      type: 'paragraph',
      children: [{
        type: 'text',
        content: null,
        href: null,
        italic: false,
        bold: false,
        strikethrough: false,
        mark: true,
        markClass: 'selection-start'
      }, {
        type: 'text',
        content: 'text-11',
        href: null,
        italic: false,
        bold: false,
        strikethrough: false,
        mark: false,
        markClass: null
      }, {
        type: 'text',
        content: null,
        href: null,
        italic: false,
        bold: false,
        strikethrough: false,
        mark: true,
        markClass: 'selection-end'
      }]
    }, {
      type: 'paragraph',
      children: [{
        type: 'text',
        content: 'text-22',
        href: null,
        italic: false,
        bold: false,
        strikethrough: false,
        mark: false,
        markClass: null
      }]
    }];
    const expected = items;
    const app = tree(<ArticleJsonToContenteditable items={items} onUpdate={onUpdate} selections={false} />);
    const container = renderAppInContainer(app);
    const secondParagraph = container.querySelectorAll('article p')[1];
    let onUpdateCalled = false;

    function onUpdate ({items}) {
      onUpdateCalled = true;
      t.deepEqual(items, expected, 'Should not have updated selections');
    }

    setSelection(secondParagraph, 0, secondParagraph, 1);
    container.querySelector('article').dispatchEvent(mouseup());
    t.ok(onUpdateCalled, 'onUpdate was called');
    t.end();
  });
}
