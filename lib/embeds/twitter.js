/* @flow */

import { Component } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import renderEmbed from 'article-json-react-embeds';

import loadEmbed from './load-embed';
import renderEmbedIframe from './render-embed-iframe';
import type { IFrameWithPropsType } from '../types';

type PropsType = {
  url: string,
  id: string,
  user: string,
  text: string,
  date: string,
  height: number,
  onLoaded: Function,
  onResize: Function,
};

class TwitterEmbed extends Component {
  constructor(props: PropsType) {
    super(props);

    this.getIframeRef = this.getIframeRef.bind(this);
  }

  componentDidMount() {
    this.iframeElm.__props__ = this.props;
    const { text, url, date, user, id, onLoaded, onResize } = this.props;
    const content = renderToStaticMarkup(renderEmbed({ type: 'twitter', text, url, date, user, id }));
    // Needed for tests to pass
    const protocol = window.location.protocol === 'file:'
      ? 'https:'
      : '';

    const script = `<script src="${protocol}//platform.twitter.com/widgets.js"></script>
      <script>window.twttr && window.twttr.events.bind('loaded',resize);</script>`;

    loadEmbed({ content: content + script, iframe: this.iframeElm, onLoaded, onResize });
  }

  getIframeRef: IFrameWithPropsType => void
  getIframeRef(node: IFrameWithPropsType) {
    this.iframeElm = node;
  }

  iframeElm: IFrameWithPropsType

  render() {
    const { id, height } = this.props;

    return renderEmbedIframe({ id, height, type: 'twitter', passRef: this.getIframeRef });
  }
}

export default TwitterEmbed;
