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
          <iframe type='instagram' frameborder='0' width='100%' src='javascript:false'></iframe>
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

  test('<ArticleJsonToContenteditable onInput enter key', t => {
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

  test('<ArticleJsonToContenteditable onInput backspace', t => {
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

      container.querySelector('article').dispatchEvent(keydown({ key: 'backspace' }));
      process.nextTick(() => {
        t.ok(onUpdateCalled, 'onUpdate was called');
        t.end();
      });
    });
  });

  test('<ArticleJsonToContenteditable onInput bold command', t => {
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

      container.querySelector('article').dispatchEvent(keydown({ meta: true, key: 'b' }));
      process.nextTick(() => {
        t.ok(onUpdateCalled, 'onUpdate was called');
        t.end();
      });
    });
  });

  test('<ArticleJsonToContenteditable onInput itaic command', t => {
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

      container.querySelector('article').dispatchEvent(keydown({ meta: true, key: 'i' }));
      process.nextTick(() => {
        t.ok(onUpdateCalled, 'onUpdate was called');
        t.end();
      });
    });
  });
}
