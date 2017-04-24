import { Component, PropTypes } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import renderEmbed from 'article-json-react-embeds';

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

InstagramEmbed.propTypes = {
  url: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  embedAs: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  onLoaded: PropTypes.func.isRequired,
  onResize: PropTypes.func.isRequired,
};

export default InstagramEmbed;
