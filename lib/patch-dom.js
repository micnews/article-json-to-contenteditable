/* eslint-disable no-script-url, no-console */

import diff, { CREATE, UPDATE, MOVE, REMOVE } from 'dift';

const isIframeEmbed = elm => elm && elm.tagName &&
  elm.tagName.toLowerCase() === 'figure' && elm.querySelector('iframe');

const updateIframeEmbed = ({ oldFigure, newFigure }) => {
  if (!oldFigure || !newFigure) {
    console.error('missing old or new figure', { oldFigure, newFigure });
    return;
  }
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

  const oldAttributes = Array.from(oldFigure.attributes);
  const newAttributes = Array.from(newFigure.attributes);

  oldAttributes.forEach(({ name }) => {
    oldFigure.removeAttribute(name);
  });

  newAttributes.forEach(({ name, value }) => {
    oldFigure.setAttribute(name, value);
  });
};

const getKey = (elm) => {
  if (isIframeEmbed(elm)) {
    const iframe = elm.querySelector('iframe');
    return iframe.src !== 'javascript:false' ? iframe.src : iframe.id;
  }

  return elm.outerHTML;
};

export default ({ oldArticleElm, newArticleElm }) => {
  const newList = Array.from(newArticleElm.childNodes);
  const oldList = Array.from(oldArticleElm.childNodes);
  const queue = {
    create: [],
    update: [],
    remove: [],
    move: [],
  };

  const patch = (type, prev, next, pos) => {
    switch (type) {
      case CREATE:
        if (next) {
          queue.create.push(() => oldArticleElm.insertBefore(
            next, oldArticleElm.childNodes[pos] || null));
        }
        break;
      case UPDATE:
        if (isIframeEmbed(prev)) {
          queue.update.push(() => updateIframeEmbed({
            oldFigure: oldArticleElm.childNodes[pos],
            newFigure: next,
          }));
        }
        break;
      case MOVE:
        queue.move.push(() => {
          // it's already in the right position - can happen if we had a previous
          // move which moved things around
          if (prev === oldArticleElm.childNodes[pos]) {
            return;
          }

          oldArticleElm.insertBefore(prev, oldArticleElm.childNodes[pos]);
        });
        break;
      case REMOVE:
        if (prev && prev.remove) {
          queue.remove.push(() => {
            prev.remove();
          });
        }
        break;
      default:
        break;
    }
  };

  diff(oldList, newList, patch, getKey);
  // Rearrange the order in which these updates are run,
  // doing removes before moves to avoid unnecessary moves.
  queue.create.forEach(fn => fn());
  queue.remove.forEach(fn => fn());
  queue.move.forEach(fn => fn());
  queue.update.forEach(fn => fn());
};
