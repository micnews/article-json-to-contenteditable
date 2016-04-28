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
}];

const app = tree(getComponent({items, onInput, container}));
render(app, container);

const update = setupUpdate({container, onInput});
function onInput ({items}) {
  update({items});
}
