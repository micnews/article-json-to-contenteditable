import { Component } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { render as renderEmbed } from 'embeds';

import loadEmbed from './load-embed';
import renderEmbedIframe from './render-embed-iframe';

class InstagramEmbed extends Component {
  constructor(props) {
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

  getIframeRef(node) {
    this.iframeElm = node;
  }

  render() {
    const { id, height } = this.props;

    return renderEmbedIframe({ id, height, type: 'instagram', passRef: this.getIframeRef });
  }
}

export default InstagramEmbed;
