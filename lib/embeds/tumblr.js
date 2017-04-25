/* @flow */

import { Component } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import renderEmbed from 'article-json-react-embeds';

import loadEmbed from './load-embed';
import renderEmbedIframe from './render-embed-iframe';
import type { IFrameWithPropsType } from '../types';

export type TumblrEmbedPropsType = {
  url: string,
  height: number,
  onLoaded: Function,
  onResize: Function,
};

class TumblrEmbed extends Component {
  constructor(props: TumblrEmbedPropsType) {
    super(props);

    this.getIframeRef = this.getIframeRef.bind(this);
  }

  componentDidMount() {
    this.iframeElm.__props__ = this.props;
    const { url, onLoaded, onResize } = this.props;
    const content = renderToStaticMarkup(renderEmbed({ type: 'tumblr', url }));
    // Needed for tests to pass
    const protocol = window.location.protocol === 'file:'
      ? 'https:'
      : '';

    const script = `<script src="${protocol}//assets.tumblr.com/post.js"></script>
      <script>
      var interval = setInterval(function () {
        var iframe = document.querySelector('.tumblr-embed');
        if (iframe.height) {
          resize();
          clearInterval(interval);
        }
      }, 100);
      </script>`;

    loadEmbed({
      tumblr: true,
      content: content + script,
      iframe: this.iframeElm,
      onLoaded,
      onResize,
    });
  }

  getIframeRef: IFrameWithPropsType => void
  getIframeRef(node: IFrameWithPropsType) {
    this.iframeElm = node;
  }

  iframeElm: IFrameWithPropsType

  render() {
    const { url, height } = this.props;

    return renderEmbedIframe({ url, height, type: 'tumblr', passRef: this.getIframeRef });
  }
}

export default TumblrEmbed;
