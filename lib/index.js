import {render, tree} from 'deku';
import element from 'magic-virtual-element';
import {save as saveSelection, restore as restoreSelection} from 'save-selection';
import morphdom from 'morphdom';
import setupHtmlToArticleJson from 'html-to-article-json';
import _Component from './component';

const htmlToArticleJson = setupHtmlToArticleJson({
  customEmbedTypes: [{
    embedType: 'facebook',
    parse: elm => {
      if (!elm || elm.getAttribute('type') !== 'facebook') {
        return;
      }

      const parsed = {
        type: 'embed',
        embedType: 'facebook',
        embedAs: elm.getAttribute('embedas'),
        url: elm.getAttribute('url'),
        user: elm.getAttribute('user'),
        text: elm.getAttribute('text'),
        headline: elm.getAttribute('headline'),
        date: elm.getAttribute('date')
      };

      return parsed;
    }
  }]
});

export const Component = _Component;

export const getComponent = ({items, onInput, container}) => {
  const _onInput = () => {
    saveSelection(container);
    onInput({ items: htmlToArticleJson(container) });
  }

  return (<Component items={items} onInput={_onInput} />);
}

export const setupUpdate = ({container, onInput}) => {
  return ({items}) => {
    console.log('update', items);
    const tmpElm = document.createElement('div');
    render(tree(getComponent({items, onInput, container})), tmpElm);
    const oldArticleElm = container.querySelector('article');
    const newArticleElm = tmpElm.querySelector('article');
    morphdom(oldArticleElm, newArticleElm);
    restoreSelection(container);
  }
};
