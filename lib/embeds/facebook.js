/* @flow */

import { Component } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import renderEmbed from 'article-json-react-embeds';

import loadEmbed from './load-embed';
import renderEmbedIframe from './render-embed-iframe';
import type { IFrameWithPropsType } from '../types';

export type FacebookEmbedPropsType = {
  url: string,
  embedAs: string,
  user: string,
  text: string,
  headline: string,
  date: string,
  height: number,
  onLoaded: Function,
  onResize: Function,
};

class FacebookEmbed extends Component {
  constructor(props: FacebookEmbedPropsType) {
    super(props);

    this.getIframeRef = this.getIframeRef.bind(this);
  }

  componentDidMount() {
    this.iframeElm.__props__ = this.props;
    const { embedAs, url, user, text, headline, date, onLoaded, onResize } = this.props;
    const content = renderToStaticMarkup(renderEmbed({ type: 'facebook', embedAs, url, user, text, headline, date }));
    // Needed for tests to pass
    const protocol = window.location.protocol === 'file:'
      ? 'https:'
      : '';

    const script = `<div id="fb-root"></div>
      <script>(function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "${protocol}//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));</script>

      <script>
        window.fbAsyncInit = function() {
          FB.init({
            app_id     : '141861192518680',
            xfbml      : false,
            version    : 'v2.6'
          });

          FB.XFBML.parse(document.body, resize);
        };
      </script>`;

    loadEmbed({ content: content + script, iframe: this.iframeElm, onLoaded, onResize });
  }

  getIframeRef: IFrameWithPropsType => void
  getIframeRef(node: IFrameWithPropsType) {
    this.iframeElm = node;
  }

  iframeElm: IFrameWithPropsType

  render() {
    const { url, height } = this.props;

    return renderEmbedIframe({ url, height, type: 'facebook', passRef: this.getIframeRef });
  }
}

export default FacebookEmbed;
