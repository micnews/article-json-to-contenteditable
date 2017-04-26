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
    constructor(props: PropsType) {
      super(props);

      this.onBlur = this.onBlur.bind(this);
      this.onChange = this.onChange.bind(this);
      this.onChangeNextTick = this.onChangeNextTick.bind(this);
    }

    componentDidMount() {
      const { items, selections = true } = this.props;

      const oldArticleElm = this.articleElm.children[0];
      const newArticleElm = renderArticleJson({ items });
      patchDom({ oldArticleElm, newArticleElm });

      if (selections) {
        restoreSelection(oldArticleElm);
      }

      this.articleElm.children[0].addEventListener('mouseup', this.onChange);
      this.articleElm.children[0].addEventListener('cut', this.onChangeNextTick);
      this.articleElm.children[0].addEventListener('paste', this.onChangeNextTick);
    }

    shouldComponentUpdate(nextProps: PropsType) {
      // Check props first without rendering,
      // no need to go through with rendering if we know nothing has changed.
      const propsHasUpdated = this.props.items !== nextProps.items ||
        this.props.selections !== nextProps.selections ||
        this.props.contentEditable !== nextProps.contentEditable;

      if (!propsHasUpdated) {
        return false;
      }

      const current = this.articleElm.children[0];
      const next = renderArticleJson({ items: nextProps.items });

      // This is saved here so that we don't have to recalculate it
      // if we end up needing to set it in componentDidUpdate.
      this.newArticleElm = next;
      const htmlHasUpdated = next && next.innerHTML !== current.innerHTML;
      return propsHasUpdated || htmlHasUpdated;
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

    componentWillUnmount() {
      this.articleElm.children[0].removeEventListener('mouseup', this.onChange);
      this.articleElm.children[0].removeEventListener('cut', this.onChangeNextTick);
      this.articleElm.children[0].removeEventListener('paste', this.onChangeNextTick);
    }

    onBlur: () => void
    onBlur() {
      const articleContainer = this.articleElm.children[0];
      const { onUpdate } = this.props;

      const items = htmlToArticleJson(articleContainer);
      onUpdate({ items });
    }

    onChange: () => void
    onChange() {
      const articleContainer = this.articleElm.children[0];
      const { onUpdate, selections = true } = this.props;

      const activeItem = getIndexAndRectOfActiveEditorBlock(articleContainer);
      const selectionBoundingClientRect = getSelectionRect(articleContainer);
      if (selections) {
        saveSelection(articleContainer);
      }
      const items = htmlToArticleJson(articleContainer);
      onUpdate({ items, selectionBoundingClientRect, activeItem });
    }

    onChangeNextTick: () => void
    onChangeNextTick() {
      process.nextTick(this.onChange);
    }

    props: PropsType
    articleElm: HTMLElement
    newArticleElm: HTMLElement | null

    render() {
      const { getCustomKeyDown, contentEditable = 'true' } = this.props;

      const events = { onBlur: this.onBlur, ...setupEvents(this.onChange, getCustomKeyDown) };
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
