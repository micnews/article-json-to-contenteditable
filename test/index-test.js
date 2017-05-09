/* eslint-disable deku/no-unknown-property */

import test from './helpers/test-runner';
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

test('<ArticleJsonToContenteditable contenteditable=false />', t => {
  const expected = renderString(tree(<article contenteditable='false'></article>));
  const actual = renderString(tree(<ArticleJsonToContenteditable contenteditable='false' items={[]} />));

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

  test('<ArticleJsonToContenteditable onUpdate keydown w dead key', t => {
    let onUpdateCalled = false;

    function onUpdate ({items, selectionBoundingClientRect}) {
      onUpdateCalled = true;
      t.ok(Array.isArray(items), 'items is an Array');
      t.equal(selectionBoundingClientRect, null, 'selectionBoundingClientRect is null');
    }

    const app = tree(<ArticleJsonToContenteditable items={[]} onUpdate={onUpdate}/>);
    const container = renderAppInContainer(app);
    const keydownEvent = new window.KeyboardEvent('keydown', { key: 'Dead' });
    container.querySelector('article').dispatchEvent(keydownEvent);
    t.notOk(onUpdateCalled, 'onUpdate was not called');
    process.nextTick(() => {
      t.notOk(onUpdateCalled, 'onUpdate was not called');
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

    function onUpdate ({items, selectionBoundingClientRect, activeItem}) {
      onUpdateCalled = true;
      actual = items;
      t.ok(Array.isArray(items), 'items is an Array');
      t.equal(selectionBoundingClientRect, undefined, 'selectionBoundingClientRect is undefined');
      t.equal(activeItem, undefined, 'selectionBoundingClientRect is undefined');
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
    t.ok(customKeyDownCancelled, 'customKeyDown event should be cancelled');

    process.nextTick(() => {
      t.notOk(updateCalled, 'onUpdate was not called');
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
      t.is(container.querySelector('mark.selection-start'), null, 'No selection tag in dom');
      t.is(container.querySelector('mark.selection-end'), null, 'No selection tag in dom');
    }

    setSelection(secondParagraph, 0, secondParagraph, 1);
    container.querySelector('article').dispatchEvent(mouseup());
    t.ok(onUpdateCalled, 'onUpdate was called');
    app.unmount();
    t.end();
  });

  test('<ArticleJsonToContenteditable> no saved selections on blur', t => {
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
        content: 'text-2',
        href: null,
        italic: false,
        bold: false,
        strikethrough: false,
        mark: false,
        markClass: null
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
    container.querySelector('article').dispatchEvent(new window.Event('blur'));
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

  test('<ArticleJsonToContenteditable onUpdate paste', t => {
    let onUpdateCalled = false;

    function onUpdate ({items, selectionBoundingClientRect}) {
      onUpdateCalled = true;
      t.ok(Array.isArray(items), 'items is an Array');
      t.equal(selectionBoundingClientRect, null, 'selectionBoundingClientRect is null');
    }

    const app = tree(<ArticleJsonToContenteditable items={[]} onUpdate={onUpdate}/>);
    const container = renderAppInContainer(app);
    container.querySelector('article').dispatchEvent(keydown({ meta: true, key: 'v' }));
    t.notOk(onUpdateCalled, 'onUpdate was not called for metaKey + v');
    process.nextTick(() => {
      t.notOk(onUpdateCalled, 'onUpdate was not called for metaKey + v in next tick');

      const event = new window.KeyboardEvent('paste');
      container.querySelector('article').dispatchEvent(event);

      t.notOk(onUpdateCalled, 'onUpdate was not called for onPaste');
      process.nextTick(() => {
        t.ok(onUpdateCalled, 'onUpdate was called for onPaste in next tick');
        t.end();
      });
    });
  });

  test('<ArticleJsonToContenteditable onUpdate cut', t => {
    let onUpdateCalled = false;

    function onUpdate ({items, selectionBoundingClientRect}) {
      onUpdateCalled = true;
      t.ok(Array.isArray(items), 'items is an Array');
      t.equal(selectionBoundingClientRect, null, 'selectionBoundingClientRect is null');
    }

    const app = tree(<ArticleJsonToContenteditable items={[]} onUpdate={onUpdate}/>);
    const container = renderAppInContainer(app);
    container.querySelector('article').dispatchEvent(keydown({ meta: true, key: 'x' }));
    t.notOk(onUpdateCalled, 'onUpdate was not called for metaKey + x');
    process.nextTick(() => {
      t.notOk(onUpdateCalled, 'onUpdate was not called for metaKey + x in next tick');

      const event = new window.KeyboardEvent('cut');
      container.querySelector('article').dispatchEvent(event);

      t.notOk(onUpdateCalled, 'onUpdate was not called for onPaste');
      process.nextTick(() => {
        t.ok(onUpdateCalled, 'onUpdate was called for onPaste in next tick');
        t.end();
      });
    });
  });

  test('<ArticleJsonToContenteditable keep figureProps', t => {
    const items = [{
      type: 'embed',
      embedType: 'image',
      src: 'http://image-source.jpg',
      figureProps: {
        class: 'beep-boop'
      }
    }];
    const app = tree(<ArticleJsonToContenteditable items={items} />);
    const container = renderAppInContainer(app);
    const actual = container.querySelector('figure').className;
    const expected = 'beep-boop';
    t.is(actual, expected);
    t.end();
  });

  test('<ArticleJsonToContenteditable /> add url to parse to embed', t => {
    const items = [{
      type: 'paragraph',
      children: [{
        bold: false,
        content: 'Text',
        href: null,
        italic: false,
        mark: false,
        markClass: null,
        strikethrough: false,
        type: 'text'
      }]
    }];
    const expected = [{
      type: 'paragraph',
      children: [{
        bold: false,
        content: 'Text',
        href: null,
        italic: false,
        mark: false,
        markClass: null,
        strikethrough: false,
        type: 'text'
      }]
    }, {
      type: 'embed',
      embedType: 'facebook',
      url: 'https://www.facebook.com/MicMedia/videos/1318391108183676',
      id: '1318391108183676',
      embedAs: 'video',
      user: 'MicMedia'
    }];
    const app = tree(<ArticleJsonToContenteditable items={items} onUpdate={onUpdate}/>);
    const container = renderAppInContainer(app);
    const newParagraph = document.createElement('p');
    newParagraph.innerHTML = 'https://www.facebook.com/MicMedia/videos/1318391108183676';
    container.querySelector('article').appendChild(newParagraph);

    let onUpdateCalled = false;

    function onUpdate ({items: actual}) {
      onUpdateCalled = true;
      t.deepEqual(actual, expected);
    }

    container.querySelector('article').dispatchEvent(mouseup());
    t.ok(onUpdateCalled, 'onUpdate was called');
    t.end();
  });

  test('<ArticleJsonToContenteditable /> add url to parse to embed', t => {
    const items = [{
      type: 'paragraph',
      children: [{
        bold: false,
        content: 'Text',
        href: null,
        italic: false,
        mark: false,
        markClass: null,
        strikethrough: false,
        type: 'text'
      }]
    }];
    const expected = [{
      type: 'paragraph',
      children: [{
        bold: false,
        content: 'Text',
        href: null,
        italic: false,
        mark: false,
        markClass: null,
        strikethrough: false,
        type: 'text'
      }]
    }, {
      type: 'paragraph',
      children: [{
        bold: false,
        content: 'notavalidprotocolhttps://www.facebook.com/MicMedia/videos/1318391108183676',
        href: null,
        italic: false,
        mark: false,
        markClass: null,
        strikethrough: false,
        type: 'text'
      }]
    }];
    const app = tree(<ArticleJsonToContenteditable items={items} onUpdate={onUpdate}/>);
    const container = renderAppInContainer(app);
    const newParagraph = document.createElement('p');
    newParagraph.innerHTML = 'notavalidprotocolhttps://www.facebook.com/MicMedia/videos/1318391108183676';
    container.querySelector('article').appendChild(newParagraph);

    let onUpdateCalled = false;

    function onUpdate ({items: actual}) {
      onUpdateCalled = true;
      t.deepEqual(actual, expected);
    }

    container.querySelector('article').dispatchEvent(mouseup());
    t.ok(onUpdateCalled, 'onUpdate was called');
    t.end();
  });
}
