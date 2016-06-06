/* eslint-disable deku/no-unknown-property */

import {render, tree} from 'deku';
import element from 'magic-virtual-element';
import {save as saveSelection, restore as restoreSelection} from 'save-selection';
import morphdom from 'morphdom';
import setupHtmlToArticleJson from 'html-to-article-json';
import assert from 'assert';
import setupArticle from 'article-json-html-render';
import embeds from './embeds';
import {parseInput as parseEmbeds} from 'embeds';
import setupEvents from './setup-events';
import objectAssign from 'object-assign';

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

function parseUrl (elm) {
  if (!elm) {
    return null;
  }

  const content = elm.textContent;
  if (content.substring(0, 4) !== 'http') {
    return null;
  }

  const parsed = parseEmbeds(content);
  if (!parsed) {
    return null;
  }

  return objectAssign({}, parsed, {
    embedType: parsed.type,
    type: 'embed'
  });
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
  render: ({props: {onInput, onBlur}}) => {
    const _onInput = ({delegateTarget}) => {
      saveSelection(delegateTarget);
      const newArticleJson = htmlToArticleJson(delegateTarget);
      onInput({ items: newArticleJson });
    };
    const _onBlur = ({delegateTarget}) => {
      const newArticleJson = htmlToArticleJson(delegateTarget);
      onBlur({ items: newArticleJson });
    };

    const events = setupEvents(_onInput);
    return (<div contenteditable='true' {...events} onBlur={_onBlur}>
      <Article items={[]} />
    </div>);
  },
  shouldUpdate: ({props}, nextProps) => {
    return props.items !== nextProps.items;
  },
  afterRender: ({props: {items}}, elm) => {
    const oldArticleElm = elm.querySelector('article');
    const app = tree(<Article items={items.map(formatItems)} />);

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
    item.figureProps = { contenteditable: 'false' };
  }
  return item;
}
