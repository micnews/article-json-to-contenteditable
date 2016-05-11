import {render, tree} from 'deku';
import Article from '../lib';
import element from 'magic-virtual-element';

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
}, {
  'type': 'embed',
  'embedType': 'instagram',
  'caption': [],
  'date': {},
  'user': {},
  'id': 'tsxp1hhQTG',
  'text': '',
  'url': 'https://instagram.com/p/tsxp1hhQTG'
}];

const onInput = ({items}) => {
  console.log('in client.js onInput');
  app.mount(<Article items={items} onInput={onInput} />);
};

const app = tree(<Article items={items} onInput={onInput} />);

render(app, container);
