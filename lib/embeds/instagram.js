import React from 'react';
import { render as renderEmbed } from 'embeds';

import loadEmbed from './load-embed';
import renderEmbedIframe from './render-embed-iframe';

export default {
  name: 'InstagramEmbed',
  render: ({ props: { id, height } }) => renderEmbedIframe({ id, height, type: 'instagram' }),
  afterMount: ({ props }, iframe) => {
    iframe.__props__ = props;
    const { embedAs, url, text, user = {}, date = {}, onLoaded, onResize } = props;
    const content = renderString(tree(renderEmbed({ type: 'instagram', embedAs, url, text, user, date })));
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

    loadEmbed({ content: content + script, iframe, onLoaded, onResize });
  },
};
