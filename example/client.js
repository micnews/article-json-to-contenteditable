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
}, {
  'type': 'embed',
  'embedType': 'vine',
  'caption': [],
  'id': 'iHTTDHz6Z2v',
  'url': 'https://vine.co/v/iHTTDHz6Z2v/embed/simple'
}, {
  'type': 'embed',
  'embedType': 'youtube',
  'caption': [],
  'youtubeId': 'I7IdS-PbEgI'
}, {
  'type': 'embed',
  'embedType': 'custom',
  'caption': [],
  'width': 542,
  'height': 987,
  'secure': true,
  'src': 'https://embed.tumblr.com/embed/post/Hj-X2tKsXur2oF91XMwT5w/141227828011?width=542&language=en_US&did=da39a3ee5e6b4b0d3255bfef95601890afd80709'
}, {
  'type': 'embed',
  'embedType': 'custom',
  'caption': [],
  'width': 480,
  'height': 268,
  'secure': true,
  'src': '//giphy.com/embed/j7ieM4wLOaNu8'
}, {
  'type': 'embed',
  'embedType': 'twitter',
  'caption': [],
  'url': 'https://twitter.com/nvidia/status/699645794903666688',
  'date': '',
  'user': {
    'name': null,
    'slug': null
  },
  'id': '699645794903666688',
  'text': [{
    'content': 'Explore the power of mobility, flexibility, and collaboration at #GTC16. Learn more: http://nvda.ly/Y65h9 pic.twitter.com/cZ34wHVJaP',
    'href': null
  }]
}];

const onInput = ({items}) => {
  console.log('in client.js onInput or onBlur');
  app.mount(<Article items={items} onInput={onInput} onBlur={onInput}/>);
};

const app = tree(<Article items={items} onInput={onInput} />);

render(app, container);
