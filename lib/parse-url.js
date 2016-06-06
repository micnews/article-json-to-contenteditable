import {parseInput as parseEmbeds} from 'embeds';
import objectAssign from 'object-assign';

export default (elm) => {
  if (!elm) {
    return null;
  }

  const content = elm.textContent || '';
  if (content.substring(0, 4) !== 'http') {
    return null;
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
