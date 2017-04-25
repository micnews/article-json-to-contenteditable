/* eslint-disable import/no-extraneous-dependencies */

import _test from 'tape-catch';
import { jsdom } from 'jsdom';

const test = process.browser
? (msg, opts, cb) => {
  const { document: oldDoc, window: oldWin, navigator: oldNav } = global;

  global.document = jsdom('');
  global.window = global.document.defaultView;
  global.window.document = global.document;
  global.navigator = global.window.navigator;

  _test.onFinish(() => {
    global.document = oldDoc;
    global.window = oldWin;
    global.navigator = oldNav;
    global.close();
  });

  _test(msg, opts, cb);
} : _test;

export default test;
