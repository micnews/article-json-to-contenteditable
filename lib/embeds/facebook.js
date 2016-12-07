import {render as renderEmbed} from 'embeds';
import {renderString, tree} from 'deku';
import loadEmbed from './load-embed';
import renderEmbedIframe from './render-embed-iframe';

export default {
  name: 'FacebookEmbed',
  render: function ({props: {url}}) {
    return renderEmbedIframe({url, type: 'facebook'});
  },
  afterMount: function ({props}, iframe) {
    iframe.__props__ = props;
    const {embedAs, url, user, text, headline, date, onLoaded, onResize} = props;
    const content = renderString(tree(renderEmbed({ type: 'facebook', embedAs, url, user, text, headline, date })));
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

    loadEmbed({ content: content + script, iframe, onLoaded, onResize });
  }
};
