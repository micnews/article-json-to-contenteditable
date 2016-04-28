import {render as renderEmbed} from 'embeds';

const embeds = {
  youtube: ({youtubeId}) => renderEmbed({type: 'youtube', youtubeId}),
  image: ({src}) => renderEmbed({type: 'image', src}),
  twitter: ({text, url, date, user, id}) => renderEmbed({type: 'twitter', text, url, date, user, id}),
  vine: ({url}) => renderEmbed({type: 'vine', url}),
  instagram: ({url}) => renderEmbed({type: 'instagram', url}),
  facebook: (opts) => renderFacebook(opts),
  custom: ({src, width, height, secure}) => secure && renderEmbed({type: 'custom', src, width, height}) || ''
};

function renderFacebook (opts) {
  const { embedAs, url, user, text, headline, date } = opts;
  const content = renderString(tree(renderEmbed({ type: 'facebook', embedAs, url, user, text, headline, date })));
  return <FacebookEmbed opts={opts}>{content}</FacebookEmbed>;
}

const FacebookEmbed = {
  render: function ({props: {opts}}) {
    return <iframe {...opts} type='facebook' frameBorder='0' width='100%' src='javascript:false'></iframe>;
  },
  afterRender: function ({ props: { children }}, el) {
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
      const doc = el.contentWindow.document;
      el.contentWindow.resize = () => {
        setIframeHeight(el);
      };
      doc.open().write(children + script);
      doc.close();
    };

    if (el.contentWindow && el.contentWindow.document) {
      onloaded();
    } else {
      el.onload = onloaded;
    }

    function setIframeHeight (iframe) {
      const height = iframe.contentWindow && iframe.contentWindow.document.body.scrollHeight;
      iframe.height = height;
    };
  }
}

export default embeds;
