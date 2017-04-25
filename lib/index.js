/* @flow */
/* eslint-disable no-console */

import React, { Component } from 'react';
import { render } from 'react-dom';
import { save as saveSelection, restore as restoreSelection } from 'save-selection';
import setupHtmlToArticleJson from 'html-to-article-json';
import setupArticle from 'article-json-react-render';
import { map } from 'immutable-array-methods';
import { setIn } from 'immutable-object-methods';
import type { ElementsType, TextItemType, GetCustomKeyDownType } from './types';

import embeds from './embeds';
import parseUrl from './parse-url';
import setupEvents from './setup-events';
import getSelectionRect from './get-selection-rect';
import getIndexAndRectOfActiveEditorBlock from './get-index-and-rect-of-active-editor-block';
import patchDom from './patch-dom';

type SetupType = {
  customTextFormattings?: Array<{
    property: string,
    render: (TextItemType, string | React.Element<*>) => React.Element<*>,
  }>,
  parseFigureProps?: Object,
  customCaption?: (ElementsType, ElementsType) => React.Element<*>,
};

type PropsType = {
  items: Array<any>,
  onUpdate: () => void,
  getCustomKeyDown: GetCustomKeyDownType,
  selections: boolean,
  contentEditable: 'true' | 'false',
};

function parseEmbed(type) {
  return (elm) => {
    if (!(elm && elm.getAttribute('type') === type && elm.__props__)) {
      return null;
    }

    return { width: elm.width, height: elm.height, ...elm.__props__ };
  };
}

function formatItems(item) {
  if (item.type === 'embed') {
    return setIn(item, ['figureProps', 'contentEditable'], 'false');
  }
  return item;
}

const setup = ({ customTextFormattings, parseFigureProps, customCaption }: SetupType = {}) => {
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
    return tmpElm.getElementsByTagName('article')[0];
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

    shouldComponentUpdate(nextProps: PropsType) {
      const current = this.articleElm.children[0];
      const next = renderArticleJson({ items: nextProps.items });

      // This is saved here so that we don't have to recalculate it
      // if we end up needing to set it in componentDidUpdate.
      this.newArticleElm = next;
      const itemsHasUpdated = this.props.items !== nextProps.items;
      const htmlHasUpdated = itemsHasUpdated && next && next.innerHTML !== current.innerHTML;

      return htmlHasUpdated ||
        this.props.selections !== nextProps.selections ||
        this.props.contentEditable !== nextProps.contentEditable;
    }

    componentDidUpdate() {
      const { selections = true } = this.props;

      const oldArticleElm = this.articleElm.children[0];
      const newArticleElm = this.newArticleElm;

      if (!oldArticleElm || !newArticleElm) {
        console.error('missing old or new article element', { oldArticleElm, newArticleElm });
        return;
      }

      patchDom({ oldArticleElm, newArticleElm });

      if (selections) {
        restoreSelection(oldArticleElm);
      }
    }

    props: PropsType
    articleElm: HTMLElement
    newArticleElm: HTMLElement | null

    render() {
      const { onUpdate, getCustomKeyDown, selections = true, contentEditable = 'true' } = this.props;

      const eventhandler = ({ currentTarget: articleContainer }) => {
        const activeItem = getIndexAndRectOfActiveEditorBlock(articleContainer);
        const selectionBoundingClientRect = getSelectionRect(articleContainer);
        if (selections) {
          saveSelection(articleContainer);
        }
        const items = htmlToArticleJson(articleContainer);
        onUpdate({ items, selectionBoundingClientRect, activeItem });
      };

      const onBlur = ({ currentTarget: articleContainer }) => {
        const items = htmlToArticleJson(articleContainer);
        onUpdate({ items });
      };

      const events = { onBlur, ...setupEvents(eventhandler, getCustomKeyDown) };
      const articleProps = { contentEditable, ...events };
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

  return Wrapper;
};

export default setup;
