import {render, tree} from 'deku';
import element from 'magic-virtual-element';
import {Component, setupUpdate, getComponent} from '../lib/index';

const container = document.querySelector('#editor');

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
}, {
  type: 'embed',
  embedType: 'facebook',
  url: 'https://www.facebook.com/david.bjorklund/posts/10153809692501070',
  embedAs: 'post',
  date: 'Thursday, January 21, 2016',
  user: 'David Pop Hipsterson',
  text: [{
    content: 'Hey!So, for the last few weeks I\'ve worked on http://mic.com/ - the new home for mic.com (on desktop) - please take a look :)',
    href: null
  }]
}];

const app = tree(getComponent({items, onInput, container}));
render(app, container);

const update = setupUpdate({container, onInput});
function onInput ({items}) {
  update({items});
}
