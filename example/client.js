import {render, tree} from 'deku';
import {getComponent} from '../lib/index';

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

const app = tree(getComponent({items, onInput}));
render(app, container);

function onInput ({items}) {
  console.log('updated', items);
}
