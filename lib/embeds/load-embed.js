const noop = () => {};

export default ({ iframe, content, onLoaded = noop, onResize = noop }) => {
  const onloaded = function () {
    const doc = iframe.contentWindow.document;
    iframe.contentWindow.resize = () => {
      const height = iframe.contentWindow && iframe.contentWindow.document.body.scrollHeight;
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
