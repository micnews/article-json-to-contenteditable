import element from 'magic-virtual-element';
import {render as renderEmbed} from 'embeds';
import {renderString, tree} from 'deku';

const noop = () => {};

export default {
  name: 'InstagramEmbed',
  render: () => {
    return <iframe type='instagram' frameBorder='0' width='100%' src='javascript:false'></iframe>;
  },
  afterRender: ({props}, iframe) => {
    iframe.__props__ = props;
    const {embedAs, url, text, user = {}, date = {}, onLoaded = noop} = props;
    const content = renderString(tree(renderEmbed({ type: 'instagram', embedAs, url, text, user: user, date })));
    // Needed for tests to pass
    const protocol = window.location.protocol === 'file:'
      ? 'https:'
      : '';

    const script = `<script src="${protocol}//platform.instagram.com/en_US/embeds.js"></script>`;

    const onloaded = function () {
      const doc = iframe.contentWindow.document;
      doc.open().write(content + script);
      doc.close();
      onLoaded();
      const height = iframe.contentWindow && iframe.contentWindow.document.body.scrollHeight;
      iframe.height = height;
    };

    if (iframe.contentWindow && iframe.contentWindow.document) {
      onloaded();
    } else {
      iframe.onload = onloaded;
    }
  }
};
