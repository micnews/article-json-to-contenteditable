/* eslint-disable deku/no-unknown-property */

import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { save as saveSelection, restore as restoreSelection } from 'save-selection';
import setupHtmlToArticleJson from 'html-to-article-json';
import assert from 'assert';
import setupArticle from 'article-json-react-render';
import { map } from 'immutable-array-methods';
import { setIn } from 'immutable-object-methods';

import embeds from './embeds';
import parseUrl from './parse-url';
import setupEvents from './setup-events';
import getSelectionRect from './get-selection-rect';
import getIndexAndRectOfActiveEditorBlock from './get-index-and-rect-of-active-editor-block';
import patchDom from './patch-dom';

function parseEmbed(type) {
  return (elm) => {
    if (!(elm && elm.getAttribute('type') === type && elm.__props__)) {
      return null;
    }

    return Object.assign({ width: elm.width, height: elm.height }, elm.__props__);
  };
}

function formatItems(item) {
  if (item.type === 'embed') {
    return setIn(item, ['figureProps', 'contentEditable'], 'false');
  }
  return item;
}

const setup = ({ customTextFormattings, parseFigureProps, customCaption } = {}) => {
  const htmlToArticleJson = setupHtmlToArticleJson({
    customEmbedTypes: [{
      embedType: 'facebook',
      parse: parseEmbed('facebook'),
    }, {
      embedType: 'instagram',
      parse: parseEmbed('instagram'),
    }, {
      embedType: 'twitter',
      parse: parseEmbed('twitter'),
    }, {
      embedType: 'tumblr',
      parse: parseEmbed('tumblr'),
    }, {
      parse: parseUrl,
    }],
    customTextFormattings,
    parseFigureProps,
  });

  const Article = setupArticle({
    embeds,
    renderEmptyTextNodes: true,
    customTextFormattings,
    customCaption,
  });

  function renderArticleJson({ items }) {
    const app = <Article items={map(items, formatItems)} />;
    const tmpElm = document.createElement('div');
    render(app, tmpElm);
    return tmpElm.querySelector('article');
  }

  class Wrapper extends Component {
    componentDidMount() {
      const { items, selections = true } = this.props;

      const oldArticleElm = this.articleElm.children[0];
      const newArticleElm = renderArticleJson({ items });
      patchDom({ oldArticleElm, newArticleElm });

      if (selections) {
        restoreSelection(oldArticleElm);
      }
    }

    shouldComponentUpdate(nextProps) {
      const current = this.articleElm.children[0];
      const next = renderArticleJson({ items: nextProps.items });

      // This is saved here so that we don't have to recalculate it
      // if we end up needing to set it in componentDidUpdate.
      this.nextElement = next;
      const itemsHasUpdated = this.props.items !== nextProps.items;
      const htmlHasUpdated = itemsHasUpdated && next.innerHTML !== current.innerHTML;

      return htmlHasUpdated ||
        this.props.selections !== nextProps.selections ||
        this.props.contentEditable !== nextProps.contentEditable;
    }

    componentDidUpdate() {
      const { selections = true } = this.props;

      const oldArticleElm = this.articleElm.children[0];
      const newArticleElm = this.nextElement;

      assert(oldArticleElm, 'oldArticleElm must exists');
      assert(newArticleElm, 'newArticleElm must exists');

      patchDom({ oldArticleElm, newArticleElm });

      if (selections) {
        restoreSelection(oldArticleElm);
      }
    }

    render() {
      const { onUpdate, getCustomKeyDown, selections = true, contentEditable = 'true' } = this.props;

      const eventhandler = ({ delegateTarget: articleContainer }) => {
        const activeItem = getIndexAndRectOfActiveEditorBlock(articleContainer);
        const selectionBoundingClientRect = getSelectionRect(articleContainer);
        if (selections) {
          saveSelection(articleContainer);
        }
        const items = htmlToArticleJson(articleContainer);
        onUpdate({ items, selectionBoundingClientRect, activeItem });
      };

      const onBlur = ({ delegateTarget: articleContainer }) => {
        const items = htmlToArticleJson(articleContainer);
        onUpdate({ items });
      };

      const events = Object.assign({ onBlur }, setupEvents(eventhandler, getCustomKeyDown));
      const articleProps = Object.assign({ contentEditable }, events);
      return (
        <div ref={node => (this.articleElm = node)}>
          <Article
            items={[]}
            articleProps={articleProps}
          />
        </div>
      );
    }
  }

  Wrapper.propTypes = {
    items: PropTypes.array.isRequired,
    onUpdate: PropTypes.func,
    getCustomKeyDown: PropTypes.func,
    selections: PropTypes.bool,
    contentEditable: PropTypes.oneOf(['true', 'false']),
  };

  return Wrapper;
};

export default setup;
