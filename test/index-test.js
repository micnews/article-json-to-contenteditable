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

function mouseup () {
  return new window.MouseEvent('mouseup');
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

    const expected = renderString(tree(<div contenteditable='true'>
      <article>
        <p>Text text text</p>
        <figure contenteditable='false'>
          <iframe id='instagram-tsxp1hhQTG' type='instagram' frameborder='0' width='100%' src='javascript:false'></iframe>
        </figure>
      </article>
    </div>));
    const app = tree(<ArticleJsonToContenteditable items={items} />);
    const container = document.createElement('div');
    render(app, container);
    const actual = container.innerHTML;

    t.equal(actual, expected);
    t.end();
  });

  test('<ArticleJsonToContenteditable onUpdate enter key', t => {
    const container = document.createElement('div');
    let onUpdateCalled = false;

    function onUpdate ({items, selectionBoundingClientRect}) {
      onUpdateCalled = true;
      t.ok(Array.isArray(items), 'items is an Array');
      t.equal(selectionBoundingClientRect, null, 'selectionBoundingClientRect is null');
    }

    const app = tree(<ArticleJsonToContenteditable items={[]} onUpdate={onUpdate}/>);
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

  test('<ArticleJsonToContenteditable onUpdate backspace', t => {
    const container = document.createElement('div');
    let onUpdateCalled = false;

    function onUpdate ({items, selectionBoundingClientRect}) {
      onUpdateCalled = true;
      t.ok(Array.isArray(items), 'items is an Array');
      t.equal(selectionBoundingClientRect, null, 'selectionBoundingClientRect is null');
    }

    const app = tree(<ArticleJsonToContenteditable items={[]} onUpdate={onUpdate}/>);
    render(app, container);
    container.querySelector('article').dispatchEvent(keydown({ key: 'a' }));
    process.nextTick(() => {
      t.notOk(onUpdateCalled, 'onUpdate was not called');

      container.querySelector('article').dispatchEvent(keydown({ key: 'backspace' }));
      process.nextTick(() => {
        t.ok(onUpdateCalled, 'onUpdate was called');
        t.end();
      });
    });
  });

  test('<ArticleJsonToContenteditable onUpdate bold command', t => {
    const container = document.createElement('div');
    let onUpdateCalled = false;

    function onUpdate ({items, selectionBoundingClientRect}) {
      onUpdateCalled = true;
      t.ok(Array.isArray(items), 'items is an Array');
      t.equal(selectionBoundingClientRect, null, 'selectionBoundingClientRect is null');
    }

    const app = tree(<ArticleJsonToContenteditable items={[]} onUpdate={onUpdate}/>);
    render(app, container);
    container.querySelector('article').dispatchEvent(keydown({ key: 'a' }));
    process.nextTick(() => {
      t.notOk(onUpdateCalled, 'onUpdate was not called');

      container.querySelector('article').dispatchEvent(keydown({ meta: true, key: 'b' }));
      process.nextTick(() => {
        t.ok(onUpdateCalled, 'onUpdate was called');
        t.end();
      });
    });
  });

  test('<ArticleJsonToContenteditable onUpdate itaic command', t => {
    const container = document.createElement('div');
    let onUpdateCalled = false;

    function onUpdate ({items, selectionBoundingClientRect}) {
      onUpdateCalled = true;
      t.ok(Array.isArray(items), 'items is an Array');
      t.equal(selectionBoundingClientRect, null, 'selectionBoundingClientRect is null');
    }

    const app = tree(<ArticleJsonToContenteditable items={[]} onUpdate={onUpdate}/>);
    render(app, container);
    container.querySelector('article').dispatchEvent(keydown({ key: 'a' }));
    process.nextTick(() => {
      t.notOk(onUpdateCalled, 'onUpdate was not called');

      container.querySelector('article').dispatchEvent(keydown({ meta: true, key: 'i' }));
      process.nextTick(() => {
        t.ok(onUpdateCalled, 'onUpdate was called');
        t.end();
      });
    });
  });

  test('<ArticleJsonToContenteditable onUpdate mouseup command', t => {
    const container = document.createElement('div');
    let onUpdateCalled = false;

    function onUpdate ({items, selectionBoundingClientRect}) {
      onUpdateCalled = true;
      t.ok(Array.isArray(items), 'items is an Array');
      t.equal(selectionBoundingClientRect, null, 'selectionBoundingClientRect is null');
    }

    const app = tree(<ArticleJsonToContenteditable items={[]} onUpdate={onUpdate}/>);
    render(app, container);
    container.querySelector('article').dispatchEvent(mouseup());
    process.nextTick(() => {
      t.ok(onUpdateCalled, 'onUpdate was called');
      t.end();
    });
  });

  test('<ArticleJsonToContenteditable onUpdate on blur', t => {
    const container = document.createElement('div');
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
    render(app, container);
    container.querySelector('article').parentNode.dispatchEvent(new window.Event('blur'));
    t.ok(onUpdateCalled, 'onUpdate was called');
    t.deepEqual(actual, expected);
    t.end();
  });
}
