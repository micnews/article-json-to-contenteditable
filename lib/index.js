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
import diff, {CREATE, UPDATE, MOVE, REMOVE} from 'dift';

function parseEmbed (type) {
  return (elm) => {
    if (!elm || elm.getAttribute('type') !== type || !elm.__props__) {
      return null;
    }

    return elm.__props__;
  };
}

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

  return {
    name: 'Wrapper',
    render: ({props: {onUpdate, getCustomKeyDown, selections = true}}) => {
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
      const articleProps = objectAssign({contenteditable: 'true'}, events);
      return <Article items={[]} contenteditable='true' articleProps={articleProps} />;
    },
    shouldUpdate: ({props}, nextProps) => {
      return props.items !== nextProps.items || props.selections !== nextProps.selections;
    },
    afterRender: ({props: {items, selections = true}}, oldArticleElm) => {
      const app = tree(<Article items={map(items, formatItems)} />);

      const tmpElm = document.createElement('div');
      render(app, tmpElm);
      const newArticleElm = tmpElm.querySelector('article');

      assert(oldArticleElm, 'oldArticleElm must exists');
      assert(newArticleElm, 'newArticleElm must exists');

      const newList = Array.from(newArticleElm.childNodes);
      const oldList = Array.from(oldArticleElm.childNodes);
      diff(oldList, newList, (type, prev, next, pos) => {
        switch (type) {
          case CREATE:
            if (next) {
              oldArticleElm.insertBefore(next, oldArticleElm.childNodes[pos] || null);
            }
            break;
          case UPDATE:
            // we never end up here since equality for us means that things are equal
            break;
          case MOVE:
            // TODO: Implement move
            break;
          case REMOVE:
            if (prev && prev.remove) {
              prev.remove();
            }
            break;
        }
      }, (elm) => {
        if (elm.tagName.toLowerCase() === 'figure' && elm.querySelector('iframe')) {
          // TODO: Handle if caption has changed, we should prob handle that in update (above)
          return elm.querySelector('iframe').id;
        }

        return elm.outerHTML;
      });

      if (selections) {
        restoreSelection(oldArticleElm);
      }
    }
  };
};

function formatItems (item) {
  if (item.type === 'embed') {
    return setIn(item, ['figureProps', 'contenteditable'], 'false');
  }
  return item;
}

export default setup;
