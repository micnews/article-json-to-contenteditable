import {parseInput as parseEmbeds} from 'embeds';
import objectAssign from 'object-assign';
import isUrl from 'is-url';
import isImageUrl from 'is-image-url';

export default (elm) => {
  if (!elm) {
    return null;
  }

  const content = elm.textContent || '';
  if (!isUrl(content)) {
    return null;
  }

  if (isImageUrl(content)) {
    return {
      type: 'embed',
      embedType: 'image',
      src: content
    };
  }

  const parsed = parseEmbeds(content);
  if (!parsed) {
    return null;
  }

  return objectAssign({}, parsed, {
    embedType: parsed.type,
    type: 'embed'
  });
};
