import {parseInput as parseEmbeds} from 'embeds';
import objectAssign from 'object-assign';
import isUrl from 'is-url';
import isImage from 'is-image';
import embeds from './embeds';

const validEmbedTypes = Object.keys(embeds);
const isValidEmbedType = ({type}) => validEmbedTypes.indexOf(parsed.type) !== -1;

export default (elm) => {
  if (!elm) {
    return null;
  }

  const content = elm.textContent || '';
  if (!isUrl(content)) {
    return null;
  }

  if (isImage(content)) {
    return {
      type: 'embed',
      embedType: 'image',
      src: content
    };
  }

  const parsed = parseEmbeds(content);
  if (!parsed || !isValidEmbedType(parsed)) {
    return null;
  }

  return objectAssign({}, parsed, {
    embedType: parsed.type,
    type: 'embed'
  });
};
