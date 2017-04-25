/* eslint-disable import/no-extraneous-dependencies */

import test from 'tape-catch';

if (process.browser) {
  test.onFinish(global.close);
}

export default test;
