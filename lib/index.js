/* eslint-disable deku/no-unknown-property */

import {render, tree} from 'deku';
import element from 'magic-virtual-element';
import {save as saveSelection, restore as restoreSelection} from 'save-selection';
import setupHtmlToArticleJson from 'html-to-article-json';
import assert from 'assert';
import setupArticle from 'article-json-html-render';
import embeds from './embeds';
import parseUrl from './parse-url';
import setupEvents from './setup-events';
import getSelectionRect from './get-selection-rect';
import getIndexAndRectOfActiveEditorBlock from './get-index-and-rect-of-active-editor-block';
import {map} from 'immutable-array-methods';
import {setIn} from 'immutable-object-methods';
import objectAssign from 'object-assign';
import patchDom from './patch-dom';

function parseEmbed (type) {
  return (elm) => {
    if (!elm || elm.getAttribute('type') !== type || !elm.__props__) {
      return null;
    }

    return objectAssign({ width: elm.width, height: elm.height }, elm.__props__);
  };
}

let currentElement = {};
let nextElement = {};

const setup = ({customTextFormattings, parseFigureProps, customCaption} = {}) => {
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
      embedType: 'tumblr',
      parse: parseEmbed('tumblr')
    }, {
      parse: parseUrl
    }],
    customTextFormattings,
    parseFigureProps
  });

  const Article = setupArticle({
    embeds: embeds,
    renderEmptyTextNodes: true,
    customTextFormattings,
    customCaption
  });

  function renderArticleJson ({ items }) {
    const app = tree(<Article items={map(items, formatItems)} />);
    const tmpElm = document.createElement('div');
    render(app, tmpElm);
    return tmpElm.querySelector('article');
  }

  return {
    name: 'Wrapper',
    render: ({props: {onUpdate, getCustomKeyDown, selections = true, contenteditable = 'true'}}) => {
      const eventhandler = ({delegateTarget: articleContainer}) => {
        const activeItem = getIndexAndRectOfActiveEditorBlock(articleContainer);
        const selectionBoundingClientRect = getSelectionRect(articleContainer);
        if (selections) {
          saveSelection(articleContainer);
        }
        const items = htmlToArticleJson(articleContainer);
        onUpdate({items, selectionBoundingClientRect, activeItem});
      };

      const onBlur = ({delegateTarget: articleContainer}) => {
        const items = htmlToArticleJson(articleContainer);
        onUpdate({items});
      };

      const events = objectAssign({onBlur}, setupEvents(eventhandler, getCustomKeyDown));
      const articleProps = objectAssign({contenteditable}, events);
      return <Article items={[]} articleProps={articleProps} />;
    },
    shouldUpdate: ({props, id}, nextProps) => {
      const itemsHasUpdated = props.items !== nextProps.items;
      if (itemsHasUpdated) {
        const next = renderArticleJson({ items: nextProps.items });
        nextElement[id] = next;
      }

      const shouldUpdate = itemsHasUpdated ||
        props.selections !== nextProps.selections ||
        props.contenteditable !== nextProps.contenteditable;

      if (!shouldUpdate) {
        // To clean up selection mark tags
        restoreSelection(currentElement[id]);
      }
      return shouldUpdate;
    },
    afterRender: ({props: {items, selections = true}, id}, oldArticleElm) => {
      currentElement[id] = oldArticleElm;
      const newArticleElm = nextElement[id] || renderArticleJson({ items });

      assert(oldArticleElm, 'oldArticleElm must exists');
      assert(newArticleElm, 'newArticleElm must exists');

      if (oldArticleElm.innerHTML !== removeSelectionTagsFromString(newArticleElm.innerHTML)) {
        patchDom({oldArticleElm, newArticleElm});

        if (selections) {
          restoreSelection(oldArticleElm);
        }
      }
    }
  };
};

function removeSelectionTagsFromString (html) {
  return html.replace('<mark class="selection-start"></mark>', '').replace('<mark class="selection-end"></mark>', '');
}

function formatItems (item) {
  if (item.type === 'embed') {
    return setIn(item, ['figureProps', 'contenteditable'], 'false');
  }
  return item;
}

export default setup;
