import diff, {CREATE, UPDATE, MOVE, REMOVE} from 'dift';

const getKey = (elm) => {
  if (elm.tagName.toLowerCase() === 'figure' && elm.querySelector('iframe')) {
    // TODO: Handle if caption has changed, we should prob handle that in update (above)
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
        // we never end up here since equality for us means that things are equal
        break;
      case MOVE:
        // TODO: Implement move
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
