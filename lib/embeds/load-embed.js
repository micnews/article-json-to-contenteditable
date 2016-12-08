const noop = () => {};

export default ({ iframe, content, onLoaded = noop, onResize = noop }) => {
  const onloaded = function () {
    const doc = iframe.contentWindow.document;
    iframe.contentWindow.resize = () => {
      let height;
      // Don't crash if for some reason we don't have access to the iframe document.
      try {
        height = iframe.contentWindow && iframe.contentWindow.document.body.scrollHeight;
      } catch (e) {
        console.error(e);
        height = 150;
      }
      iframe.height = height;
      onResize({height});
    };
    doc.open().write(content);
    doc.close();
    onLoaded();
  };

  if (iframe.contentWindow && iframe.contentWindow.document) {
    onloaded();
  } else {
    iframe.onload = onloaded;
  }
};
