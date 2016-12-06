import diff, {CREATE, UPDATE, MOVE, REMOVE} from 'dift';

const isIframeEmbed = (elm) => elm && elm.tagName &&
  elm.tagName.toLowerCase() === 'figure' && elm.querySelector('iframe');

const updateIframeEmbed = ({oldFigure, newFigure}) => {
  // We need to update the figure without touching the iframe
  // to avoid reloading it for every update.
  const oldCaption = oldFigure.querySelector('figcaption');
  const newCaption = newFigure.querySelector('figcaption');

  if (oldCaption && newCaption) {
    oldFigure.replaceChild(newCaption, oldCaption);
  } else if (oldCaption) {
    oldFigure.removeChild(oldCaption);
  } else if (newCaption) {
    oldFigure.appendChild(newCaption);
  }

  // TODO: Update figure attributes.
};

const getKey = (elm) => {
  if (isIframeEmbed(elm)) {
    return elm.querySelector('iframe').id;
  }

  return elm.outerHTML;
};

export default ({oldArticleElm, newArticleElm}) => {
  const newList = Array.from(newArticleElm.childNodes);
  const oldList = Array.from(oldArticleElm.childNodes);

  const patch = (type, prev, next, pos) => {
    switch (type) {
      case CREATE:
        if (next) {
          oldArticleElm.insertBefore(next, oldArticleElm.childNodes[pos] || null);
        }
        break;
      case UPDATE:
        if (isIframeEmbed(prev)) {
          updateIframeEmbed({
            oldFigure: oldArticleElm.childNodes[pos],
            newFigure: next
          });
        }
        break;
      case MOVE:
        oldArticleElm.insertBefore(next, oldArticleElm.childNodes[pos]);
        prev.remove();
        break;
      case REMOVE:
        if (prev && prev.remove) {
          prev.remove();
        }
        break;
    }
  };

  diff(oldList, newList, patch, getKey);
};
