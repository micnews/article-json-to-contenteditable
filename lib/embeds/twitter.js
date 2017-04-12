import { Component, PropTypes } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { render as renderEmbed } from 'embeds';

import loadEmbed from './load-embed';
import renderEmbedIframe from './render-embed-iframe';

class TwitterEmbed extends Component {
  constructor(props) {
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

  getIframeRef(node) {
    this.iframeElm = node;
  }

  render() {
    const { id, height } = this.props;

    return renderEmbedIframe({ id, height, type: 'twitter', passRef: this.getIframeRef });
  }
}

TwitterEmbed.propTypes = {
  url: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  onLoaded: PropTypes.func.isRequired,
  onResize: PropTypes.func.isRequired,
};

export default TwitterEmbed;
