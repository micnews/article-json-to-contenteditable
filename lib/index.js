/* eslint-disable deku/no-unknown-property */

import {render, tree} from 'deku';
import element from 'magic-virtual-element';
import {save as saveSelection, restore as restoreSelection} from 'save-selection';
import morphdom from 'morphdom';
import setupHtmlToArticleJson from 'html-to-article-json';
import assert from 'assert';
import setupArticle from 'article-json-html-render';
import embeds from './embeds';
import parseUrl from './parse-url';
import setupEvents from './setup-events';
import getSelectionRect from './get-selection-rect';
import getIndexAndRectOfActiveEditorBlock from './get-index-and-rect-of-active-editor-block';
import {map} from 'immutable-array-methods';
import {set} from 'immutable-object-methods';

const Article = setupArticle({
  embeds: embeds,
  renderEmptyTextNodes: true
});

function parseEmbed (type) {
  return (elm) => {
    if (!elm || elm.getAttribute('type') !== type || !elm.__props__) {
      return null;
    }

    return elm.__props__;
  };
}

const htmlToArticleJson = setupHtmlToArticleJson({
  customEmbedTypes: [{
    embedType: 'facebook',
    parse: parseEmbed('facebook')
  }, {
    embedType: 'instagram',
    parse: parseEmbed('instagram')
  }, {
    embedType: 'twitter',
    parse: parseEmbed('twitter')
  }, {
    parse: parseUrl
  }]
});

export default {
  name: 'Wrapper',
  render: ({props: {onUpdate, onUndo, onRedo}}) => {
    const eventhandler = ({delegateTarget}) => {
      const articleContainer = delegateTarget.querySelector('article');
      const activeItem = getIndexAndRectOfActiveEditorBlock(articleContainer);
      const selectionBoundingClientRect = getSelectionRect(delegateTarget);
      saveSelection(delegateTarget);
      const items = htmlToArticleJson(delegateTarget);
      onUpdate({items, selectionBoundingClientRect, activeItem});
    };

    const events = setupEvents(eventhandler, onUndo, onRedo);
    return (<div
      contenteditable='true'
      {...events}
      >
      <Article items={[]} />
    </div>);
  },
  shouldUpdate: ({props}, nextProps) => {
    return props.items !== nextProps.items;
  },
  afterRender: ({props: {items}}, elm) => {
    const oldArticleElm = elm.querySelector('article');
    const app = tree(<Article items={map(items, formatItems)} />);

    const tmpElm = document.createElement('div');
    render(app, tmpElm);
    const newArticleElm = tmpElm.querySelector('article');

    assert(oldArticleElm, 'oldArticleElm must exists');
    assert(newArticleElm, 'newArticleElm must exists');

    morphdom(oldArticleElm, newArticleElm, {
      onBeforeElUpdated: function (fromEl, toEl) {
        return fromEl.tagName.toLowerCase() !== 'iframe';
      }
    });
    restoreSelection(oldArticleElm);
  }
};

function formatItems (item) {
  if (item.type === 'embed') {
    return set(item, 'figureProps', { contenteditable: 'false' });
  }
  return item;
}
