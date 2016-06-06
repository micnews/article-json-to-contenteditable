import element from 'magic-virtual-element';
import {render as renderEmbed} from 'embeds';
import {renderString, tree} from 'deku';
import loadEmbed from './load-embed';
import renderEmbedIframe from './render-embed-iframe';

export default {
  name: 'TwitterEmbed',
  render: ({props: {id}}) => {
    return renderEmbedIframe({id, type: 'twitter'});
  },
  afterMount: ({props}, iframe) => {
    iframe.__props__ = props;
    const {text, url, date, user, id, onLoaded, onResize} = props;
    const content = renderString(tree(renderEmbed({ type: 'twitter', text, url, date, user, id })));
    // Needed for tests to pass
    const protocol = window.location.protocol === 'file:'
      ? 'https:'
      : '';

    const script = `<script src="${protocol}//platform.twitter.com/widgets.js"></script>
      <script>twttr.events.bind('loaded',resize);</script>`;

    loadEmbed({ content: content + script, iframe, onLoaded, onResize });
  }
};
