import { render as renderEmbed } from 'embeds';
import loadEmbed from './load-embed';
import renderEmbedIframe from './render-embed-iframe';

export default {
  name: 'TumblrEmbed',
  render: ({ props: { url } }) => renderEmbedIframe({ url, type: 'tumblr' }),
  afterMount: ({ props }, iframe) => {
    iframe.__props__ = props;
    const { url, onLoaded, onResize } = props;
    const content = renderString(tree(renderEmbed({ type: 'tumblr', url })));
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
    loadEmbed({ tumblr: true, content: content + script, iframe, onLoaded, onResize });
  },
};
