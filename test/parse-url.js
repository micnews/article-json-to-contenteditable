import test from 'tape-catch';
import parseUrl from '../lib/parse-url';
import {parseInput as parseEmbeds} from 'embeds';

test('parseUrl', t => {
  t.equals(parseUrl(), null);
  t.equals(parseUrl({}), null);
  t.equals({
    textContent: 'not a url'
  }, null);

  const fbUrl = 'https://www.facebook.com/zuck/posts/10102593740125791';
  t.equals({
    textContent: fbUrl
  }, parseEmbeds(fbUrl));
  t.end();
});
