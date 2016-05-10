import element from 'magic-virtual-element';
import {render as renderEmbed} from 'embeds';
import {renderString, tree} from 'deku';

const noop = () => {};

export default {
  name: 'FacebookEmbed',
  render: function () {
    return <iframe type='facebook' frameBorder='0' width='100%' src='javascript:false'></iframe>;
  },
  afterRender: function ({props}, iframe) {
    iframe.__props__ = props;
    const {embedAs, url, user, text, headline, date, onLoaded = noop, onResize = noop} = props;
    const content = renderString(tree(renderEmbed({ type: 'facebook', embedAs, url, user, text, headline, date })));

    const script = `<div id="fb-root"></div>
    <script>(function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
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

    const onloaded = function () {
      const doc = iframe.contentWindow.document;
      iframe.contentWindow.resize = () => {
        const height = iframe.contentWindow && iframe.contentWindow.document.body.scrollHeight;
        iframe.height = height;
        onResize({height});
      };
      doc.open().write(content + script);
      doc.close();
      onLoaded();
    };

    if (iframe.contentWindow && iframe.contentWindow.document) {
      onloaded();
    } else {
      iframe.onload = onloaded;
    }
  }
};
