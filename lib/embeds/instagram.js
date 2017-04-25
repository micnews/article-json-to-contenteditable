/* @flow */

import { Component } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import renderEmbed from 'article-json-react-embeds';

import loadEmbed from './load-embed';
import renderEmbedIframe from './render-embed-iframe';
import type { IFrameWithPropsType } from '../types';

export type InstagramEmbedPropsType = {
  url: string,
  id: string,
  embedAs: string,
  user: string,
  text: string,
  date: string,
  height: number,
  onLoaded: Function,
  onResize: Function,
};

class InstagramEmbed extends Component {
  constructor(props: InstagramEmbedPropsType) {
    super(props);

    this.getIframeRef = this.getIframeRef.bind(this);
  }

  componentDidMount() {
    this.iframeElm.__props__ = this.props;
    const { embedAs, url, text, user = {}, date = {}, onLoaded, onResize } = this.props;
    const content = renderToStaticMarkup(renderEmbed({ type: 'instagram', embedAs, url, text, user, date }));
    // Needed for tests to pass
    const protocol = window.location.protocol === 'file:'
      ? 'https:'
      : '';

    const script = `<script src="${protocol}//platform.instagram.com/en_US/embeds.js"></script>
      <script>
        const interval = setInterval(function () {
          const iframe = document.querySelector('iframe.instagram-media-rendered');
          if (iframe && iframe.height) {
            resize();
            clearInterval(interval);
          }
        }, 100);
      </script>`;

    loadEmbed({ content: content + script, iframe: this.iframeElm, onLoaded, onResize });
  }

  getIframeRef: IFrameWithPropsType => void
  getIframeRef(node: IFrameWithPropsType) {
    this.iframeElm = node;
  }

  iframeElm: IFrameWithPropsType

  render() {
    const { id, height } = this.props;

    return renderEmbedIframe({ id, height, type: 'instagram', passRef: this.getIframeRef });
  }
}

export default InstagramEmbed;
