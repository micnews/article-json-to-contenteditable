import { parseInput as parseEmbeds } from 'embeds';
import test from './helpers/test-runner';
import parseUrl from '../lib/parse-url';

test('parseUrl', (t) => {
  t.equals(parseUrl(), null);
  t.equals(parseUrl({}), null);
  t.equals(parseUrl({
    textContent: 'not a url',
  }), null);

  const fbUrl = 'https://www.facebook.com/zuck/posts/10102593740125791';
  const actualFb = parseUrl({
    textContent: fbUrl,
  });
  const expectedFb = Object.assign(parseEmbeds(fbUrl), {
    type: 'embed',
    embedType: 'facebook',
  });
  t.deepEqual(actualFb, expectedFb);

  const imageUrl = 'http://avatarbox.net/avatars/img32/test_card_avatar_picture_88303.jpg';
  const actualImage = parseUrl({
    textContent: imageUrl,
  });
  const expectedImage = {
    type: 'embed',
    embedType: 'image',
    src: imageUrl,
  };
  t.deepEqual(actualImage, expectedImage);
  t.end();
});
