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
      if (!elm || elm.getAttribute('type') !== 'facebook' || !elm.__props__) {
        return;
      }

      return elm.__props__;
    }
  }]
});

export const Component = _Component;

export const getComponent = ({items, onInput}) => {
  const update = setupUpdate({onInput});
  const _onInput = ({delegateTarget}) => {
    update({delegateTarget});
  };

  return (<Component items={items} onInput={_onInput} />);
};

function setupUpdate ({onInput}) {
  return ({delegateTarget}) => {
    saveSelection(delegateTarget);
    const newArticleJson = htmlToArticleJson(delegateTarget);
    onInput({ items: newArticleJson });
    const tmpElm = document.createElement('div');
    const app = tree(getComponent({items: newArticleJson, onInput}));
    render(app, tmpElm);
    const oldArticleElm = delegateTarget.querySelector('article');
    const newArticleElm = tmpElm.querySelector('article');
    morphdom(oldArticleElm, newArticleElm);
    restoreSelection(delegateTarget);
  };
}
