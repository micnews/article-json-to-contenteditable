/* eslint-disable deku/no-unknown-property */

import test from 'tape-catch';
import element from 'magic-virtual-element';
import { renderString, render, tree } from 'deku';
import createEvent from 'create-event';
import ArticleJsonToContenteditable from '../lib/index';
import setCaret from './helpers/set-caret';
import setSelection from './helpers/set-selection';

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

  // Dispatching events does not cause any sideeffects like setting the caret/selection.
  // So here is a separate test for `activeItemIndex` property returned by onUpdate
  // where the caret position is set explicitly.
  test('<ArticleJsonToContenteditable onUpdate returns activeItem', t => {
    const container = document.body.appendChild(document.createElement('div'));

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
    render(app, container);
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

  test('<ArticleJsonToContenteditable> custom undo/redo', t => {
    let updateCalled = false;
    let undoCalled = false;
    let redoCalled = false;
    function onUpdate () {
      updateCalled = true;
    }

    function onUndo () {
      undoCalled = true;
    }

    function onRedo () {
      redoCalled = true;
    }

    const container = document.body.appendChild(document.createElement('div'));
    const app = tree(<ArticleJsonToContenteditable
      items={[]}
      onUpdate={onUpdate}
      onUndo={onUndo}
      onRedo={onRedo}
    />);
    render(app, container);

    const undoCancelled = !container.querySelector('article').dispatchEvent(keydown({meta: true, key: 'Z'}));
    const redoCancelled = !container.querySelector('article').dispatchEvent(keydown({meta: true, shift: true, key: 'Z'}));

    t.ok(undoCancelled, 'undo event should be cancelled');
    t.ok(redoCancelled, 'redo event should be cancelled');
    t.ok(updateCalled, 'onUpdate was called');

    process.nextTick(() => {
      t.ok(undoCalled, 'onUndo was called');
      t.ok(redoCalled, 'onRedo was called');

      t.end();
    });
  });

  test('<ArticleJsonToContenteditable> selections default behaviour', t => {
    const container = document.body.appendChild(document.createElement('div'));

    const items = [{
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
        mark: true,
        markClass: 'selection-start'
      }, {
        type: 'text',
        content: 'text-2',
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
    }];
    const app = tree(<ArticleJsonToContenteditable items={items} onUpdate={onUpdate}/>);
    render(app, container);
    const secondParagraph = container.querySelectorAll('article p')[1];
    let onUpdateCalled = false;

    function onUpdate ({items}) {
      onUpdateCalled = true;
      t.deepEqual(items, expected);
    }

    setSelection(secondParagraph, 0, secondParagraph, 1);
    container.querySelector('article').dispatchEvent(mouseup());
    t.ok(onUpdateCalled, 'onUpdate was called');
    t.end();
  });

  test('<ArticleJsonToContenteditable> selections=false', t => {
    const container = document.body.appendChild(document.createElement('div'));

    const items = [{
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
        content: 'text-11',
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
        content: 'text-22',
        href: null,
        italic: false,
        bold: false,
        mark: false,
        markClass: null
      }]
    }];
    const expected = items;
    const app = tree(<ArticleJsonToContenteditable items={items} onUpdate={onUpdate} selections={false} />);
    render(app, container);

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
