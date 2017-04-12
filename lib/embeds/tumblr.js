import { Component, PropTypes } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { render as renderEmbed } from 'embeds';

import loadEmbed from './load-embed';
import renderEmbedIframe from './render-embed-iframe';

class TumblrEmbed extends Component {
  constructor(props) {
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

  getIframeRef(node) {
    this.iframeElm = node;
  }

  render() {
    const { url, height } = this.props;

    return renderEmbedIframe({ url, height, type: 'tumblr', passRef: this.getIframeRef });
  }
}

TumblrEmbed.propTypes = {
  url: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  onLoaded: PropTypes.func.isRequired,
  onResize: PropTypes.func.isRequired,
};

export default TumblrEmbed;
